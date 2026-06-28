/* eslint-disable n8n-nodes-base/node-param-default-wrong-for-limit */
/* eslint-disable n8n-nodes-base/node-param-description-missing-from-limit */
import type { ResourceDefinition } from '../shared';

export const photosResource: ResourceDefinition = {
	name: 'Photos',
	value: 'photos',
	operations: [
		{
			name: 'Count',
			value: 'count',
			method: 'GET',
			path: '/APP/Photos/count',
			description: 'Count uploaded photos',
			action: 'Count photos',
		},
		{
			name: 'List',
			value: 'list',
			method: 'GET',
			path: '/APP/Photos/list',
			description: 'List uploaded photos',
			action: 'List photos',
			params: [
				{ displayName: 'Offset', name: 'offset', type: 'number', default: 0 },
				{
					displayName: 'Limit',
					name: 'limit',
					type: 'number',
					default: 20,
					typeOptions: { minValue: 1 },
				},
			],
		},
		{
			name: 'Delete',
			value: 'delete',
			method: 'POST',
			path: '/APP/Photos/delete',
			description: 'Delete an uploaded photo',
			action: 'Delete a photo',
			params: [{ displayName: 'Filename', name: 'filename', type: 'string', default: '' }],
		},
	],
};
