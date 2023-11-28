export interface Version {
	version: string;
	builds: number[];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function rawDataToVersion(version: any, data: any): Version {
	return {
		version: version.requires[0].equals,
		builds: data.filter((v: any) => v.requires[0].equals === version.requires[0].equals).map((r: any) => r.version),
	};
}
