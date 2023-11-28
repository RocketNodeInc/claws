import { Curseforge } from '~/api/minecraft/curseforge';
import { ModStatus } from '~/api/minecraft/curseforge/types/enums';
import { ModFile } from '~/api/minecraft/curseforge/types/ModFile';
import {
	FileIndex,
	ModAsset,
	ModAuthor,
	ModLinks,
} from '~/api/minecraft/curseforge/types/types';
import { Category } from '~/schema';

import { CurseObject } from './CurseObject';

export class Mod extends CurseObject {
	public readonly id: number;

	public readonly gameId: number;

	public readonly name: string;

	public readonly slug: string;

	public readonly links: ModLinks;

	public readonly summary: string;

	public readonly status: ModStatus;

	public readonly downloadCount: number;

	public readonly isFeatured: boolean;

	public readonly primaryCategoryId: number;

	public readonly categories: Category[];

	public readonly authors: ModAuthor[];

	public readonly logo?: ModAsset;

	public readonly thumbnails: ModAsset[];

	public readonly mainFileId: number;

	public readonly latestFiles: ModFile[];

	public readonly latestFilesIndexes: FileIndex[];

	public readonly dateCreated: Date;

	public readonly dateModified: Date;

	public readonly dateReleased: Date;

	public readonly allowedModDistribution: boolean | null;

	constructor(client: Curseforge, data: any) {
		super(client);

		this.id = data.id;
		this.gameId = data.gameId;
		this.name = data.name;
		this.slug = data.slug;
		this.links = data.links;
		this.summary = data.summary;
		this.status = data.status;
		this.downloadCount = data.downloadCount;
		this.isFeatured = data.isFeatured;
		this.primaryCategoryId = data.primaryCategoryId;
		this.categories = data.categories;
		this.authors = data.authors;
		this.logo = data.logo;
		this.thumbnails = data.thumbnails;
		this.mainFileId = data.mainFileId;
		this.latestFiles = data.latestFiles;
		this.latestFilesIndexes = data.latestFilesIndexes;
		this.dateCreated = new Date(data.dateCreated);
		this.dateModified = new Date(data.dateModified);
		this.dateReleased = new Date(data.dateReleased);
		this.allowedModDistribution = data.allowedModDistribution;
	}
}
