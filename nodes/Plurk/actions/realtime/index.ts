import type { ResourceDefinition } from '../shared';

export const realtimeResource: ResourceDefinition = {
	name: 'Realtime',
	value: 'realtime',
	operations: [
		{
			name: 'Get User Channel',
			value: 'getUserChannel',
			method: 'GET',
			path: '/APP/Realtime/getUserChannel',
			description: 'Get current user realtime channel URL',
			action: 'Get current user realtime channel URL',
		},
	],
};
