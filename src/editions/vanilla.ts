import { Provider, Vanilla } from '~/api/minecraft/vanilla';
import { EditionProvider, ProviderType } from '~/schema';

const vanilla: EditionProvider = {
	slug: 'vanilla',
	name: 'Vanilla',
	type: ProviderType.EDITION,
};

vanilla.provider = new Provider(new Vanilla('https://launchermeta.mojang.com/mc/game/version_manifest.json'), vanilla);

export default vanilla;
