export interface Build {
	name: string;
	version: string;
	build: string;
	time: Date;
	downloads: Record<string, {
		url: string;
		size: number;
		sha1: string
	}>;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function rawDataToBuild(data: any): Build {
	return {
		name: `vanilla-${data.id}.jar`,
		version: data.id,
		build: 'latest',
		time: data.releaseTime,
		downloads: data.downloads,
	};
}
