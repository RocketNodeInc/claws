import { Vanilla } from '~/api/minecraft/vanilla/index';
import { Build, EditionProvider, EditionProviderHandler, ProviderType, Version } from '~/schema';

export class Provider implements EditionProviderHandler {
	private readonly vanilla: Vanilla;
	private readonly project: EditionProvider;

	public constructor(vanilla: Vanilla, project: EditionProvider) {
		this.vanilla = vanilla;
		this.project = project;
	}

	async getProject(): Promise<EditionProvider | null> {
		const p = await this.vanilla.getManifest();
		if (p === null) return null;

		return {
			slug: this.project.slug,
			name: this.project.name,
			versions: p.versions.map(version => version.version),
			type: ProviderType.EDITION,
		};
	}

	async getVersion(version: string): Promise<Version | null> {
		const v = await this.vanilla.getVersion(version);
		if (v === null) {
			return v;
		}
		return {
			name: v.version,
			builds: ['latest'],
		};
	}

	async getBuild(version: string, build: string): Promise<Build | null> {
		if (build !== 'latest') {
			return null;
		}

		const b = await this.vanilla.getBuild(version);
		if (b === null) {
			return null;
		}
		const d = b.downloads.server;
		return {
			id: build,
			download: {
				name: b.name,
				url: `/api/v1/projects/${this.project.slug}/versions/${version}/builds/${build}/download`,
				builtAt: b.time,
				checksums: {
					sha1: d.sha1,
				},
				metadata: {},
			},
		};
	}

	async getDownload(version: string, build: string): Promise<Response | null> {
		if (build !== 'latest') {
			return null;
		}
		return this.vanilla.getDownload(version);
	}
}
