import type { ResourceDefinition } from '../shared';

export const emoticonsResource: ResourceDefinition = {
	name: 'Emoticons',
	value: 'emoticons',
	operations: [
		{
			name: 'Get',
			value: 'get',
			method: 'GET',
			path: '/APP/Emoticons/get',
			description: 'Get available emoticons',
			action: 'Get available emoticons',
			twoLegged: true,
			params: [
				{ displayName: 'Custom Only', name: 'custom_only', type: 'boolean', default: false },
				{
					displayName: 'Non Custom Only',
					name: 'non_custom_only',
					type: 'boolean',
					default: false,
				},
			],
		},
		{
			name: 'Add From URL',
			value: 'addFromURL',
			method: 'POST',
			path: '/APP/Emoticons/addFromURL',
			description: 'Add a custom emoticon from URL',
			action: 'Add a custom emoticon from URL',
			params: [
				{ displayName: 'URL', name: 'url', type: 'string', default: '' },
				{ displayName: 'Keyword', name: 'keyword', type: 'string', default: '' },
			],
		},
		{
			name: 'Delete',
			value: 'delete',
			method: 'POST',
			path: '/APP/Emoticons/delete',
			description: 'Delete a custom emoticon',
			action: 'Delete a custom emoticon',
			params: [{ displayName: 'URL', name: 'url', type: 'string', default: '' }],
		},
	],
};
