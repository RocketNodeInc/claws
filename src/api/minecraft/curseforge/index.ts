import { StatusError } from 'itty-router-extras';

import { ModLoaderType } from '~/api/minecraft/curseforge/types/enums';
import { Mod } from '~/api/minecraft/curseforge/types/Mod';
import { ModFile } from '~/api/minecraft/curseforge/types/ModFile';
import { PagingOptions, SearchOptions } from '~/api/minecraft/curseforge/types/types';
import cachedFetch from '~/cachedFetch';

import { Provider } from './provider';

class Curseforge {
	private readonly baseURL: string;

	/**
	 * ?
	 * @param baseURL ?
	 * @param env ?
	 */
	public constructor(baseURL: string) {
		this.baseURL = baseURL;
	}

	private getHeaders = () => ({
		// Can be set via cloudflare workers secrets
		// @ts-ignore
		"x-api-key": globalThis?.env?.CURSEFORGE_API_KEY,
	});


	async searchMods(options: SearchOptions & PagingOptions): Promise<Mod[]> {
		const uri = new URL(`v1/mods/search`, this.baseURL);

		uri.searchParams.set('gameId', '432'); // minecraft
		uri.searchParams.set('classId', '4471'); // modpacks
		if(options) {
			for(const key of Object.keys(options)){
				// @ts-ignore
				if (options[key] !== undefined && options[key] !== null)
					// @ts-ignore
					uri.searchParams.set(key, options[key]);
			}
		}

		// TODO: Change to cachedFetch
		const res = await this.fetch(uri.toString(), { headers: this.getHeaders() });
		if (res === null) { return []; }

		const json: any = await res.json();
		if (json === null) return [];

		const mods = [];
		for(const file of json.data) {
			mods.push(new Mod(this, file));
		}

		return mods;
	}

	async getMod(modId: number): Promise<Mod | null> {
		const uri = new URL(`v1/mods/${modId}`, this.baseURL);

		const res = await this.cachedFetch(uri.toString(), { headers: this.getHeaders() });
		if (res === null) { return null; }

		const json: any = await res.json();
		if (json === null) return null;

		return new Mod(this, json.data);
	}

	// This uses the getFiles function.
	// getFiles will return the latest files and it tells us if there are server packs available.
	// If there are server packs available, this creates a list and fetches them from the API.
	// This function does a lot of API requests and is not very efficient, so we run it in parallel.
	async getServerFiles(modId: number, searchOptions: {gameVersion?: string, modLoaderType?: ModLoaderType | number, gameVersionTypeId?: number} & PagingOptions): Promise<ModFile[]> {
		const files = await this.getFiles(modId, searchOptions);
		const getFilePromises: Promise<ModFile | undefined>[] = [];

		for (const file of files) {
			if (file.serverPackFileId) {
				// Instead of waiting here, push the promise to the array to run later in parallel
				getFilePromises.push(this.getFile(file.modId, file.serverPackFileId));
			} else if (file.isServerPack) {
				// Immediately resolved promise for server packs
				getFilePromises.push(Promise.resolve(file));
			}
		}

		return (await Promise.all(getFilePromises)).filter((file): file is ModFile => file !== undefined);
	}


	// If the given id is a server pack, return that.
	// If the given id is a mod, with a server pack, fetch and return that.
	// If the given id is a mod, without a server pack (or not a mod), return undefined.
	async getServerFile(modId: number, fileId: number): Promise<ModFile | undefined> {
		const file = await this.getFile(modId, fileId);

		if(file && file.isServerPack) return file;
		else if(file && file.serverPackFileId) return this.getFile(modId, file.serverPackFileId);

		return undefined;
	}


	async getFiles(modId: number, searchOptions: {gameVersion?: string, modLoaderType?: ModLoaderType | number, gameVersionTypeId?: number} & PagingOptions): Promise<ModFile[]> {
		const uri = new URL(`v1/mods/${modId}/files`, this.baseURL);

		if(searchOptions){
			if(searchOptions.gameVersion) uri.searchParams.set("gameVersion", searchOptions.gameVersion);
			if(searchOptions.modLoaderType) uri.searchParams.set("modLoaderType", searchOptions.modLoaderType.toString());
			if(searchOptions.gameVersionTypeId) uri.searchParams.set("gameVersionTypeId", searchOptions.gameVersionTypeId.toString());
			if(searchOptions.index) uri.searchParams.set("index", searchOptions.index.toString());
			if(searchOptions.pageSize) uri.searchParams.set("pageSize", searchOptions.pageSize.toString());
		}

		const res = await this.cachedFetch(uri.toString(), { headers: this.getHeaders() });
		if (res === null) return [];

		const json: any = await res.json();
		if (json === null) return [];

		const files = [];
		for(const file of json.data) {
			files.push(new ModFile(this, file));
		}

		return files;
	}

	async getFile(modId: number, fileId: number): Promise<ModFile | undefined> {
		const uri = new URL(`v1/mods/${modId}/files/${fileId}`, this.baseURL);

		const res = await this.cachedFetch(uri.toString(), { headers: this.getHeaders() });
		if (res === null) return undefined;

		const json: any = await res.json();
		if (json === null) return undefined;

		return new ModFile(this, json.data);
	}

	async getDownload(modfile: ModFile): Promise<Response | null> {
		const url = modfile.downloadUrl ?? `https://www.curseforge.com/api/v1/mods/${modfile.modId}/files/${modfile.id}/download`;

		const res = await this.fetch(
			url,
			{
				cf: {
					cacheEverything: true,
					cacheTtl: 24 * 60 * 60,
				},
				headers: this.getHeaders(),
			},
		);
		if (res === null) {
			return null;
		}

		const r = new Response(res.body, { ...res, headers: {} });
		r.headers.set(
			'Content-Disposition',
			`attachment; filename=${JSON.stringify(
				modfile.fileName,
			)}`,
		);
		r.headers.set('Content-Type', 'application/octet-stream');
		return r;
	}

	/**
	 * ?
	 * @param input ?
	 * @param init ?
	 * @returns ?
	 */
	private async cachedFetch(input: string, init?: RequestInit): Promise<Response | null> {
		const res = await cachedFetch(input, init);
		switch (res.status) {
			case 200:
				break;
			case 404:
				return null;
			default:
				throw new StatusError(res.status, '');
		}
		return res;
	}

	/**
	 * ?
	 * @param input ?
	 * @param init ?
	 * @returns ?
	 */
	private async fetch(input: string, init?: RequestInit): Promise<Response | null> {
		const options = init || {};
		options.headers = {
			...options.headers,
		};
		const res = await fetch(input, options);
		switch (res.status) {
			case 200:
				break;
			case 404:
				return null;
			default:
				throw new StatusError(res.status, '');
		}
		return res;
	}
}

export { Curseforge, Provider };
