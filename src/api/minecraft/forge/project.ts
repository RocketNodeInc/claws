import comparator from '~/comparator';

export interface Project {
	name: string;
	uid: string;
	versions: string[];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function rawDataToProject(data: any): Project {
	return {
		name: data.name,
		uid: data.uid,
		// @ts-expect-error
		versions: [...new Set(data.versions.map(x => x.requires.find(r => r.uid === 'net.minecraft')).map(x => x.equals))].sort(comparator).reverse(),
	};
}
