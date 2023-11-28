import forge from '~/editions/forge';
import paper from '~/editions/paper';
import purpur from '~/editions/purpur';
import travertine from '~/editions/travertine';
import vanilla from '~/editions/vanilla';
import waterfall from '~/editions/waterfall';
import { EditionProvider } from '~/schema';

const editions: Record<string, EditionProvider> = {
	paper,
	purpur,
	travertine,
	waterfall,
	vanilla,
	forge,
};

export default editions;

export { forge,paper, purpur, travertine, vanilla, waterfall };
