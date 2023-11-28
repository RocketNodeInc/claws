import { Router } from '~/router';

const router = new Router();

export interface Env {
	[key: string]: string;
	CURSEFORGE_API_KEY: string;
}

export default {
	async fetch(request: FetchEvent, env: Env): Promise<Response> {
		// @ts-ignore
		globalThis.env = env;

		return router.handleRequest(request as unknown as Request);
	},
};
