/* eslint-disable n8n-nodes-base/node-param-default-wrong-for-limit */
/* eslint-disable n8n-nodes-base/node-param-description-missing-from-limit */
import type { ParamDefinition, ResourceDefinition } from '../shared';

const bookmarkIdParam: ParamDefinition = {
	displayName: 'Bookmark ID',
	name: 'bookmark_id',
	type: 'number',
	default: 0,
};

const tagParam: ParamDefinition = {
	displayName: 'Tag',
	name: 'tag',
	type: 'string',
	default: '',
};

const tagsParam: ParamDefinition = {
	displayName: 'Tags',
	name: 'tags',
	type: 'string',
	default: '',
};

export const bookmarksResource: ResourceDefinition = {
	name: 'Bookmarks',
	value: 'bookmarks',
	operations: [
		{
			name: 'Set Bookmark',
			value: 'setBookmark',
			method: 'POST',
			path: '/APP/Bookmarks/setBookmark',
			description: 'Set bookmark data for a Plurk',
			action: 'Set a bookmark',
			params: [
				{ displayName: 'Plurk ID', name: 'plurk_id', type: 'number', default: 0 },
				{ displayName: 'Bookmark', name: 'bookmark', type: 'string', default: '', rows: 3 },
				tagsParam,
				{ displayName: 'As Reward', name: 'as_reward', type: 'number', default: 0 },
			],
		},
		{
			name: 'Get Bookmarks',
			value: 'getBookmarks',
			method: 'GET',
			path: '/APP/Bookmarks/getBookmarks',
			description: 'Retrieve bookmark entries',
			action: 'Get bookmarks',
			params: [
				tagsParam,
				{ displayName: 'From Bookmark ID', name: 'from_bookmark_id', type: 'number', default: 0 },
				{
					displayName: 'Limit',
					name: 'limit',
					type: 'number',
					default: 20,
					typeOptions: { minValue: 1 },
				},
				{ displayName: 'Minimal User', name: 'minimal_user', type: 'boolean', default: false },
				{ displayName: 'Minimal Data', name: 'minimal_data', type: 'boolean', default: false },
			],
		},
		{
			name: 'Get Bookmark',
			value: 'getBookmark',
			method: 'GET',
			path: '/APP/Bookmarks/getBookmark',
			description: 'Get a bookmark by Plurk ID',
			action: 'Get a bookmark',
			params: [{ displayName: 'Plurk ID', name: 'plurk_id', type: 'number', default: 0 }],
		},
		{
			name: 'Update Bookmark',
			value: 'updateBookmark',
			method: 'POST',
			path: '/APP/Bookmarks/updateBookmark',
			description: 'Update bookmark tags',
			action: 'Update a bookmark',
			params: [bookmarkIdParam, tagsParam],
		},
		{
			name: 'Get Tags',
			value: 'getTags',
			method: 'GET',
			path: '/APP/Bookmarks/getTags',
			description: 'Get bookmark tags',
			action: 'Get bookmark tags',
		},
		{
			name: 'Create Tag',
			value: 'createTag',
			method: 'POST',
			path: '/APP/Bookmarks/createTag',
			description: 'Create a bookmark tag',
			action: 'Create a bookmark tag',
			params: [tagParam],
		},
		{
			name: 'Update Tag',
			value: 'updateTag',
			method: 'POST',
			path: '/APP/Bookmarks/updateTag',
			description: 'Rename a bookmark tag',
			action: 'Update a bookmark tag',
			params: [tagParam, { displayName: 'Rename To', name: 'rename', type: 'string', default: '' }],
		},
		{
			name: 'Remove Tag',
			value: 'removeTag',
			method: 'POST',
			path: '/APP/Bookmarks/removeTag',
			description: 'Remove a bookmark tag',
			action: 'Remove a bookmark tag',
			params: [tagParam],
		},
	],
};
