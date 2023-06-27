import { FileHashAlgorithms, ModsSearchSortField } from '~/api/minecraft/curseforge/types/enums';
import { Build, EditionProvider, Mod, ModBuild, ModProvider, ModProviderHandler, ProviderType } from '~/schema';

import { Curseforge } from '.';

export class Provider implements ModProviderHandler {
	private readonly curseforge: Curseforge;
	private readonly project: EditionProvider;

	public constructor(curseforge: Curseforge, project: EditionProvider) {
		this.curseforge = curseforge;
		this.project = project;
	}

	async searchMods(query?: string): Promise<Mod[]> {
		let mods = await this.curseforge.searchMods({ searchFilter: query, sortField: ModsSearchSortField.TOTAL_DOWNLOADS, sortOrder: 'desc' });
		mods = mods.filter(m => m.latestFiles.filter(f => f.isServerPack || !!f.serverPackFileId).length > 0);

		return mods.map((mod) => ({
			id: mod.id.toString(),
			name: mod.name,
			latestGameVersion: mod?.latestFiles[0]?.gameVersions[0] ?? 'latest',
			latestVersion: mod?.latestFiles[0]?.displayName ?? 'latest',
			icon: mod.logo.url,
		}));
	}

	async getFiles(mod: string): Promise<ModBuild[] | null> {
		let files = await this.curseforge.getFiles(Number(mod), {});
		files = files.filter(f => f.isServerPack || !!f.serverPackFileId);

		return files.map((file) => ({
			id: file.id.toString(),
			download: {
				name: file.fileName,
				url: file.downloadUrl,
				builtAt: file.fileDate,
				checksums: {
					sha1: file.hashes.find(h => h.algo === FileHashAlgorithms.SHA1)?.value,
					md5: file.hashes.find(h => h.algo === FileHashAlgorithms.MD5)?.value,
				},
				serverPack: file.isServerPack ?? false,
				serverPackFileId: file.serverPackFileId ?? undefined,
				metadata: {},
			},
		}));
	}

	async getFile(mod: string, fileId: string): Promise<ModBuild | null> {
		const file = await this.curseforge.getFile(Number(mod), Number(fileId));
		if (file === undefined) return null;

		return {
			id: file.id.toString(),
			download: {
				name: file.fileName,
				url: file.downloadUrl,
				builtAt: file.fileDate,
				checksums: {
					sha1: file.hashes.find(h => h.algo === FileHashAlgorithms.SHA1)?.value,
					md5: file.hashes.find(h => h.algo === FileHashAlgorithms.MD5)?.value,
				},
				serverPack: file.isServerPack ?? false,
				serverPackFileId: file.serverPackFileId ?? undefined,
				metadata: {},
			},
		};
	}

	async getDownload(mod: string, fileId: string): Promise<Response | null> {
		const file = await this.curseforge.getServerFile(Number(mod), Number(fileId));
		if (file === undefined) return null;

		return this.curseforge.getDownload(file);
	}

	async getProject(): Promise<ModProvider | null> {
		return {
			slug: this.project.slug,
			name: this.project.name,
			type: ProviderType.MOD,
		};
	}
}
