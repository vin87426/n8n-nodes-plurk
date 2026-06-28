import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class PlurkOAuth1Api implements ICredentialType {
	name = 'plurkOAuth1Api';

	displayName = 'Plurk OAuth1 API';

	icon = 'file:../nodes/Plurk/icons/plurk.svg' as const;

	documentationUrl = 'https://www.plurk.com/API';

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
