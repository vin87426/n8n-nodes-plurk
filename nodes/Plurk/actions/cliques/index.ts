import type { ParamDefinition, ResourceDefinition } from '../shared';
import { userIdParam } from '../shared';

const cliqueNameParam: ParamDefinition = {
	displayName: 'Clique Name',
	name: 'clique_name',
	type: 'string',
	default: '',
};

export const cliquesResource: ResourceDefinition = {
	name: 'Cliques',
	value: 'cliques',
	operations: [
		{
			name: 'Get Cliques',
			value: 'getCliques',
			method: 'GET',
			path: '/APP/Cliques/getCliques',
			description: 'Get Clique names',
			action: 'Get Clique names',
		},
		{
			name: 'Get Clique',
			value: 'getClique',
			method: 'GET',
			path: '/APP/Cliques/getClique',
			description: 'Get Clique members',
			action: 'Get Clique members',
			params: [cliqueNameParam],
		},
		{
			name: 'Create Clique',
			value: 'createClique',
			method: 'POST',
			path: '/APP/Cliques/createClique',
			description: 'Create a Clique',
			action: 'Create a Clique',
			params: [cliqueNameParam],
		},
		{
			name: 'Delete Clique',
			value: 'deleteClique',
			method: 'POST',
			path: '/APP/Cliques/deleteClique',
			description: 'Delete a Clique',
			action: 'Delete a Clique',
			params: [cliqueNameParam],
		},
		{
			name: 'Rename Clique',
			value: 'renameClique',
			method: 'POST',
			path: '/APP/Cliques/renameClique',
			description: 'Rename a Clique',
			action: 'Rename a Clique',
			params: [
				cliqueNameParam,
				{ displayName: 'New Name', name: 'new_name', type: 'string', default: '' },
			],
		},
		{
			name: 'Add User',
			value: 'add',
			method: 'POST',
			path: '/APP/Cliques/add',
			description: 'Add a user to a Clique',
			action: 'Add a user to a Clique',
			params: [cliqueNameParam, userIdParam],
		},
		{
			name: 'Remove User',
			value: 'remove',
			method: 'POST',
			path: '/APP/Cliques/remove',
			description: 'Remove a user from a Clique',
			action: 'Remove a user from a Clique',
			params: [cliqueNameParam, userIdParam],
		},
	],
};
