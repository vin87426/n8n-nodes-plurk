import { alertsResource } from './alerts';
import { blocksResource } from './blocks';
import { bookmarksResource } from './bookmarks';
import { cliquesResource } from './cliques';
import { emoticonsResource } from './emoticons';
import { friendsFansResource } from './friendsFans';
import { oauthUtilitiesResource } from './oauthUtilities';
import { photosResource } from './photos';
import { pollingResource } from './polling';
import { premiumResource } from './premium';
import { profileResource } from './profile';
import { realtimeResource } from './realtime';
import { responsesResource } from './responses';
import { searchResource } from './search';
import { timelineResource } from './timeline';
import { usersResource } from './users';
import type { ResourceDefinition } from './shared';

export const resources: ResourceDefinition[] = [
	usersResource,
	profileResource,
	realtimeResource,
	pollingResource,
	timelineResource,
	responsesResource,
	friendsFansResource,
	alertsResource,
	bookmarksResource,
	photosResource,
	premiumResource,
	searchResource,
	emoticonsResource,
	blocksResource,
	cliquesResource,
	oauthUtilitiesResource,
];

export type { OperationDefinition, ParamDefinition, ResourceDefinition } from './shared';
export { normalizeValue } from './shared';
