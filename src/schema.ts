export interface Build<T = Download> {
	id: string;
	download: T;
}

export interface Category {
	slug: string;
	name: string;
	editionProviders: EditionProvider[];
	modProviders: ModProvider[];
}

export interface Download {
	name: string;
	url: string;
	builtAt: Date;
	gameVersion?: string;
	checksums: {
		md5?: string;
		sha1?: string;
		sha256?: string;
		sha512?: string;
	};
	metadata: Record<string, any>;
}

export interface ModDownload extends Download {
	serverPack?: boolean;
	serverPackFileId?: number;
}

export type ModBuild = Build<ModDownload>;


export enum ProviderType {
	EDITION = 'edition',
	MOD = 'mod',
}

// Base for all providers
// i.e. PaperMC, Vanilla, etc.
// i.e. CurseForge, Technic, etc.
export interface Provider {
	slug: string;
	name: string;
	provider?: ProviderHandler;
	type: ProviderType;
}


// Base for all edition providers
// i.e. Paper, Vanilla, etc.
export interface EditionProvider extends Provider {
	provider?: EditionProviderHandler;
	versions?: string[];
}

// Base for all mod/modpack provider
// i.e. Curseforge, Technic, etc.
export interface ModProvider extends Provider {
	provider?: ModProviderHandler;
}

export interface Version {
	name: string;
	builds: string[];
}

export interface Mod {
	id: string;
	name: string;
	// Minecraft version of the latest build
	latestGameVersion: string;
	// Version of the latest build
	latestVersion: string;
	icon?: string;
}

export interface ProviderHandler {
	getProject: () => Promise<Provider | null>;
}

export interface EditionProviderHandler extends ProviderHandler {
	getProject: () => Promise<EditionProvider | null>;
	getVersion: (version: string) => Promise<Version | null>;
	getBuild: (version: string, build: string) => Promise<Build | null>;
	getDownload: (version: string, build: string) => Promise<Response | null>;
}

export interface ModProviderHandler extends ProviderHandler {
	searchMods: (query?: string) => Promise<Mod[]>;

	getProject: () => Promise<ModProvider | null>;
	getMod: (mod: string) => Promise<Mod | null>;
	getFiles: (mod: string, serverOnly: boolean) => Promise<ModBuild[] | null>;
	getFile: (mod: string, fileId: string, serverOnly: boolean) => Promise<ModBuild | null>;
	getDownload: (mod: string, fileId: string) => Promise<Response | null>;
}
