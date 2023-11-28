import { StatusError } from 'itty-router-extras';

import { Build, rawDataToBuild } from '~/api/minecraft/purpur/build';
import { Project, rawDataToProject } from '~/api/minecraft/purpur/project';
import { Provider } from '~/api/minecraft/purpur/provider';
import { rawDataToVersion, Version } from '~/api/minecraft/purpur/version';
import cachedFetch from '~/cachedFetch';

class Purpur {
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
	async getProjects(): Promise<Project[]> {
		return [];
	}

	/**
	 * ?
	 * @param project ?
	 * @returns ?
	 */
	async getProject(project: string): Promise<Project | null> {
		const res = await this.cachedFetch(`/${project}`);
		if (res === null) {
			return null;
		}
		return rawDataToProject(await res.json());
	}

	/**
	 * ?
	 * @param project ?
	 * @param version ?
	 * @returns ?
	 */
	async getVersion(project: string, version: string): Promise<Version | null> {
		const res = await this.cachedFetch(`/${project}/${version}`);
		if (res === null) {
			return null;
		}
		return rawDataToVersion(await res.json());
	}

	/**
	 * ?
	 * @param project ?
	 * @param version ?
	 * @param build ?
	 * @returns ?
	 */
	async getBuild(project: string, version: string, build: string): Promise<Build | null> {
		const res = await this.cachedFetch(`/${project}/${version}/${build}`);
		if (res === null) {
			return null;
		}

		const b = rawDataToBuild(await res.json());

		if (b.result !== 'SUCCESS') {
			throw new StatusError(400, 'build is bad, m\'kay');
		}

		return b;
	}

	/**
	 * ?
	 * @param project ?
	 * @param version ?
	 * @param build ?
	 * @returns ?
	 */
	async getDownload(project: string, version: string, build: string): Promise<Response | null> {
		const res = await this.fetch(`/${project}/${version}/${build}/download`, {
			cf: {
				cacheEverything: true,
				cacheTtl: 24 * 60 * 60,
			},
			headers: {
				Accept: 'application/java-archive, application/json',
			},
		});
		if (res === null) {
			return null;
		}

		const r = new Response(res.body, { ...res, headers: {} });
		r.headers.set(
			'Content-Disposition',
			`attachment; filename=${JSON.stringify(
				project + '-' + version + '-' + build + '.jar',
			)}`,
		);
		r.headers.set('Content-Type', 'application/java-archive');
		return r;
	}

	/**
	 * ?
	 * @param input ?
	 * @param init ?
	 * @returns ?
	 */
	private async cachedFetch(input: string, init?: RequestInit): Promise<Response | null> {
		const res = await cachedFetch(this.baseURL + input, init);
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
		const res = await fetch(this.baseURL + input, options);
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

export { Provider, Purpur };
