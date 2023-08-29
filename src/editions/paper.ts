import { PaperMC, Provider } from '~/api/minecraft/papermc';
import { EditionProvider, ProviderType } from '~/schema';

const paper: EditionProvider = {
	slug: 'paper',
	name: 'Paper',
	icon: 'https://imagedelivery.net/fcS-Eb3CuvKDsSNDBD51Fg/b0050dde-9468-4b57-75c0-bdcee630b000/public',
	type: ProviderType.EDITION,
};

paper.provider = new Provider(new PaperMC('https://api.papermc.io/v2'), paper);

export default paper;
