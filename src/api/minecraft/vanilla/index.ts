import { StatusError } from 'itty-router-extras';

import { Build, rawDataToBuild } from '~/api/minecraft/vanilla/build';
import { Manifest, rawDataToManifest } from '~/api/minecraft/vanilla/manifest';
import { Provider } from '~/api/minecraft/vanilla/provider';
import { Version } from '~/api/minecraft/vanilla/version';
import cachedFetch from '~/cachedFetch';

class Vanilla {
	private readonly launcherMeta: string;

	/**
	 * ?
	 * @param launcherMeta
	 */
	public constructor(launcherMeta: string) {
		this.launcherMeta = launcherMeta;
	}

	/**
	 * ?
	 * @returns ?
	 */
	async getManifest(): Promise<Manifest | null> {
		const res = await this.cachedFetch(this.launcherMeta);
		if (res === null) return null;

		return rawDataToManifest(await res.json());
	}

	/**
	 * ?
	 * @param version ?
	 * @returns ?
	 */
	async getVersion(version: string): Promise<Version | null> {
		const manifest = await this.getManifest();
		if (manifest === null) {
			return null;
		}

		const v = manifest.versions.filter(value => value.version === version);
		if (v.length === 0) {
			return null;
		}

		return v[0];
	}

	/**
	 * ?
	 * @param version ?
	 * @returns ?
	 */
	async getBuild(version: string): Promise<Build | null> {
		const fetchedVersion = await this.getVersion(version);
		if (fetchedVersion === null) {
			return null;
		}

		const res = await this.cachedFetch(fetchedVersion.metadataURL);
		if (res === null) {
			return null;
		}

		return rawDataToBuild(await res.json());
	}

	/**
	 * ?
	 * @param version ?
	 * @returns ?
	 */
	async getDownload(version: string): Promise<Response | null> {
		const build = await this.getBuild(version);
		if (build === null) {
			return null;
		}

		const res = await this.fetch(
			build.downloads.server.url,
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
				`vanilla-${version}.jar`,
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

export { Provider,Vanilla };
