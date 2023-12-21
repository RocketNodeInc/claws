import { Curseforge } from '~/api/minecraft/curseforge';
import { CurseObject } from '~/api/minecraft/curseforge/types/CurseObject';
import { FileReleaseType, FileStatus } from '~/api/minecraft/curseforge/types/enums';
import { FileDependency, FileHash, FileModule, SortableGameVersion } from '~/api/minecraft/curseforge/types/types';

/**
 * Represents a single CF-Core file for a specific mod.
 */
export class ModFile extends CurseObject {
	public readonly id: number;
	public readonly gameId: number;
	public readonly modId: number;
	public readonly isAvailable: boolean;
	public readonly displayName: string;
	public readonly fileName: string;
	public readonly releaseType: FileReleaseType;
	public readonly fileStatus: FileStatus;
	public readonly hashes: FileHash[];
	public readonly fileDate: Date;
	public readonly fileLength: bigint;
	public readonly downloadCount: bigint;
	public readonly downloadUrl?: string;
	public readonly gameVersions: string[];
	public readonly sortableGameVersions: SortableGameVersion[];
	public readonly dependencies: FileDependency[];
	public readonly exposeAsAlternative: boolean | null;
	public readonly parentProjectFileId: number | null;
	public readonly alternateFileId: number | null;
	public readonly isServerPack: boolean | null;
	public readonly serverPackFileId: number | null;
	public readonly fileFingerprint: bigint;
	public readonly modules: FileModule[];

	constructor(client: Curseforge, data: any) {
		super(client);

		this.id = data.id;
		this.gameId = data.gameId;
		this.modId = data.modId;
		this.isAvailable = data.isAvailable;
		this.displayName = data.displayName;
		this.fileName = data.fileName;
		this.releaseType = data.releaseType;
		this.fileStatus = data.fileStatus;
		this.hashes = data.hashes;
		this.fileDate = new Date(data.fileDate);
		this.fileLength = data.fileLength;
		this.downloadCount = data.downloadCount;
		this.downloadUrl = data.downloadUrl;
		this.gameVersions = data.gameVersions;
		this.sortableGameVersions = data.sortableGameVersions;
		this.dependencies = data.dependencies;
		this.exposeAsAlternative = data.exposeAsAlternative;
		this.parentProjectFileId = data.parentProjectFileId;
		this.alternateFileId = data.alternateFileId;
		this.isServerPack = data.isServerPack;
		this.serverPackFileId = data.serverPackFileId;
		this.fileFingerprint = data.fileFingerprint;
		this.modules = data.modules;
	}
}
