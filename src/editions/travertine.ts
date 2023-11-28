import { PaperMC, Provider } from '~/api/minecraft/papermc';
import { EditionProvider, ProviderType } from '~/schema';

const travertine: EditionProvider = {
	slug: 'travertine',
	name: 'Travertine',
	type: ProviderType.EDITION,
};

travertine.provider = new Provider(new PaperMC('https://papermc.io/api/v2'), travertine);

export default travertine;
