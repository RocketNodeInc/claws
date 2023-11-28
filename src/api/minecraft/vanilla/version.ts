export interface Version {
	version: string;
	type: string;
	metadataURL: string;
	time: string;
	releaseTime: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function rawDataToVersion(data: any): Version {
	return {
		version: data.id,
		type: data.type,
		metadataURL: data.url,
		time: data.time,
		releaseTime: data.releaseTime,
	};
}
