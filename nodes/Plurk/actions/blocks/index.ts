import type { ResourceDefinition } from '../shared';
import { offsetParam, userIdParam } from '../shared';

export const blocksResource: ResourceDefinition = {
	name: 'Blocks',
	value: 'blocks',
	operations: [
		{
			name: 'Get',
			value: 'get',
			method: 'GET',
			path: '/APP/Blocks/get',
			description: 'Get blocked users',
			action: 'Get blocked users',
			params: [offsetParam],
		},
		{
			name: 'Block',
			value: 'block',
			method: 'POST',
			path: '/APP/Blocks/block',
			description: 'Block a user',
			action: 'Block a user',
			params: [userIdParam],
		},
		{
			name: 'Unblock',
			value: 'unblock',
			method: 'POST',
			path: '/APP/Blocks/unblock',
			description: 'Unblock a user',
			action: 'Unblock a user',
			params: [userIdParam],
		},
	],
};
