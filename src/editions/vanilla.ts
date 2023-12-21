import { Provider, Vanilla } from '~/api/minecraft/vanilla';
import { EditionProvider, ProviderType } from '~/schema';

const vanilla: EditionProvider = {
	slug: 'vanilla',
	name: 'Vanilla',
	icon: 'https://imagedelivery.net/fcS-Eb3CuvKDsSNDBD51Fg/3000e55a-bbd9-45ff-ed57-eceb2e0c6400/public',
	type: ProviderType.EDITION,
};

vanilla.provider = new Provider(new Vanilla('https://launchermeta.mojang.com/mc/game/version_manifest.json'), vanilla);

export default vanilla;
