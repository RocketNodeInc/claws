interface MavenFile {
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
	mavenFiles: MavenFile[];
	mavenFile: MavenFile;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function rawDataToBuild(data: any): Build {
	console.log(data);
	return { uid: data.uid, version: data.version, releaseTime: data.releaseTime, mavenFiles: data.mavenFiles, mavenFile: data.mavenFiles.find((f: any) => f.name.endsWith(`${data.version}:installer`)) };
}
