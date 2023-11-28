import { Provider, Purpur } from '~/api/minecraft/purpur';
import { EditionProvider, ProviderType } from '~/schema';

const purpur: EditionProvider = {
	slug: 'purpur',
	name: 'Purpur',
	type: ProviderType.EDITION,
};

purpur.provider = new Provider(new Purpur('https://api.purpurmc.org/v2'), purpur);

export default purpur;
