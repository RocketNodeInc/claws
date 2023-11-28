import { PaperMC, Provider } from '~/api/minecraft/papermc';
import { EditionProvider, ProviderType } from '~/schema';

const paper: EditionProvider = {
	slug: 'paper',
	name: 'Paper',
	type: ProviderType.EDITION,
};

paper.provider = new Provider(new PaperMC('https://api.papermc.io/v2'), paper);

export default paper;
