import { rawDataToVersion, Version } from '~/api/minecraft/vanilla/version';

export interface Manifest {
	projectId: string;
	projectName: string;
	versions: Version[];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function rawDataToManifest(data: any): Manifest {
	return {
		projectId: 'vanilla',
		projectName: 'Vanilla',
		versions: data.versions.map(rawDataToVersion),
	};
}
