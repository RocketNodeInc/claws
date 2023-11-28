import editions from '~/editions';
import mods from '~/mods';
import { Provider } from '~/schema';

const projects: Record<string, Provider> = {
	...mods,
	...editions,
};

export default projects;
