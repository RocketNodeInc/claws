import { Build, ProjectProvider, ProviderHandler, Version } from '~/schema';
import {Curseforge} from "~/api/minecraft/curseforge/index";

export class Provider implements ProviderHandler {
	private readonly curseforge: Curseforge;
	private readonly project: ProjectProvider;

	public constructor(curseforge: Curseforge, project: ProjectProvider) {
		this.curseforge = curseforge;
		this.project = project;
	}

	async getProject(): Promise<ProjectProvider | null> {
		const p = await this.curseforge.getProject(this.project.slug);
		if (p === null) {
			return null;
		}
		return {
			slug: this.project.slug,
			name: this.project.name,
			versions: p.versions,
		};
	}

	async getVersion(version: string): Promise<Version | null> {
		const v = await this.curseforge.getVersion(this.project.slug, version);
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
		const b = await this.curseforge.getBuild(this.project.slug, version, build);
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
		return this.curseforge.getDownload(this.project.slug, version, build);
	}
}
