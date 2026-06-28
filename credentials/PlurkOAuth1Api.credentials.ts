import type {
	ICredentialDataDecryptedObject,
	ICredentialType,
	IDataObject,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';
import { generateOAuthHeader, type OAuthCredentials } from '../lib/oauth';

function toOAuthCredentials(credentials: ICredentialDataDecryptedObject): OAuthCredentials {
	return {
		consumerKey: credentials.consumer_key as string,
		consumerSecret: credentials.consumer_secret as string,
		accessToken: (credentials.oauth_token as string) || '',
		accessTokenSecret: (credentials.oauth_token_secret as string) || '',
	};
}

function extractStringParams(values: IDataObject | undefined): Record<string, string> {
	const params: Record<string, string> = {};

	if (!values) return params;

	for (const [key, value] of Object.entries(values)) {
		if (typeof value === 'string') params[key] = value;
	}

	return params;
}

export class PlurkOAuth1Api implements ICredentialType {
	name = 'plurkOAuth1Api';

	displayName = 'Plurk OAuth1 API';

	icon = 'file:../nodes/Plurk/icons/plurk.svg' as const;

	documentationUrl = 'https://www.plurk.com/API';

	authenticate = async (
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> => {
		const method = requestOptions.method === 'POST' ? 'POST' : 'GET';
		const oauthCredentials = toOAuthCredentials(credentials);
		let params = extractStringParams(requestOptions.qs);

		if (requestOptions.body instanceof URLSearchParams) {
			params = { ...params, ...Object.fromEntries(requestOptions.body.entries()) };
		}

		return {
			...requestOptions,
			headers: {
				...requestOptions.headers,
				Authorization: generateOAuthHeader(requestOptions.url, method, oauthCredentials, params),
			},
		};
	};

	test = {
		request: {
			method: 'GET' as const,
			url: 'https://www.plurk.com/',
		},
	};

	properties: INodeProperties[] = [
		{
			displayName: 'Consumer Key',
			name: 'consumer_key',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Consumer Secret',
			name: 'consumer_secret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'OAuth Token',
			name: 'oauth_token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'OAuth Token Secret',
			name: 'oauth_token_secret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
