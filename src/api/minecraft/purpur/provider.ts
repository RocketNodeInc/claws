import { Purpur } from '~/api/minecraft/purpur/index';
import { Build, EditionProvider, EditionProviderHandler, ProviderHandler, ProviderType, Version } from '~/schema';

export class Provider implements EditionProviderHandler {
	private readonly purpur: Purpur;
	private readonly project: EditionProvider;

	public constructor(purpur: Purpur, project: EditionProvider) {
		this.purpur = purpur;
		this.project = project;
	}

	async getProject(): Promise<EditionProvider | null> {
		const p = await this.purpur.getProject(this.project.slug);
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
		const v = await this.purpur.getVersion(this.project.slug, version);
		if (v === null) {
			return v;
		}
		return {
			name: v.version,
			builds: v.builds.all,
		};
	}

	async getBuild(version: string, build: string): Promise<Build | null> {
		if (build === 'latest') {
			const latestBuild = await this.getVersion(version);
			if (latestBuild === null) {
				return null;
			}
			build = latestBuild.builds[0] || '';
			if (build === '') {
				return null;
			}
		}

		// TODO: Catch failed build and keep trying lower builds until a maximum of 5 failed builds are reached.
		const b = await this.purpur.getBuild(this.project.slug, version, build);
		if (b === null) {
			return null;
		}
		return {
			id: build,
			download: {
				name: `${this.project.slug}-${version}-${build}.jar`,
				url: `/api/v1/projects/${this.project.slug}/versions/${version}/builds/${build}/download`,
				builtAt: b.timestamp,
				checksums: {
					md5: b.md5,
				},
				metadata: {},
			},
		};
	}

	async getDownload(version: string, build: string): Promise<Response | null> {
		return this.purpur.getDownload(this.project.slug, version, build);
	}
}
