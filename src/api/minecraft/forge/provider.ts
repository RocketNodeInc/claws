import { Forge } from '~/api/minecraft/forge/index';
import { Build, EditionProvider, EditionProviderHandler, ProviderHandler, ProviderType, Version } from '~/schema';

export class Provider implements EditionProviderHandler {
	private readonly forge: Forge;
	private readonly project: EditionProvider;

	public constructor(forge: Forge, project: EditionProvider) {
		this.forge = forge;
		this.project = project;
	}

	async getProject(): Promise<EditionProvider | null> {
		const p = await this.forge.getProject();
		if (p === null) {
			return null;
		}
		return {
			slug: this.project.slug,
			name: this.project.name,
			versions: p.versions,
			type: ProviderType.EDITION,
		};
	}

	async getVersion(version: string): Promise<Version | null> {
		const v = await this.forge.getVersion(version);
		if (v === null) {
			return v;
		}
		return {
			name: v.version,
			builds: v.builds.map((v) => v.toString()),
		};
	}

	async getBuild(version: string, build: string): Promise<Build | null> {
		if (build === 'latest') {
			const latestBuild = await this.getVersion(version);
			if (latestBuild === null) return null;

			build = latestBuild.builds[0] || '';
			if (build === '') return null;
		}

		const b = await this.forge.getBuild(version, build);
		if (b === null) return null;

		return {
			id: build,
			download: {
				name: b.version,
				url: `/api/v1/projects/${this.project.slug}/versions/${version}/builds/${build}/download`,
				builtAt: new Date(b.releaseTime),
				checksums: {},
				metadata: {},
			},
		};
	}

	async getDownload(version: string, build: string): Promise<Response | null> {
		if (build === 'latest') {
			const latestBuild = await this.getVersion(version);
			if (latestBuild === null) return null;

			build = latestBuild.builds[0] || '';
			if (build === '') return null;
		}

		const b = await this.forge.getBuild(version, build);
		if (b === null) return null;

		return this.forge.getDownload(version, b);
	}
}
