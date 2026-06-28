import type { ResourceDefinition } from '../shared';
import { userIdParam } from '../shared';

export const profileResource: ResourceDefinition = {
	name: 'Profile',
	value: 'profile',
	operations: [
		{
			name: 'Get Own Profile',
			value: 'getOwnProfile',
			method: 'GET',
			path: '/APP/Profile/getOwnProfile',
			description: 'Get current private profile',
			action: 'Get current private profile',
			params: [
				{ displayName: 'Minimal Data', name: 'minimal_data', type: 'boolean', default: false },
				{ displayName: 'Minimal User', name: 'minimal_user', type: 'boolean', default: false },
				{ displayName: 'Include Plurks', name: 'include_plurks', type: 'boolean', default: true },
			],
		},
		{
			name: 'Get Public Profile',
			value: 'getPublicProfile',
			method: 'GET',
			path: '/APP/Profile/getPublicProfile',
			description: 'Get a public profile',
			action: 'Get a public profile',
			twoLegged: true,
			params: [
				userIdParam,
				{ displayName: 'Nick Name', name: 'nick_name', type: 'string', default: '' },
				{ displayName: 'Minimal Data', name: 'minimal_data', type: 'boolean', default: false },
				{ displayName: 'Include Plurks', name: 'include_plurks', type: 'boolean', default: true },
			],
		},
	],
};
