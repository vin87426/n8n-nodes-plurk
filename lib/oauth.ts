import { createHmac } from 'crypto';

export interface OAuthCredentials {
	consumerKey: string;
	consumerSecret: string;
	accessToken: string;
	accessTokenSecret: string;
}

export interface OAuthRequestOptions {
	url: string;
	method: 'GET' | 'POST';
	credentials: OAuthCredentials;
	params: Record<string, string>;
}

function buildOAuthParams(credentials: OAuthCredentials): Record<string, string> {
	const params: Record<string, string> = {
		oauth_consumer_key: credentials.consumerKey,
		oauth_signature_method: 'HMAC-SHA1',
		oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
		oauth_nonce: Math.floor(Math.random() * 1000000000).toString(),
		oauth_version: '1.0',
	};

	if (credentials.accessToken) {
		params.oauth_token = credentials.accessToken;
	}

	return params;
}

function encodeOAuth(value: string): string {
	return encodeURIComponent(value).replace(
		/[!'()*]/g,
		(char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
	);
}

function sign(
	method: string,
	url: string,
	params: Record<string, string>,
	credentials: OAuthCredentials,
): string {
	const sortedKeys = Object.keys(params).sort();
	const paramString = sortedKeys
		.map((k) => `${encodeOAuth(k)}=${encodeOAuth(params[k]!)}`)
		.join('&');
	const base = `${method}&${encodeOAuth(url)}&${encodeOAuth(paramString)}`;
	const key = `${encodeOAuth(credentials.consumerSecret)}&${encodeOAuth(credentials.accessTokenSecret)}`;
	return createHmac('sha1', key).update(base).digest('base64');
}

/**
 * Sign a request and return a fully-qualified URL with all params in the query string.
 * Suitable for GET requests and POST with application/x-www-form-urlencoded body.
 */
export function generateOAuthRequest(options: OAuthRequestOptions): string {
	const { url, method, credentials, params } = options;
	const oauth = buildOAuthParams(credentials);
	const allParams = { ...oauth, ...params };
	const signature = sign(method, url, allParams, credentials);

	const qs =
		Object.keys(allParams)
			.sort()
			.map((k) => `${encodeOAuth(k)}=${encodeOAuth(allParams[k]!)}`)
			.join('&') + `&oauth_signature=${encodeOAuth(signature)}`;

	return `${url}?${qs}`;
}

/**
 * Sign a request and return an OAuth Authorization header string.
 * Use this for multipart/form-data POST where body params must NOT be included
 * in the OAuth signature base string per OAuth 1.0a spec.
 */
export function generateOAuthHeader(
	url: string,
	method: 'GET' | 'POST',
	credentials: OAuthCredentials,
	params: Record<string, string> = {},
): string {
	const oauth = buildOAuthParams(credentials);
	const signature = sign(method, url, { ...oauth, ...params }, credentials);
	const parts = [
		...Object.keys(oauth)
			.sort()
			.map((k) => `${encodeOAuth(k)}="${encodeOAuth(oauth[k]!)}"`),
		`oauth_signature="${encodeOAuth(signature)}"`,
	];
	return `OAuth ${parts.join(', ')}`;
}
