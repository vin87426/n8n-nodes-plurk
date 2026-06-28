# n8n-nodes-plurk

This package provides an n8n community node for Plurk API 2.0. It lets workflows read timelines, publish plurks, manage responses, search Plurk, upload photos, and call other Plurk API resources from one Plurk integration.

## Features

- Plurk API 2.0 resources and operations grouped by API category
- OAuth 1.0a request signing for Plurk API requests
- Support for three-legged OAuth operations that require user access tokens
- Support for two-legged OAuth operations that only require a consumer key and consumer secret
- Binary upload support for Plurk API endpoints that accept files
- Usable as an n8n AI tool

## Installation

Install this package from n8n's Community Nodes settings:

```text
@vin87426/n8n-nodes-plurk
```

After installation, add the `Plurk` node to a workflow and select the resource, operation, and credentials you want to use.

## Credentials

The node uses the `Plurk OAuth1 API` credential type.

| n8n field            | Plurk OAuth value         | Purpose                             |
| -------------------- | ------------------------- | ----------------------------------- |
| `Consumer Key`       | Plurk app consumer key    | Identifies your Plurk app           |
| `Consumer Secret`    | Plurk app consumer secret | Signs OAuth requests                |
| `OAuth Token`        | User access token key     | Authorizes requests as a Plurk user |
| `OAuth Token Secret` | User access token secret  | Signs user-authorized requests      |

Most Plurk API endpoints use three-legged OAuth and require all four fields. Some public or utility endpoints use two-legged OAuth and only require `Consumer Key` and `Consumer Secret`. If you are unsure, configure all four fields.

### Get a Consumer Key and Consumer Secret

1. Sign in to Plurk.
2. Open the [Plurk app creation page](https://www.plurk.com/PlurkApp/create).
3. Create a Plurk app.
4. Copy the app's consumer key and consumer secret.
5. In n8n, create a `Plurk OAuth1 API` credential.
6. Paste the values into `Consumer Key` and `Consumer Secret`.

### Get an OAuth Token and OAuth Token Secret

Plurk uses OAuth 1.0a. For automation and bot workflows, the simplest way to get permanent access tokens is Plurk's official test console.

1. Make sure you already have a Plurk app consumer key and consumer secret.
2. Open the [Plurk OAuth test console](https://www.plurk.com/OAuth/test).
3. Enter your consumer key and consumer secret.
4. Authorize the Plurk app when prompted.
5. Copy the generated `oauth_token` and `oauth_token_secret`.
6. Paste them into `OAuth Token` and `OAuth Token Secret` in the n8n credential.
7. Save the credential and select it in the `Plurk` node.

Keep `Consumer Secret` and `OAuth Token Secret` private. They allow workflows to call Plurk as the authorized account.

## Basic Usage

1. Add a `Plurk` node to an n8n workflow.
2. Select a `Plurk OAuth1 API` credential.
3. Select a resource, such as `Timeline`, `Responses`, `Users`, or `Search`.
4. Select an operation.
5. Fill in the operation parameters.
6. Execute the workflow.

## Example Workflows

### Publish a Plurk

1. Add a manual trigger.
2. Add a `Plurk` node.
3. Set `Resource` to `Timeline`.
4. Set `Operation` to `Plurk Add`.
5. Enter `Content` and choose a `Qualifier`.
6. Run the workflow to publish the plurk.

### Search Plurk

1. Add a manual trigger.
2. Add a `Plurk` node.
3. Set `Resource` to `Search`.
4. Set `Operation` to `Search`.
5. Enter a search query and optional offset.
6. Use the returned items in later workflow steps.

### Upload a Photo

1. Add a node that provides binary data, such as an HTTP Request node or another binary-producing node.
2. Add a `Plurk` node.
3. Select the photo upload operation.
4. Set `Binary Property` to the binary property name from the previous node.
5. Execute the workflow.

## Available Resources

The node currently exposes these Plurk API resource groups:

- Alerts
- Blocks
- Bookmarks
- Cliques
- Emoticons
- Friends/Fans
- OAuth Utilities
- Photos
- Polling
- Premium
- Profile
- Realtime
- Responses
- Search
- Timeline
- Users

The exact operation list is available in the node's `Operation` field and in [docs/plurk-api-2.0.md](docs/plurk-api-2.0.md).

## Development

```bash
npm install
npm run lint
npm run build
```

During development, run:

```bash
npm run dev
```

Run the complete local check with:

```bash
npm run check
```

Run n8n's community package scanner with:

```bash
npx @n8n/scan-community-package @vin87426/n8n-nodes-plurk
```

## Publishing and n8n Verification

This project publishes through GitHub Actions with npm provenance, which is required for n8n community node verification from May 1, 2026.

1. Configure npm Trusted Publishing for this GitHub repository and `.github/workflows/publish.yml`, or configure the `NPM_TOKEN` GitHub Actions secret as a fallback.
2. Run the release process locally:

   ```bash
   npm run release
   ```

3. The release process updates the changelog, creates a version commit, creates a version tag, and pushes the tag.
4. GitHub Actions publishes the package to npm with provenance.
5. After npm shows provenance for the new package version, submit the package to the n8n Creator Portal for verification.

## References

- [Plurk API 2.0 summary](docs/plurk-api-2.0.md)
- [Plurk app creation page](https://www.plurk.com/PlurkApp/create)
- [Plurk OAuth test console](https://www.plurk.com/OAuth/test)
- [n8n Community Nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

MIT
