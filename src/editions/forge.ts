import { Forge, Provider } from '~/api/minecraft/forge/index';
import { EditionProvider, ProviderType } from '~/schema';

const forge: EditionProvider = {
	slug: 'forge',
	name: 'Forge',
	icon: 'https://imagedelivery.net/fcS-Eb3CuvKDsSNDBD51Fg/f0776829-2475-41d9-348d-b0423df75800/public',
	type: ProviderType.EDITION,
};

forge.provider = new Provider(new Forge('https://meta.multimc.org/v1/net.minecraftforge'), forge);

export default forge;
