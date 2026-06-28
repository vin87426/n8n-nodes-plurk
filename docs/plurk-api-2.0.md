# Plurk API 2.0 Summary

This document summarizes the Plurk API areas exposed by this n8n community node. It is not a replacement for the official Plurk API documentation, but it gives workflow builders enough context to choose resources, configure credentials, and understand common response fields.

## Authentication

Plurk API 2.0 uses OAuth 1.0a. Requests are stateless and each request must be signed.

- Signature method: `HMAC-SHA1`
- OAuth parameters are sent in the HTTP `Authorization` header
- API responses are JSON
- Most endpoints use three-legged OAuth: consumer key, consumer secret, OAuth token, and OAuth token secret
- Some utility or public endpoints use two-legged OAuth: consumer key and consumer secret only

### OAuth Endpoints

| Purpose              | URL                                         |
| -------------------- | ------------------------------------------- |
| Request token        | `https://www.plurk.com/OAuth/request_token` |
| User authorization   | `https://www.plurk.com/OAuth/authorize`     |
| Mobile authorization | `https://www.plurk.com/m/authorize`         |
| Access token         | `https://www.plurk.com/OAuth/access_token`  |

For automation workflows, Plurk's [OAuth test console](https://www.plurk.com/OAuth/test) can generate long-lived access tokens for your own account.

## Common Plurk Fields

Plurk timeline and response operations commonly return JSON objects with these fields.

| Field                  | Meaning                                                               |
| ---------------------- | --------------------------------------------------------------------- |
| `plurk_id`             | Unique Plurk ID                                                       |
| `qualifier`            | English qualifier such as `says`, `thinks`, or `shares`               |
| `qualifier_translated` | Localized qualifier text returned by Plurk                            |
| `is_unread`            | `0` for read, `1` for unread, `2` for muted                           |
| `plurk_type`           | `0` for public, `1` for private, `4` for anonymous                    |
| `user_id`              | Timeline owner user ID                                                |
| `owner_id`             | User ID that posted the plurk                                         |
| `posted`               | UTC posting time                                                      |
| `no_comments`          | `0` allows responses, `1` disables responses, `2` allows friends only |
| `content`              | HTML-formatted content returned by Plurk                              |
| `content_raw`          | Raw user-entered content                                              |
| `response_count`       | Total response count                                                  |
| `responses_seen`       | Number of responses already seen by the current user                  |
| `limited_to`           | `null` for public, or a user ID list for limited visibility           |
| `favorite`             | Whether the current user favorited the plurk                          |
| `favorite_count`       | Number of favorites                                                   |
| `replurkable`          | Whether the plurk can be replurked                                    |
| `replurked`            | Whether the current user replurked it                                 |
| `replurkers_count`     | Number of replurkers                                                  |

Use `minimal_data` when available to reduce response size.

## Common User Fields

| Field               | Meaning                                                   |
| ------------------- | --------------------------------------------------------- |
| `id`                | Unique user ID                                            |
| `nick_name`         | Unique Plurk nickname                                     |
| `display_name`      | Display name                                              |
| `premium`           | Whether the user has Plurk Coins                          |
| `has_profile_image` | `1` if the user has an avatar, `0` for the default avatar |
| `avatar`            | Avatar version number                                     |
| `location`          | User location text                                        |
| `default_lang`      | User interface language                                   |
| `date_of_birth`     | Birth date in UTC, when visible                           |
| `bday_privacy`      | Birthday privacy setting                                  |
| `full_name`         | Full name                                                 |
| `gender`            | `0` for female, `1` for male, `2` for undisclosed         |
| `karma`             | Plurk karma value                                         |
| `relationship`      | Relationship status                                       |

## Qualifiers

Common qualifier values include:

```text
plays, buys, sells, loves, likes, shares, hates, wants,
wishes, needs, has, will, hopes, asks, wonders, feels,
thinks, draws, is, says, eats, writes, whispers
```

## Resource and Endpoint Summary

The node groups operations by Plurk API category. Parameter names in this table match the node parameter names where possible.

### Alerts

| Endpoint                         | Parameters |
| -------------------------------- | ---------- |
| `/APP/Alerts/getActive`          | None       |
| `/APP/Alerts/getUnreadCounts`    | None       |
| `/APP/Alerts/getHistory`         | None       |
| `/APP/Alerts/addAsFan`           | `user_id`  |
| `/APP/Alerts/addAllAsFan`        | None       |
| `/APP/Alerts/addAllAsFriends`    | None       |
| `/APP/Alerts/denyAll`            | None       |
| `/APP/Alerts/addAsFriend`        | `user_id`  |
| `/APP/Alerts/denyFriendship`     | `user_id`  |
| `/APP/Alerts/removeNotification` | `user_id`  |

### Blocks

| Endpoint              | Parameters |
| --------------------- | ---------- |
| `/APP/Blocks/get`     | `offset`   |
| `/APP/Blocks/block`   | `user_id`  |
| `/APP/Blocks/unblock` | `user_id`  |

### Bookmarks

| Endpoint                        | Parameters                                                          |
| ------------------------------- | ------------------------------------------------------------------- |
| `/APP/Bookmarks/setBookmark`    | `plurk_id`, `bookmark`, `tags`, `as_reward`                         |
| `/APP/Bookmarks/getBookmarks`   | `tags`, `from_bookmark_id`, `limit`, `minimal_user`, `minimal_data` |
| `/APP/Bookmarks/getBookmark`    | `plurk_id`                                                          |
| `/APP/Bookmarks/updateBookmark` | `bookmark_id`, `tags`                                               |
| `/APP/Bookmarks/getTags`        | None                                                                |
| `/APP/Bookmarks/createTag`      | `tag`                                                               |
| `/APP/Bookmarks/updateTag`      | `tag`, `rename`                                                     |
| `/APP/Bookmarks/removeTag`      | `tag`                                                               |

### Cliques

| Endpoint                    | Parameters                |
| --------------------------- | ------------------------- |
| `/APP/Cliques/getCliques`   | None                      |
| `/APP/Cliques/getClique`    | `clique_name`             |
| `/APP/Cliques/createClique` | `clique_name`             |
| `/APP/Cliques/deleteClique` | `clique_name`             |
| `/APP/Cliques/renameClique` | `clique_name`, `new_name` |
| `/APP/Cliques/add`          | `clique_name`, `user_id`  |
| `/APP/Cliques/remove`       | `clique_name`, `user_id`  |

### Emoticons

| Endpoint                    | Parameters                       |
| --------------------------- | -------------------------------- |
| `/APP/Emoticons/get`        | `custom_only`, `non_custom_only` |
| `/APP/Emoticons/addFromURL` | `url`, `keyword`                 |
| `/APP/Emoticons/delete`     | `url`                            |

### Friends and Fans

| Endpoint                                 | Parameters                                   |
| ---------------------------------------- | -------------------------------------------- |
| `/APP/FriendsFans/getFriendsByOffset`    | `user_id`, `offset`, `limit`, `minimal_data` |
| `/APP/FriendsFans/getFansByOffset`       | `user_id`, `offset`, `limit`, `minimal_data` |
| `/APP/FriendsFans/getFollowingByOffset`  | `offset`, `limit`, `minimal_data`            |
| `/APP/FriendsFans/becomeFriend`          | `friend_id`                                  |
| `/APP/FriendsFans/removeAsFriend`        | `friend_id`                                  |
| `/APP/FriendsFans/becomeFan`             | `fan_id`, `follow`                           |
| `/APP/FriendsFans/setFollowing`          | `user_id`, `follow`                          |
| `/APP/FriendsFans/getCompletion`         | None                                         |
| `/APP/FriendsFans/getFriendshipRequests` | None                                         |
| `/APP/FriendsFans/setFollowingReplurk`   | `user_id`, `follow`                          |

### OAuth Utilities

| Endpoint           | Parameters |
| ------------------ | ---------- |
| `/APP/checkToken`  | None       |
| `/APP/expireToken` | None       |

### Photos

| Endpoint               | Parameters                           |
| ---------------------- | ------------------------------------ |
| `/APP/Photos/count`    | None                                 |
| `/APP/Photos/list`     | `offset`, `limit`                    |
| `/APP/Photos/delete`   | `filename`                           |
| Photo upload operation | Binary property selected in the node |

### Polling

| Endpoint                      | Parameters                                                                                                  |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `/APP/Polling/getPlurks`      | `offset`, `limit`, `favorers_detail`, `limited_detail`, `replurkers_detail`, `minimal_data`, `minimal_user` |
| `/APP/Polling/getUnreadCount` | None                                                                                                        |

### Premium

| Endpoint                       | Parameters                                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------------- |
| `/APP/Premium/getStatus`       | None                                                                                           |
| `/APP/Premium/getBalance`      | None                                                                                           |
| `/APP/Premium/getSubscription` | None                                                                                           |
| `/APP/Premium/getTransactions` | `offset`, `limit`                                                                              |
| `/APP/Premium/sendGiftCheck`   | `user_id`, `plurk_id`, `response_id`, `emopack_id`                                             |
| `/APP/Premium/sendGift`        | `user_id`, `plurk_id`, `response_id`, `emopack_id`, `quantity`, `message`, `send_as_anonymous` |

### Profile

| Endpoint                        | Parameters                                               |
| ------------------------------- | -------------------------------------------------------- |
| `/APP/Profile/getOwnProfile`    | `minimal_data`, `minimal_user`, `include_plurks`         |
| `/APP/Profile/getPublicProfile` | `user_id`, `nick_name`, `minimal_data`, `include_plurks` |

### Realtime

| Endpoint                       | Parameters |
| ------------------------------ | ---------- |
| `/APP/Realtime/getUserChannel` | None       |

### Responses

| Endpoint                        | Parameters                                                                         |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| `/APP/Responses/get`            | `plurk_id`, `from_response`, `minimal_data`, `minimal_user`, `count`, `only_owner` |
| `/APP/Responses/getById`        | `plurk_id`, `from_response_id`, `minimal_data`, `minimal_user`, `count`            |
| `/APP/Responses/getAroundSeen`  | `plurk_id`, `minimal_data`, `minimal_user`, `count`                                |
| `/APP/Responses/responseAdd`    | `plurk_id`, `content`, `qualifier`                                                 |
| `/APP/Responses/responseDelete` | `response_id`, `plurk_id`                                                          |
| `/APP/Responses/edit`           | `plurk_id`, `response_id`, `content`                                               |
| `/APP/Responses/reportAbuse`    | `plurk_id`, `response_id`, `category`, `reason`                                    |

### Search

| Endpoint                  | Parameters        |
| ------------------------- | ----------------- |
| `/APP/PlurkSearch/search` | `query`, `offset` |

### Timeline

| Endpoint                           | Parameters                                                                                           |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `/APP/Timeline/getPlurk`           | `plurk_id`, `favorers_detail`, `limited_detail`, `replurkers_detail`, `minimal_data`, `minimal_user` |
| `/APP/Timeline/getPlurkCountsInfo` | `plurk_id`                                                                                           |
| `/APP/Timeline/getPlurks`          | `offset`, `limit`, `filter`, `minimal_data`, `minimal_user`                                          |
| `/APP/Timeline/getUnreadPlurks`    | `offset`, `limit`, `minimal_data`, `minimal_user`                                                    |
| `/APP/Timeline/plurkAdd`           | `content`, `qualifier`, `limited_to`, `no_comments`, `lang`                                          |
| `/APP/Timeline/plurkDelete`        | `plurk_id`                                                                                           |
| `/APP/Timeline/plurkEdit`          | `plurk_id`, `content`                                                                                |
| `/APP/Timeline/toggleComments`     | `plurk_id`, `no_comments`                                                                            |
| `/APP/Timeline/mutePlurks`         | `ids`                                                                                                |
| `/APP/Timeline/unmutePlurks`       | `ids`                                                                                                |
| `/APP/Timeline/favoritePlurks`     | `ids`                                                                                                |
| `/APP/Timeline/unfavoritePlurks`   | `ids`                                                                                                |
| `/APP/Timeline/replurk`            | `plurk_id`                                                                                           |
| `/APP/Timeline/unreplurk`          | `plurk_id`                                                                                           |
| `/APP/Timeline/markAsRead`         | `ids`                                                                                                |
| `/APP/Timeline/uploadPicture`      | Binary property selected in the node                                                                 |

### Users

| Endpoint                   | Parameters                         |
| -------------------------- | ---------------------------------- |
| `/APP/Users/me`            | None                               |
| `/APP/Users/update`        | Profile fields exposed by the node |
| `/APP/Users/getKarmaStats` | None                               |
| `/APP/Users/getCompletion` | None                               |
| `/APP/Users/getById`       | `user_id`                          |
| `/APP/Users/getByNickName` | `nick_name`                        |
| `/APP/Users/search`        | `query`, `offset`                  |

## Notes for n8n Workflows

- Pass all user-controlled values through node parameters.
- Do not store secrets in workflow notes or static data.
- Prefer `minimal_data` and `minimal_user` for workflows that process large timelines.
- Plurk timestamps are returned in UTC. Convert time zones in a later workflow step if needed.
- File upload operations require binary data from a previous node and the correct binary property name.

## References

- [Official Plurk API documentation](https://www.plurk.com/API)
- [Plurk app creation page](https://www.plurk.com/PlurkApp/create)
- [Plurk OAuth test console](https://www.plurk.com/OAuth/test)
