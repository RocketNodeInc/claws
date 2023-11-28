export interface Version {
	projectId: string;
	projectName: string;
	version: string;
	builds: number[];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function rawDataToVersion(data: any): Version {
	return {
		projectId: data.project_id,
		projectName: data.project_name,
		version: data.version,
		builds: (data.builds as number[]).sort((a, b) => b - a),
	};
}
