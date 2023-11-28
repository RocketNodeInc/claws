import { paper, purpur, travertine, vanilla, waterfall } from '~/editions';
import { curseforge } from '~/mods';
import { Category } from '~/schema';

const minecraft: Category = {
	slug: 'minecraft',
	name: 'Minecraft',
	editionProviders: [
		{
			slug: paper.slug,
			name: paper.name,
			type: paper.type,
		},
		{
			slug: purpur.slug,
			name: purpur.name,
			type: purpur.type,
		},
		{
			slug: travertine.slug,
			name: travertine.name,
			type: travertine.type,
		},
		{
			slug: waterfall.slug,
			name: waterfall.name,
			type: waterfall.type,
		},
		{
			slug: vanilla.slug,
			name: vanilla.name,
			type: vanilla.type,
		},
	],
	modProviders: [
		{
			slug: curseforge.slug,
			name: curseforge.name,
			type: curseforge.type,
		},
	],
};

export default minecraft;
