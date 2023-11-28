import { Curseforge } from '~/api/minecraft/curseforge';
import { CurseObject } from '~/api/minecraft/curseforge/types/CurseObject';

export class Category extends CurseObject {
	public readonly id: number;
	public readonly gameId: number;
	public readonly name: string;
	public readonly slug: string;
	public readonly url: string;
	public readonly dateModified: Date;
	public readonly isClass: boolean | null;
	public readonly classId: number | null;
	public readonly parentCategoryId: number | null;

	constructor(curse: Curseforge, data: any) {
		super(curse);

		this.id = data.id;
		this.gameId = data.gameId;
		this.name = data.name;
		this.slug = data.slug;
		this.url = data.url;
		this.dateModified = new Date(data.dateModified);
		this.isClass = data.isClass;
		this.classId = data.classId;
		this.parentCategoryId = data.parentCategoryId;
	}
}
