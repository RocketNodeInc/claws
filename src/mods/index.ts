import { EditionProvider, ModProvider } from '~/schema';

import curseforge from './curseforge';

const mods: Record<string, ModProvider> = {
	curseforge,
};

export default mods;

export { curseforge };
