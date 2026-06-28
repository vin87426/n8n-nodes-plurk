/* eslint-disable @n8n/community-nodes/no-http-request-with-manual-auth */
/* eslint-disable n8n-nodes-base/node-param-default-missing */
import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INode,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import type { OAuthCredentials } from '../../lib/oauth';
import { generateOAuthHeader } from '../../lib/oauth';
import type { OperationDefinition, ParamDefinition, ResourceDefinition } from './actions';
import { normalizeValue, resources } from './actions';

const endpointLookup = new Map<string, OperationDefinition>();

for (const resource of resources) {
	for (const operation of resource.operations) {
		endpointLookup.set(`${resource.value}/${operation.value}`, operation);
	}
}

function paramToProperty(
	resource: ResourceDefinition,
	operation: OperationDefinition,
	param: ParamDefinition,
): INodeProperties {
	const property: INodeProperties = {
		displayName: param.displayName,
		name: param.name,
		type: param.type,
		default: param.default ?? (param.type === 'boolean' ? false : ''),
		displayOptions: { show: { resource: [resource.value], operation: [operation.value] } },
	};

	if (param.required !== undefined) property.required = param.required;
	if (param.description !== undefined) property.description = param.description;
	if (param.options) property.options = param.options;
	if (param.placeholder) property.placeholder = param.placeholder;
	if (param.typeOptions) property.typeOptions = param.typeOptions;
	if (param.rows) property.typeOptions = { rows: param.rows };
	if (param.name === 'limit') property.typeOptions = { minValue: 1 };

	return property;
}

function buildProperties(): INodeProperties[] {
	const properties: INodeProperties[] = [
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			default: 'timeline',
			options: resources.map((resource) => ({ name: resource.name, value: resource.value })),
		},
	];

	for (const resource of resources) {
		const defaultOperation = resource.operations[0];
		if (!defaultOperation) continue;

		properties.push({
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			default: defaultOperation.value,
			displayOptions: { show: { resource: [resource.value] } },
			options: resource.operations.map(({ name, value, action }) => ({
				name,
				value,
				action,
			})),
		});

		for (const operation of resource.operations) {
			for (const param of operation.params ?? []) {
				properties.push(paramToProperty(resource, operation, param));
			}

			if (operation.fileParam) {
				properties.push({
					displayName: 'Binary Property',
					name: 'binaryPropertyName',
					type: 'string',
					required: true,
					default: operation.fileParam.defaultBinaryProperty,
					description: operation.fileParam.description,
					displayOptions: { show: { resource: [resource.value], operation: [operation.value] } },
				});
			}
		}
	}

	return properties;
}

function getCredentials(
	raw: Record<string, unknown>,
	twoLegged: boolean,
	node: INode,
): OAuthCredentials {
	const consumerKey = raw.consumer_key as string;
	const consumerSecret = raw.consumer_secret as string;
	const accessToken = (raw.oauth_token as string) || '';
	const accessTokenSecret = (raw.oauth_token_secret as string) || '';

	if (!consumerKey || !consumerSecret) {
		throw new NodeOperationError(
			node,
			'Invalid credentials: consumer key and consumer secret are required',
		);
	}

	if (!twoLegged && (!accessToken || !accessTokenSecret)) {
		throw new NodeOperationError(
			node,
			'Invalid credentials: OAuth token and token secret are required for this operation',
		);
	}

	return { consumerKey, consumerSecret, accessToken, accessTokenSecret };
}

function toNodeApiError(node: INode, error: Error, itemIndex: number): NodeApiError {
	return new NodeApiError(node, error as unknown as JsonObject, {
		itemIndex,
		message: error.message || 'Plurk API request failed',
	});
}

async function plurkApiRequest(
	this: IExecuteFunctions,
	operation: OperationDefinition,
	apiUrl: string,
	credentials: OAuthCredentials,
	params: Record<string, string>,
): Promise<IDataObject> {
	const headers: IDataObject = {
		Authorization: generateOAuthHeader(apiUrl, operation.method, credentials, params),
	};
	const requestOptions: IHttpRequestOptions = {
		method: operation.method,
		url: apiUrl,
		headers,
		json: true,
	};

	if (operation.method === 'GET') {
		requestOptions.qs = params;
	} else {
		headers['Content-Type'] = 'application/x-www-form-urlencoded';
		requestOptions.body = new URLSearchParams(params);
	}

	return (await this.helpers.httpRequest(requestOptions)) as IDataObject;
}

export class Plurk implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Plurk',
		name: 'plurk',
		icon: { light: 'file:icons/plurk.svg', dark: 'file:icons/plurk-dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Interact with categorized Plurk API 2.0 endpoints',
		defaults: { name: 'Plurk' },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'plurkOAuth1Api', required: true }],
		usableAsTool: true,
		properties: buildProperties(),
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operationName = this.getNodeParameter('operation', i) as string;
				const operation = endpointLookup.get(`${resource}/${operationName}`);

				if (!operation) {
					throw new NodeOperationError(
						this.getNode(),
						`Unsupported resource/operation: ${resource}/${operationName}`,
						{ itemIndex: i },
					);
				}

				const raw = await this.getCredentials('plurkOAuth1Api');
				const credentials = getCredentials(raw, Boolean(operation.twoLegged), this.getNode());
				const apiUrl = `https://www.plurk.com${operation.path}`;

				if (operation.fileParam) {
					const binaryPropertyName = this.getNodeParameter(
						'binaryPropertyName',
						i,
						operation.fileParam.defaultBinaryProperty,
					) as string;
					const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
					const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
					const response = await this.helpers.httpRequest({
						method: 'POST',
						url: apiUrl,
						headers: { Authorization: generateOAuthHeader(apiUrl, 'POST', credentials) },
						body: {
							[operation.fileParam.apiName]: {
								value: buffer,
								options: {
									filename: binaryData.fileName ?? 'upload.jpg',
									contentType: binaryData.mimeType ?? 'image/jpeg',
								},
							},
						},
					});

					returnData.push({ json: response as IDataObject, pairedItem: i });
					continue;
				}

				const params: Record<string, string> = {};
				for (const param of operation.params ?? []) {
					const rawValue = this.getNodeParameter(param.name, i, param.default ?? '') as
						| boolean
						| number
						| string;
					const normalized = normalizeValue(rawValue, param.type);

					if (param.required && normalized === undefined) {
						throw new NodeOperationError(this.getNode(), `${param.displayName} is required`, {
							itemIndex: i,
						});
					}

					if (normalized !== undefined) {
						params[param.name] = normalized;
					}
				}

				const response = await plurkApiRequest.call(this, operation, apiUrl, credentials, params);
				returnData.push({ json: response, pairedItem: i });
			} catch (error) {
				if (this.continueOnFail()) {
					const message = error instanceof Error ? error.message : String(error);

					returnData.push({
						json: { error: message, timestamp: new Date().toISOString() },
						pairedItem: i,
					});
					continue;
				}
				if (error instanceof NodeOperationError) {
					throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
				}
				throw toNodeApiError(this.getNode(), error as Error, i);
			}
		}

		return [returnData];
	}
}
