import { PaperMC, Provider } from '~/api/minecraft/papermc';
import { EditionProvider, ProviderType } from '~/schema';

const waterfall: EditionProvider = {
	slug: 'waterfall',
	name: 'Waterfall',
	icon: 'https://imagedelivery.net/fcS-Eb3CuvKDsSNDBD51Fg/58bd0a2f-d1c1-41e7-05c6-05d302005f00/public',
	type: ProviderType.EDITION,
};

waterfall.provider = new Provider(new PaperMC('https://papermc.io/api/v2'), waterfall);

export default waterfall;
