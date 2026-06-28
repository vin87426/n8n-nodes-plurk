import type { ResourceDefinition } from '../shared';
import { detailParams, limitParam, offsetParam } from '../shared';

export const pollingResource: ResourceDefinition = {
	name: 'Polling',
	value: 'polling',
	operations: [
		{
			name: 'Get Plurks',
			value: 'getPlurks',
			method: 'GET',
			path: '/APP/Polling/getPlurks',
			description: 'Get newer timeline Plurks',
			action: 'Get newer timeline Plurks',
			params: [
				{ ...offsetParam, description: 'Return Plurks newer than this datetime' },
				{ ...limitParam, default: 20 },
				...detailParams,
				{ displayName: 'Minimal Data', name: 'minimal_data', type: 'boolean', default: false },
				{ displayName: 'Minimal User', name: 'minimal_user', type: 'boolean', default: false },
			],
		},
		{
			name: 'Get Unread Count',
			value: 'getUnreadCount',
			method: 'GET',
			path: '/APP/Polling/getUnreadCount',
			description: 'Get unread Plurk counts',
			action: 'Get unread Plurk counts',
		},
	],
};
