import { Curseforge, Provider } from '~/api/minecraft/curseforge';
import { EditionProvider, ModProvider, ProviderType } from '~/schema';

const curseforge: ModProvider = {
	slug: 'curseforge',
	name: 'Curseforge',
	type: ProviderType.MOD,
};

curseforge.provider = new Provider(new Curseforge('https://api.curseforge.com/v1'), curseforge);

export default curseforge;
