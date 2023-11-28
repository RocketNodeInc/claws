import { PaperMC, Provider } from '~/api/minecraft/papermc';
import { EditionProvider, ProviderType } from '~/schema';

const waterfall: EditionProvider = {
	slug: 'waterfall',
	name: 'Waterfall',
	type: ProviderType.EDITION,
};

waterfall.provider = new Provider(new PaperMC('https://papermc.io/api/v2'), waterfall);

export default waterfall;
