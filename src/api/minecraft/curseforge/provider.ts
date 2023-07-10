import { FileHashAlgorithms, ModsSearchSortField } from '~/api/minecraft/curseforge/types/enums';
import { ModFile } from '~/api/minecraft/curseforge/types/ModFile';
import { Mod, ModBuild, ModProvider, ModProviderHandler, ProviderType } from '~/schema';
import { versionMapper } from '~/util/versionMapper';

import { Curseforge } from '.';

export class Provider implements ModProviderHandler {
	private readonly curseforge: Curseforge;
	private readonly project: ModProvider;

	public constructor(curseforge: Curseforge, project: ModProvider) {
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
			icon: mod.logo?.url,
		}));
	}

	async getMod(modId: string): Promise<Mod | null> {
		const mod = await this.curseforge.getMod(Number(modId));
		if (mod === null) return null;

		return {
			id: mod.id.toString(),
			name: mod.name,
			latestGameVersion: mod?.latestFiles[0]?.gameVersions[0] ?? 'latest',
			latestVersion: mod?.latestFiles[0]?.displayName ?? 'latest',
			icon: mod.logo?.url,
		};
	}

	async getFiles(mod: string, serverOnly: boolean): Promise<ModBuild[] | null> {
		let files = await (serverOnly ? this.curseforge.getServerFiles(Number(mod), {}) : this.curseforge.getFiles(Number(mod), {}));
		files = files.filter(f => f.isServerPack || !!f.serverPackFileId);

		return files.map((file) => ({
			id: file.id.toString(),
			download: {
				name: file.fileName,
				url: `/api/v1/projects/${this.project.slug}/mods/${file.modId}/files/${file.id}/download`,
				builtAt: file.fileDate,
				gameVersion: file.gameVersions[0] ?? 'latest',
				checksums: {
					sha1: file.hashes.find(h => h.algo === FileHashAlgorithms.SHA1)?.value,
					md5: file.hashes.find(h => h.algo === FileHashAlgorithms.MD5)?.value,
				},
				serverPack: file.isServerPack ?? false,
				serverPackFileId: file.serverPackFileId ?? undefined,
				metadata: {
					size: file.fileLength,
				},
			},
		}));
	}

	async getFile(mod: string, fileId: string, serverOnly: boolean): Promise<ModBuild | null> {
		let file: ModFile | undefined;
		if (fileId === 'latest') {
			const latestFile = await this.curseforge.getFiles(Number(mod), {}).then(files => files[0]);
			if (serverOnly && latestFile) {
				if (latestFile?.isServerPack) file = latestFile;
				else file = await this.curseforge.getServerFile(Number(mod), latestFile.id);
			} else file = latestFile;
		}
		else file = await (serverOnly ? this.curseforge.getServerFile(Number(mod), Number(fileId)) : this.curseforge.getFile(Number(mod), Number(fileId)));

		if (file === undefined) return null;

		const mapped: { [k: string]: string[] } = await versionMapper();
		const gameVersion = Object.entries(mapped).find(([, versions]) => versions.some(v => file!.gameVersions.includes(v)))?.[0] ?? 'latest';

		return {
			id: file.id.toString(),
			download: {
				name: file.fileName,
				url: `/api/v1/projects/${this.project.slug}/mods/${file.modId}/files/${file.id}/download`,
				builtAt: file.fileDate,
				gameVersion,
				checksums: {
					sha1: file.hashes.find(h => h.algo === FileHashAlgorithms.SHA1)?.value,
					md5: file.hashes.find(h => h.algo === FileHashAlgorithms.MD5)?.value,
				},
				serverPack: file.isServerPack ?? false,
				serverPackFileId: file.serverPackFileId ?? undefined,
				metadata: {
					size: file.fileLength,
				},
			},
		};
	}

	async getDownload(mod: string, fileId: string): Promise<Response | null> {
		const file = await this.curseforge.getFile(Number(mod), Number(fileId));
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
