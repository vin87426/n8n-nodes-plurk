import type { ResourceDefinition } from '../shared';

export const oauthUtilitiesResource: ResourceDefinition = {
	name: 'OAuth Utilities',
	value: 'oauthUtilities',
	operations: [
		{
			name: 'Check Token',
			value: 'checkToken',
			method: 'GET',
			path: '/APP/checkToken',
			description: 'Check current access token',
			action: 'Check current access token',
		},
		{
			name: 'Expire Token',
			value: 'expireToken',
			method: 'GET',
			path: '/APP/expireToken',
			description: 'Expire current access token',
			action: 'Expire current access token',
		},
		{
			name: 'Check Time',
			value: 'checkTime',
			method: 'GET',
			path: '/APP/checkTime',
			description: 'Get Plurk server time',
			action: 'Get Plurk server time',
			twoLegged: true,
		},
		{
			name: 'Check IP',
			value: 'checkIP',
			method: 'GET',
			path: '/APP/checkIP',
			description: 'Check request IP information',
			action: 'Check request IP information',
			twoLegged: true,
		},
		{
			name: 'Echo',
			value: 'echo',
			method: 'GET',
			path: '/APP/echo',
			description: 'Echo signed data',
			action: 'Echo signed data',
			twoLegged: true,
			params: [{ displayName: 'Data', name: 'data', type: 'string', default: '' }],
		},
	],
};
