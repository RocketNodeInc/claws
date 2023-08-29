import { Router as IttyRouter, RouterOptions } from 'itty-router';
import {
	error as ittyError,
	json as ittyJson,
	missing, status,
	StatusError,
	withContent,
	withParams,
} from 'itty-router-extras';

import categories from '~/categories';
import editions from '~/editions';
import mods from '~/mods';
import projects from '~/projects';
import { EditionProvider, EditionProviderHandler, ModProviderHandler, Provider, ProviderType } from '~/schema';

export class Router<TRequest = Request, TMethods = Record<string, never>> {
	private router: IttyRouter<TRequest, TMethods>;

	constructor(options?: RouterOptions<TRequest>) {
		this.router = IttyRouter(options);

		this.router.options('*', (req: Request) => {
			const origin = req.headers.get('Origin');
			const r = new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': origin || '*',
					'Access-Control-Allow-Methods': 'GET, OPTIONS',
				},
			});
			r.headers.append('Vary', 'Origin');
			return r;
		});

		this.router.get('/', () => this.text('Hello, world!'));
		this.createCategoryRoutes();
		this.createProjectRoutes();
		this.createVersionRoutes();
		this.createModpackRoutes();
		this.router.all('*', () => missing('Not Found'));
	}

	private createCategoryRoutes(): void {
		this.router.get('/api/v1/categories', () => {
			const data = [];
			data.push(...Object.keys(categories).map(k => ({ name: categories[k].name, slug: categories[k].slug })));

			return this.json(data);
		});

		this.router.get('/api/v1/categories/:category', withParams, ({ category }: { category: string }) => {
			if (!(category in categories)) {
				return missing('category not found');
			}

			return this.json(categories[category]);
		});

		this.router.get('/api/v1/categories/:category/providers', withParams, ({ category }: { category: string }) => {
			if (!(category in categories)) {
				return missing('category not found');
			}

			const data: string[] = [];
			if (categories[category].modProviders.length > 0) data.push('mods');
			if (categories[category].editionProviders.length > 0) data.push('editions');

			return this.json(data);
		});

		this.router.get('/api/v1/categories/:category/providers/:provider', withParams, ({ category, provider }: {
			category: string,
			provider: string
		}) => {
			if (!(category in categories)) {
				return missing('category not found');
			}

			const data: Provider[] = [];
			if (provider === 'mods') data.push(...categories[category].modProviders);
			else if (provider === 'editions') data.push(...categories[category].editionProviders);

			return this.json(data);
		});
	}

	private createProjectRoutes(): void {
		this.router.get('/api/v1/projects', () => {
			const data = [];
			data.push(...Object.keys(projects).map(k => ({
				name: projects[k].name,
				slug: projects[k].slug,
				type: projects[k].type,
				icon: projects[k].icon,
			})));

			return this.json(data);
		});

		this.router.get('/api/v1/projects/:project', withParams, async ({ project }: { project: string }) => {
			if (!(project in projects)) return missing('project not found');

			const p = projects[project];
			const provider = p.provider;
			if (provider === undefined) throw new Error('fuck');

			return this.json(await provider.getProject());
		});
	}

	private createVersionRoutes(): void {
		this.router.get('/api/v1/projects/:project/versions', withParams, async ({ project }: { project: string }) => {
			if (!(project in editions)) return missing('project not found');

			const p = editions[project];
			const provider = p.provider;
			if (provider === undefined) throw new Error();

			const res = await provider.getProject();
			if (res === null || res.type !== ProviderType.EDITION) return this.json(null);

			return this.json((res as EditionProvider).versions);
		});

		this.router.get('/api/v1/projects/:project/versions/:version', withParams, async ({ project, version }: {
			project: string;
			version: string
		}) => {
			if (!(project in editions)) return missing('project not found');

			const p = editions[project];
			const provider = p.provider;
			if (provider === undefined) throw new Error();

			return this.json(await provider.getVersion(version));
		});

		this.router.get('/api/v1/projects/:project/versions/:version/builds', withParams, async ({ project, version }: {
			project: string;
			version: string
		}) => {
			if (!(project in editions)) return missing('project not found');

			const p = editions[project];
			const provider = p.provider;
			if (provider === undefined) throw new Error();

			const res = await provider.getVersion(version);
			if (res === null) return this.json(null);

			return this.json(res.builds);
		});

		interface BuildBody {
			url: string;
			params: {
				project: string;
				version: string;
				build: string;
			};
		}

		this.router.get('/api/v1/projects/:project/versions/:version/builds/:build', withParams,
			async ({
					   params: {
						   project,
						   version,
						   build,
					   }, url,
				   }: BuildBody) => {
				if (!(project in editions)) return missing('project not found');

				const p = editions[project];
				const provider = p.provider;
				if (provider === undefined) throw new Error();

				const res = await provider.getBuild(version, build);
				if (res === null) return this.json(null);

				res.download.url = this.getURL(url) + res.download.url;
				return this.json(res);
			});

		this.router.get('/api/v1/projects/:project/versions/:version/builds/:build/download', withParams,
			async ({
					   project,
					   version,
					   build,
				   }: {
				project: string;
				version: string;
				build: string
			}) => {
				if (!(project in editions)) return missing('project not found');

				const p = editions[project];
				const provider = p.provider;
				if (provider === undefined) throw new Error();

				const res = await provider.getDownload(version, build);
				if (res === null) return this.json(null);

				return res;
			});
	}

	private createModpackRoutes(): void {
		this.router.get('/api/v1/projects/:project/mods', async ({ params, query: queryParams }: {params: { project: string}, query: { query?: string}, url: string}) => {
			const { project } = params;
			const { query } = queryParams;

			if (!(project in mods)) return missing('project not found');

			const p = mods[project];
			const provider = p.provider;
			if (provider === undefined) throw new Error();

			const res = await provider.searchMods(query);
			if (res === null) return this.json(null);

			return this.json(res);
		});

		this.router.get('/api/v1/projects/:project/mods/:mod', async ({ params }: {params: { project: string, mod: string }, url: string}) => {
			const { project, mod } = params;

			if (!(project in mods)) return missing('project not found');

			const p = mods[project];
			const provider = p.provider;
			if (provider === undefined) throw new Error();

			const res = await provider.getMod(mod);
			if (res === null) return this.json(null);

			return this.json(res);
		});

		// Passing ?serverOnly=true will drastically increase the response time as it has to perform a lot of extra http requests.
		this.router.get('/api/v1/projects/:project/mods/:mod/files', async ({ params, query, url }: {params: { project: string, mod: string, serverOnly?: boolean}, query: {serverOnly?: boolean}, url: string}) => {
			const { project, mod } = params;
			const { serverOnly } = query;

			if (!(project in mods)) return missing('project not found');

			const p = mods[project];
			const provider = p.provider;
			if (provider === undefined) throw new Error();

			const res = await provider.getFiles(mod, serverOnly ?? false);
			if (res === null) return this.json(null);

			for (const file of res) file.download.url = this.getURL(url) + file.download.url;
			return this.json(res);
		});

		this.router.get('/api/v1/projects/:project/mods/:mod/files/:file', async ({ params, query, url }: {params: { project: string, mod: string, file: string }, query: {serverOnly?: boolean}, url: string}) => {
			const { project, mod, file } = params;
			const { serverOnly } = query;

			if (!(project in mods)) return missing('project not found');

			const p = mods[project];
			const provider = p.provider;
			if (provider === undefined) throw new Error();

			const res = await provider.getFile(mod, file, serverOnly ?? false);
			if (res === null) return this.json(null);

			res.download.url = this.getURL(url) + res.download.url;
			return this.json(res);
		});

		this.router.get('/api/v1/projects/:project/mods/:mod/files/:file/download', async ({ params }: {params: { project: string, mod: string, file: string }}) => {
			const { project, mod, file } = params;

			if (!(project in mods)) return missing('project not found');

			const p = mods[project];
			const provider = p.provider;
			if (provider === undefined) throw new Error();

			const res = await provider.getDownload(mod, file);
			if (res === null) return this.json(null);

			return res;
		});
	}

	public handleRequest(request: TRequest): Promise<Response> {
		return this.router.handle(request).catch(async (error: any) => {
			if (error instanceof StatusError) {
				const e = error as StatusError & { status: number };

				return this.formatError(e.status, e.message);
			}


			console.error(error);
			return this.formatError(500, 'internal server error');
		});
	}

	private getURL(url: string): string {
		const u = new URL(url);
		return u.protocol + '//' + u.host;
	}

	private text(v: string): Response {
		const r = new Response(v);
		r.headers.set('Content-Type', 'text/plain; charset=utf-8');
		r.headers.set('Access-Control-Allow-Origin', '*');
		r.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
		r.headers.set('Cache-Control', 'no-store');
		r.headers.set('Content-Security-Policy', 'frame-ancestors \'none\'');
		r.headers.set('X-Frame-Options', 'DENY');
		return r;
	}

	private json(v: any): Response {
		const r = ittyJson(v);
		r.headers.set('Access-Control-Allow-Origin', '*');
		r.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
		r.headers.set('Cache-Control', 'no-store');
		r.headers.set('Content-Security-Policy', 'frame-ancestors \'none\'');
		r.headers.set('X-Frame-Options', 'DENY');
		return r;
	}

	private formatError(status: number, payload?: any): Response {
		const r = ittyError(status, payload);
		r.headers.set('Access-Control-Allow-Origin', '*');
		r.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
		r.headers.set('Cache-Control', 'no-store');
		r.headers.set('Content-Security-Policy', 'frame-ancestors \'none\'');
		r.headers.set('X-Frame-Options', 'DENY');
		return r;
	}
}
