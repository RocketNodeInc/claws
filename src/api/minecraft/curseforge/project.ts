import comparator from '~/comparator';

export interface Project {
	projectId: string;
	projectName: string;
	versionGroups: string[];
	versions: string[];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function rawDataToProject(data: any): Project {
	return {
		projectId: data.project_id,
		projectName: data.project_name,
		versionGroups: data.version_groups.sort(comparator).reverse(),
		versions: data.versions.sort(comparator).reverse(),
	};
}
