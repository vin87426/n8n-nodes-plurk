/* eslint-disable n8n-nodes-base/node-param-default-wrong-for-limit */
import type { INodePropertyOptions, INodeProperties } from 'n8n-workflow';

export type ParamType = 'boolean' | 'json' | 'number' | 'options' | 'string';

export interface ParamDefinition {
	name: string;
	displayName: string;
	type: ParamType;
	required?: boolean;
	default?: boolean | number | string;
	description?: string;
	options?: INodePropertyOptions[];
	placeholder?: string;
	rows?: number;
	typeOptions?: INodeProperties['typeOptions'];
}

export interface OperationDefinition {
	name: string;
	value: string;
	method: 'GET' | 'POST';
	path: string;
	description: string;
	action: string;
	twoLegged?: boolean;
	params?: ParamDefinition[];
	fileParam?: {
		apiName: string;
		defaultBinaryProperty: string;
		description: string;
	};
}

export interface ResourceDefinition {
	name: string;
	value: string;
	operations: OperationDefinition[];
}

export const qualifierOptions: INodePropertyOptions[] = [
	{ name: 'Asks', value: 'asks' },
	{ name: 'Buys', value: 'buys' },
	{ name: 'Draws', value: 'draws' },
	{ name: 'Eats', value: 'eats' },
	{ name: 'Feels', value: 'feels' },
	{ name: 'Has', value: 'has' },
	{ name: 'Hates', value: 'hates' },
	{ name: 'Hopes', value: 'hopes' },
	{ name: 'Is', value: 'is' },
	{ name: 'Likes', value: 'likes' },
	{ name: 'Loves', value: 'loves' },
	{ name: 'Needs', value: 'needs' },
	{ name: 'Plays', value: 'plays' },
	{ name: 'Says', value: 'says' },
	{ name: 'Sells', value: 'sells' },
	{ name: 'Shares', value: 'shares' },
	{ name: 'Thinks', value: 'thinks' },
	{ name: 'Wants', value: 'wants' },
	{ name: 'Whispers', value: 'whispers' },
	{ name: 'Will', value: 'will' },
	{ name: 'Wishes', value: 'wishes' },
	{ name: 'Wonders', value: 'wonders' },
	{ name: 'Writes', value: 'writes' },
];

export const languageOptions: INodePropertyOptions[] = [
	{ name: 'English', value: 'en' },
	{ name: 'Traditional Chinese (Taiwan)', value: 'tr_ch' },
	{ name: 'Traditional Chinese (Hong Kong)', value: 'tr_hk' },
	{ name: 'Simplified Chinese', value: 'cn' },
	{ name: 'Japanese', value: 'ja' },
	{ name: 'Arabic', value: 'ar' },
	{ name: 'Bahasa Indonesia', value: 'in' },
	{ name: 'Catalan', value: 'ca' },
	{ name: 'Danish', value: 'dk' },
	{ name: 'Dutch', value: 'ne' },
	{ name: 'Finnish', value: 'fi' },
	{ name: 'French', value: 'fr' },
	{ name: 'German', value: 'de' },
	{ name: 'Greek', value: 'el' },
	{ name: 'Hebrew', value: 'he' },
	{ name: 'Hindi', value: 'hi' },
	{ name: 'Italian', value: 'it' },
	{ name: 'Norwegian Bokmal', value: 'nb' },
	{ name: 'Persian', value: 'fa' },
	{ name: 'Portuguese (Brazil)', value: 'pt_BR' },
	{ name: 'Romanian', value: 'ro' },
	{ name: 'Russian', value: 'ru' },
	{ name: 'Spanish', value: 'es' },
	{ name: 'Swedish', value: 'sv' },
	{ name: 'Thai', value: 'th' },
	{ name: 'Turkish', value: 'tr' },
	{ name: 'Ukrainian', value: 'uk' },
];

export const userIdParam: ParamDefinition = {
	displayName: 'User ID',
	name: 'user_id',
	type: 'string',
	default: '',
	description: 'User numeric ID or nickname',
};

export const plurkIdParam: ParamDefinition = {
	displayName: 'Plurk ID',
	name: 'plurk_id',
	type: 'number',
	default: 0,
	description: 'The unique Plurk ID, decimal instead of base36',
};

export const idsParam: ParamDefinition = {
	displayName: 'Plurk IDs',
	name: 'ids',
	type: 'json',
	default: '[]',
	description: 'JSON array of Plurk IDs, for example [342,23242,2323]',
};

export const offsetParam: ParamDefinition = {
	displayName: 'Offset',
	name: 'offset',
	type: 'string',
	default: '',
	description: 'Offset value or datetime, depending on the operation',
};

export const limitParam: ParamDefinition = {
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	typeOptions: { minValue: 1 },
	default: 20,
	description: 'Max number of results to return',
};

export const detailParams: ParamDefinition[] = [
	{
		displayName: 'Favorers Detail',
		name: 'favorers_detail',
		type: 'boolean',
		default: false,
		description: 'Whether to include detailed user info for favorers',
	},
	{
		displayName: 'Limited Detail',
		name: 'limited_detail',
		type: 'boolean',
		default: false,
		description: 'Whether to include detailed user info for private Plurk recipients',
	},
	{
		displayName: 'Replurkers Detail',
		name: 'replurkers_detail',
		type: 'boolean',
		default: false,
		description: 'Whether to include detailed user info for replurkers',
	},
];

export const timelineFilterParam: ParamDefinition = {
	displayName: 'Filter',
	name: 'filter',
	type: 'options',
	default: '',
	description: 'Timeline filter',
	options: [
		{ name: 'All', value: '' },
		{ name: 'Favorite', value: 'favorite' },
		{ name: 'Mentioned (Premium)', value: 'mentioned' },
		{ name: 'My Plurks', value: 'my' },
		{ name: 'Private', value: 'private' },
		{ name: 'Replurked', value: 'replurked' },
		{ name: 'Responded', value: 'responded' },
	],
};

export function normalizeValue(
	value: boolean | number | string,
	type: ParamType,
): string | undefined {
	if (type === 'boolean') return value ? 'true' : undefined;
	if (type === 'json') {
		if (!value || value === '[]' || value === '{}') return undefined;
		return JSON.stringify(JSON.parse(value as string));
	}
	if (typeof value === 'number') {
		if (!Number.isFinite(value)) return undefined;
		return value.toString();
	}
	if (value === '') return undefined;
	return String(value);
}
