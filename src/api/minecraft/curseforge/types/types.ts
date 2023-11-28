import { Category } from '~/api/minecraft/curseforge/types/Category';
import {
	FileHashAlgorithms,
	FileRelationType,
	FileReleaseType,
	ModLoaderType, ModsSearchSortField,
} from '~/api/minecraft/curseforge/types/enums';
import { ModFile } from '~/api/minecraft/curseforge/types/ModFile';

export interface GameAssets {
	iconUrl: string;
	tileUrl: string;
	coverUrl: string;
}

export interface Pagination {
	index: number,
	/**
	 * Maximum allowed PageSize is 50.
	 */
	pageSize: number,
	resultCount: number,
	totalCount: number
}

export interface FileHash {
	value: string,
	algo: FileHashAlgorithms
}

export interface SortableGameVersion {
	gameVersionName: string,
	gameVersionPadded: string,
	gameVersion: string,
	gameVersionReleaseDate: Date,
	gameVersionTypeId: number | null
}

export interface FileIndex {
	gameVersion: string,
	fileId: number,
	filename: string,
	releaseType: FileReleaseType,
	gameVersionTypeId: number | null,
	modLoader: ModLoaderType | null
}

export interface FileDependency {
	modId: number,
	fileId: number,
	relationType: FileRelationType
}

export interface FileModule {
	name: string,
	fingerprint: bigint
}

export interface PagingOptions {
	index?: number,
	pageSize?: number
}

export interface SearchOptions {
	classId?: number,
	categoryId?: number,
	gameVersion?: string,
	searchFilter?: string,
	sortField?: ModsSearchSortField,
	sortOrder?: 'asc' | 'desc',
	modLoaderType?: string,
	gameVersionTypeId?: number
}

export interface ModLinks {
	websiteUrl: string,
	wikiUrl: string,
	issuesUrl: string,
	sourceUrl: string
}

export interface ModAuthor {
	id: number,
	name: string,
	url: string
}

export interface ModAsset {
	id: number,
	modId: number,
	title: string,
	description: string,
	thumbnailUrl: string,
	url: string
}

export interface GameVersionsByType {
	type: number,
	versions: string[]
}

/**
 * the game version type (Retail / Console / etc.)
 */
export type GameVersionType = {
	id: number,
	gameId: number,
	name: string,
	slug: string
}

export interface FingerprintMatch {
	id: number,
	file: ModFile,
	latestFiles: ModFile[]
}

export interface FingerprintMatchResult {
	isCacheBuilt: boolean,
	exactMatches: FingerprintMatch[],
	exactFingerprints: number[],
	partialMatches: FingerprintMatch[],
	partialMatchFingerprints: object,
	additionalProperties?: number[],
	installedFingerprints: number[],
	unmatchedFingerprints: number[]
}

export interface FingerprintFuzzyMatch {
	id: number,
	file: ModFile,
	latestFiles: ModFile[],
	fingerprints: number[]
}

export interface FolderFingerprints {
	foldername: string,
	fingerprints: number[]
}
