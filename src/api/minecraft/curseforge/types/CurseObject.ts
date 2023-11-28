import { Curseforge } from '~/api/minecraft/curseforge';

export abstract class CurseObject {
	protected client: Curseforge;

	protected constructor(client: Curseforge) {
		this.client = client;
	};
}
