import { Provider, Purpur } from '~/api/minecraft/purpur';
import { EditionProvider, ProviderType } from '~/schema';

const purpur: EditionProvider = {
	slug: 'purpur',
	name: 'Purpur',
	icon: 'https://imagedelivery.net/fcS-Eb3CuvKDsSNDBD51Fg/0f73e009-7b3a-4ea4-6555-fb1316b9e800/public',
	type: ProviderType.EDITION,
};

purpur.provider = new Provider(new Purpur('https://api.purpurmc.org/v2'), purpur);

export default purpur;
