import { PaperMC, Provider } from '~/api/minecraft/papermc';
import { EditionProvider, ProviderType } from '~/schema';

const travertine: EditionProvider = {
	slug: 'travertine',
	name: 'Travertine',
	icon: 'https://imagedelivery.net/fcS-Eb3CuvKDsSNDBD51Fg/b0050dde-9468-4b57-75c0-bdcee630b000/public',
	type: ProviderType.EDITION,
};

travertine.provider = new Provider(new PaperMC('https://papermc.io/api/v2'), travertine);

export default travertine;
