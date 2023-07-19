interface File {
	downloads: {
		artifact: {
			path: string;
			name: string;
			sha1: string;
			size: number;
			url: string;
		}
	}, name: string
}

export interface Build {
	uid: string;
	version: string;
	releaseTime: string;
	mavenFiles?: File[];
	libraries: File[];
	installerFile?: File;
	universalFile?: File;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function rawDataToBuild(data: any): Build {
	console.log(data);
	return {
		uid: data.uid,
		version: data.version,
		releaseTime: data.releaseTime,
		mavenFiles: data.mavenFiles,
		libraries: data.libraries,
		installerFile: data.mavenFiles?.find((f: any) => f.name.endsWith(`${data.version}:installer`)),
		universalFile: data.libraries?.find((f: any) => f.name.endsWith(`${data.version}:universal`)),
	};
}
