import { Forge, Provider } from '~/api/minecraft/forge/index';
import { EditionProvider, ProviderType } from '~/schema';

const forge: EditionProvider = {
	slug: 'forge',
	name: 'Forge',
	icon: 'https://multimc.org/assets/logos/forge.png',
	type: ProviderType.EDITION,
};

forge.provider = new Provider(new Forge('https://meta.multimc.org/v1/net.minecraftforge'), forge);

export default forge;
