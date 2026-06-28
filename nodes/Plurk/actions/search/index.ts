import type { ResourceDefinition } from '../shared';
import { offsetParam } from '../shared';

const queryParam = { displayName: 'Query', name: 'query', type: 'string' as const, default: '' };

export const searchResource: ResourceDefinition = {
	name: 'Search',
	value: 'search',
	operations: [
		{
			name: 'Search Plurks',
			value: 'searchPlurks',
			method: 'GET',
			path: '/APP/PlurkSearch/search',
			description: 'Search public Plurks',
			action: 'Search public Plurks',
			twoLegged: true,
			params: [queryParam, offsetParam],
		},
		{
			name: 'Search Users',
			value: 'searchUsers',
			method: 'GET',
			path: '/APP/UserSearch/search',
			description: 'Search Plurk users',
			action: 'Search users',
			twoLegged: true,
			params: [queryParam, offsetParam],
		},
		{
			name: 'Search Users All Fields',
			value: 'searchUsersAllField',
			method: 'GET',
			path: '/APP/UserSearch/searchAllField',
			description: 'Search Plurk users across all fields',
			action: 'Search users across all fields',
			twoLegged: true,
			params: [queryParam, offsetParam],
		},
	],
};
