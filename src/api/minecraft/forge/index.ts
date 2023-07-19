import { StatusError } from 'itty-router-extras';

import { Build, rawDataToBuild } from '~/api/minecraft/forge/build';
import { Project, rawDataToProject } from '~/api/minecraft/forge/project';
import { Provider } from '~/api/minecraft/forge/provider';
import { rawDataToVersion, Version } from '~/api/minecraft/forge/version';
import cachedFetch from '~/cachedFetch';

class Forge {
	private readonly baseURL: string;

	/**
	 * ?
	 * @param baseURL ?
	 */
	public constructor(baseURL: string) {
		this.baseURL = baseURL;
	}

	/**
	 * ?
	 * @returns ?
	 */
	async getProject(): Promise<Project | null> {
		const res = await this.cachedFetch('/index.json');
		if (res === null) return null;

		return rawDataToProject(await res.json());
	}

	/**
	 * ?
	 * @param version ?
	 * @returns ?
	 */
	async getVersion(version: string): Promise<Version | null> {
		const res = await this.cachedFetch('/index.json');
		if (res === null) return null;

		const json: Record<string, any> = await res.json();
		const ver = json.versions.find((v: any) => v.requires.find((r: any) => r.equals === version));
		console.log('hello');
		console.log(ver);
		if (!ver) return null;

		return rawDataToVersion(ver, json.versions);
	}

	/**
	 * ?
	 * @param _version ?
	 * @param build ?
	 * @returns ?
	 */
	async getBuild(_version: string, build: string): Promise<Build | null> {
		const res = await this.cachedFetch(`/${build}.json`);
		if (res === null) return null;

		return rawDataToBuild(await res.json());
	}

	/**
	 * ?
	 * @param version ?
	 * @param build ?
	 * @returns ?
	 */
	async getDownload(version: string, build: Build): Promise<Response | null> {
		const res = await this.fetchNoBase(build.mavenFile.downloads.artifact.url,
			{
				cf: {
					cacheEverything: true,
					cacheTtl: 24 * 60 * 60,
				},
				headers: {
					Accept: 'application/java-archive, application/json',
				},
			},
		);
		if (res === null) {
			return null;
		}

		const r = new Response(res.body, { ...res, headers: {} });
		r.headers.set(
			'Content-Disposition',
			`attachment; filename=${JSON.stringify(
				'forge' + '-' + version + '-' + build + '.jar',
			)}`,
		);
		r.headers.set('Content-Type', 'application/java-archive');
		return r;
	}

	private async cachedFetch(input: string, init?: RequestInit): Promise<Response | null> {
		return this.cachedFetchNoBase(this.baseURL + input, init);
	}

	private async cachedFetchNoBase(input: string, init?: RequestInit): Promise<Response | null> {
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

	private async fetch(input: string, init?: RequestInit): Promise<Response | null> {
		return this.fetchNoBase(this.baseURL + input, init);
	}

	private async fetchNoBase(input: string, init?: RequestInit): Promise<Response | null> {
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

export { Forge, Provider };
