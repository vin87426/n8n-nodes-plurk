/* eslint-disable n8n-nodes-base/node-param-default-wrong-for-limit */
/* eslint-disable n8n-nodes-base/node-param-description-missing-from-limit */
import type { ResourceDefinition } from '../shared';

const giftTargetParams = [
	{ displayName: 'User ID', name: 'user_id', type: 'string' as const, default: '' },
	{ displayName: 'Plurk ID', name: 'plurk_id', type: 'number' as const, default: 0 },
	{ displayName: 'Response ID', name: 'response_id', type: 'number' as const, default: 0 },
	{ displayName: 'Emopack ID', name: 'emopack_id', type: 'number' as const, default: 0 },
];

export const premiumResource: ResourceDefinition = {
	name: 'Premium',
	value: 'premium',
	operations: [
		{
			name: 'Get Status',
			value: 'getStatus',
			method: 'GET',
			path: '/APP/Premium/getStatus',
			description: 'Get premium status',
			action: 'Get premium status',
		},
		{
			name: 'Get Balance',
			value: 'getBalance',
			method: 'GET',
			path: '/APP/Premium/getBalance',
			description: 'Get premium balance',
			action: 'Get premium balance',
		},
		{
			name: 'Get Subscription',
			value: 'getSubscription',
			method: 'GET',
			path: '/APP/Premium/getSubscription',
			description: 'Get premium subscription',
			action: 'Get premium subscription',
		},
		{
			name: 'Get Transactions',
			value: 'getTransactions',
			method: 'GET',
			path: '/APP/Premium/getTransactions',
			description: 'Get premium transactions',
			action: 'Get premium transactions',
			params: [
				{ displayName: 'Offset', name: 'offset', type: 'number', default: 0 },
				{
					displayName: 'Limit',
					name: 'limit',
					type: 'number',
					default: 30,
					typeOptions: { minValue: 1 },
				},
			],
		},
		{
			name: 'Send Gift Check',
			value: 'sendGiftCheck',
			method: 'POST',
			path: '/APP/Premium/sendGiftCheck',
			description: 'Check a premium gift target',
			action: 'Check a premium gift',
			params: giftTargetParams,
		},
		{
			name: 'Send Gift',
			value: 'sendGift',
			method: 'POST',
			path: '/APP/Premium/sendGift',
			description: 'Send a premium gift',
			action: 'Send a premium gift',
			params: [
				...giftTargetParams,
				{ displayName: 'Quantity', name: 'quantity', type: 'number', default: 0 },
				{ displayName: 'Message', name: 'message', type: 'string', default: '', rows: 3 },
				{ displayName: 'Send As Anonymous', name: 'send_as_anonymous', type: 'number', default: 0 },
			],
		},
	],
};
