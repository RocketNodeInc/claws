import { parse, SemVer, valid } from 'semver';

import vanilla from '~/editions/vanilla';

function groupKeysByValue(obj: {[key: string]: string}): {[key: string]: string[]} {
	return Object.entries(obj).reduce((acc: {[key: string]: string[]}, [key, value]) => {
		acc[value] = acc[value] ? [...acc[value], key] : [key];
		return acc;
	}, {});
}

function stripVersion(version: SemVer): string {
	return `${version.major}.${version.minor}.${version.patch}`;
}

export async function versionMapper(versions: string[] = []): Promise<{ [key: string]: string[] }> {
	if (versions.length === 0) versions = await vanilla.provider?.getProject()?.then((v) => v?.versions) || [];
	if (!versions) throw new Error('No versions found');

	versions = versions.reverse();

	console.log(versions);

	let temp = 0;
	const m: { [key: string]: string } = {};
	for (let i = 0; i < versions.length; i++) {
		const version = versions[i];

		if (!valid(version)) {
			temp += 1;
			continue;
		}

		const semVersion = parse(version)!;
		const raw = stripVersion(semVersion);
		m[version] = raw;

		if (temp > 0) {
			for (let j = 0; j < temp; j++) {
				m[versions[(i - 1) - j]] = raw;
			}
			temp = 0;
		}
	}

	console.log(m);

	return groupKeysByValue(m);
}
