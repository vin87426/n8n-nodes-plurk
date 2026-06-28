# Plurk API 2.0

Plurk API 2.0 使用 **OAuth** 保護用戶隱私，提供標準方式存取 Plurk 平台。應用程式可代表用戶存取時間軸、發佈 Plurk，而無需保存用戶密碼。

- API 是無狀態的，每個請求必須用 [OAuth Core 1.0a](http://oauth.net/core/1.0a/) 簽名
- 大多數 API 使用三腳 OAuth（需 consumer key/secret + access token key/secret）
- 少數 API 支援兩腳 OAuth（僅需 consumer key/secret）
- 回傳 **JSON** 格式資料

---

## 目錄

- [OAuth Flow](#oauth-flow)
- [Plurk 資料結構](#plurk-資料結構)
- [User 資料結構](#user-資料結構)
- [Resource API 選單總覽](#resource-api-選單總覽)
- [Users API](#users-api)
- [Profile API](#profile-api)
- [Real-time 通知](#real-time-通知)
- [Polling API](#polling-api)
- [Timeline API](#timeline-api)
- [Responses API](#responses-api)
- [Friends & Fans API](#friends--fans-api)
- [Alerts API](#alerts-api)
- [Search API](#search-api)
- [Emoticons API](#emoticons-api)
- [Blocks API](#blocks-api)
- [Cliques API](#cliques-api)
- [OAuth Utilities](#oauth-utilities)

---

## OAuth Flow

### 服務端點

| 用途               | URL                                                          |
| ------------------ | ------------------------------------------------------------ |
| 取得 Request Token | `https://www.plurk.com/OAuth/request_token` (HTTPS GET/POST) |
| 授權頁面           | `https://www.plurk.com/OAuth/authorize`                      |
| 授權頁面（行動版） | `https://www.plurk.com/m/authorize`                          |
| 取得 Access Token  | `https://www.plurk.com/OAuth/access_token` (HTTPS GET/POST)  |

### 流程

1. [申請 Plurk App](https://www.plurk.com/PlurkApp/create) 取得 consumer key/secret
2. 請求臨時 token（request token）
3. 引導用戶到 Plurk 授權頁面
4. 在 callback 接收 OAuth verifier
5. 取得永久 token（access token）

> 若你只是 bot 開發者，可直接在 [test console](https://www.plurk.com/OAuth/test) 取得永久 access token，無需寫程式處理 request/access token 流程。

### OAuth 規格

- 簽名方式：**HMAC-SHA1**
- OAuth 參數傳遞方式：**HTTP Authorization header**
- Timestamp + Nonce 每個請求必須唯一，且 timestamp 必須接近當前時間
- 用戶必須在 **30 分鐘**內授權 request token
- App 必須在 **60 分鐘**內取得 access token
- API 參數可用 **GET** 或 **POST**（建議 POST）

### 多裝置支援

授權 URL 可附加選用參數：

```
https://www.plurk.com/OAuth/authorize?oauth_token=ReqKMrVIjOLI&deviceid=efa9183a839f421821dc5c&model=Apple+iPhone+4S
```

- `deviceid`：最長 32 字元的唯一裝置 ID（如 UUID），同一 `deviceid` 的舊 token 會被覆蓋
- `model`：裝置名稱，方便用戶在 Sessions 頁面辨識

### Python 範例

```python
import oauth2 as oauth
import urlparse

OAUTH_REQUEST_TOKEN = 'https://www.plurk.com/OAuth/request_token'
OAUTH_ACCESS_TOKEN = 'https://www.plurk.com/OAuth/access_token'

def get_request_token(app_key, app_secret):
    consumer = oauth.Consumer(app_key, app_secret)
    client = oauth.Client(consumer)
    response = client.request(OAUTH_REQUEST_TOKEN, method='GET')
    return urlparse.parse_qs(response)

def get_access_token(app_key, app_secret, oauth_token, oauth_token_secret, oauth_verifier):
    consumer = oauth.Consumer(app_key, app_secret)
    token = oauth.Token(oauth_token, oauth_token_secret)
    token.set_verifier(oauth_verifier)
    client = oauth.Client(consumer, token)
    response = client.request(OAUTH_ACCESS_TOKEN, method='GET')
    return urlparse.parse_qs(response)
```

---

## Plurk 資料結構

Plurk 以 JSON 物件回傳，日期使用 UTC。

```json
{
	"responses_seen": 0,
	"qualifier": "thinks",
	"plurk_id": 90812,
	"response_count": 0,
	"limited_to": null,
	"no_comments": 0,
	"is_unread": 1,
	"lang": "en",
	"content_raw": "test me out",
	"user_id": 1,
	"plurk_type": 0,
	"content": "test me out",
	"qualifier_translated": "thinks",
	"posted": "Fri, 05 Jun 2009 23:07:13 GMT",
	"owner_id": 1,
	"favorite": false,
	"favorite_count": 1,
	"favorers": [3196376],
	"replurkable": true,
	"replurked": true,
	"replurker_id": null,
	"replurkers": [1],
	"replurkers_count": 1
}
```

加上 `&minimal_data=1` 參數可省略 `content_raw` 及所有 null 屬性，節省頻寬。

### Plurk 欄位說明

| 欄位                   | 說明                                             |
| ---------------------- | ------------------------------------------------ |
| `plurk_id`             | 唯一識別 ID                                      |
| `qualifier`            | 英文限定詞（見下方清單）                         |
| `qualifier_translated` | 非英文語系時的翻譯限定詞                         |
| `is_unread`            | `0`=已讀, `1`=未讀, `2`=靜音                     |
| `plurk_type`           | `0`=公開, `1`=私人, `4`=匿名                     |
| `user_id`              | 此 Plurk 屬於哪個時間軸                          |
| `owner_id`             | 誰發佈了這個 Plurk（匿名時為 UID 99999）         |
| `posted`               | 發佈時間（UTC）                                  |
| `no_comments`          | `0`=允許回應, `1`=禁止回應, `2`=僅好友可回應     |
| `content`              | 已格式化內容（圖片轉為 IMG tag 等）              |
| `content_raw`          | 用戶輸入的原始內容，適合編輯用                   |
| `response_count`       | 回應總數                                         |
| `responses_seen`       | 用戶已讀的回應數                                 |
| `limited_to`           | `null`=公開; `[0]`=僅好友; `[1,2,3]`=指定用戶 ID |
| `favorite`             | 當前用戶是否已按讚                               |
| `favorite_count`       | 按讚人數                                         |
| `favorers`             | 按讚者 ID 清單（可能被截斷）                     |
| `replurkable`          | 是否可被 replurk                                 |
| `replurked`            | 當前用戶是否已 replurk                           |
| `replurker_id`         | 將此 Plurk replurk 到當前用戶時間軸的用戶 ID     |
| `replurkers_count`     | Replurk 人數                                     |
| `replurkers`           | Replurk 者 ID 清單（可能被截斷）                 |

### Qualifier 清單

```
plays, buys, sells, loves, likes, shares, hates, wants,
wishes, needs, has, will, hopes, asks, wonders, feels,
thinks, draws, is, says, eats, writes, whispers
```

### 語言代碼清單

| 代碼    | 語言             |
| ------- | ---------------- |
| `en`    | English          |
| `tr_ch` | 中文 (台灣)      |
| `tr_hk` | 中文 (香港)      |
| `cn`    | 中文 (中国)      |
| `ja`    | 日本語           |
| `ca`    | Català           |
| `el`    | Ελληνικά         |
| `dk`    | Dansk            |
| `de`    | Deutsch          |
| `es`    | Español          |
| `sv`    | Svenska          |
| `nb`    | Norsk bokmål     |
| `hi`    | Hindi            |
| `ro`    | Română           |
| `hr`    | Hrvatski         |
| `fr`    | Français         |
| `ru`    | Pусский          |
| `it`    | Italiano         |
| `he`    | עברית            |
| `hu`    | Magyar           |
| `ne`    | Nederlands       |
| `th`    | ไทย              |
| `ta_fp` | Filipino         |
| `in`    | Bahasa Indonesia |
| `pl`    | Polski           |
| `ar`    | العربية          |
| `fi`    | Finnish          |
| `tr`    | Türkçe           |
| `ga`    | Gaeilge          |
| `sk`    | Slovenský        |
| `uk`    | українська       |
| `fa`    | فارسی            |
| `pt_BR` | Português        |

---

## User 資料結構

最小化回傳（用於回應和 Plurk 列表中）：

```json
{
	"display_name": "amix3",
	"gender": 0,
	"nick_name": "amix",
	"has_profile_image": 1,
	"id": 1,
	"avatar": null
}
```

完整回傳（用於好友列表、個人資料）：

```json
{
	"display_name": "Alexey",
	"is_channel": 0,
	"nick_name": "Scoundrel",
	"has_profile_image": 1,
	"location": "Canada",
	"date_of_birth": "Sat, 19 Mar 1983 00:00:00 GMT",
	"relationship": "not_saying",
	"avatar": 3,
	"full_name": "Alexey Kovyrin",
	"gender": 1,
	"recruited": 6,
	"id": 5,
	"karma": 33.5
}
```

### User 欄位說明

| 欄位                | 說明                                                                                                                                                |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                | 唯一用戶 ID                                                                                                                                         |
| `nick_name`         | 唯一暱稱，如 `amix`                                                                                                                                 |
| `display_name`      | 顯示名稱（非唯一，可空）                                                                                                                            |
| `premium`           | 是否有 Plurk Coins                                                                                                                                  |
| `has_profile_image` | `1`=有頭像，`0`=使用預設頭像                                                                                                                        |
| `avatar`            | 頭像版本號                                                                                                                                          |
| `location`          | 用戶位置文字                                                                                                                                        |
| `default_lang`      | 用戶介面語言                                                                                                                                        |
| `date_of_birth`     | 生日（UTC，勿轉換時區）                                                                                                                             |
| `bday_privacy`      | `0`=隱藏生日, `1`=顯示日期但隱藏年份, `2`=全部顯示                                                                                                  |
| `full_name`         | 完整姓名                                                                                                                                            |
| `gender`            | `0`=女, `1`=男, `2`=不公開                                                                                                                          |
| `karma`             | Karma 值                                                                                                                                            |
| `recruited`         | 邀請的好友數                                                                                                                                        |
| `relationship`      | `not_saying`, `single`, `married`, `divorced`, `engaged`, `in_relationship`, `complicated`, `widowed`, `unstable_relationship`, `open_relationship` |

### 生日隱私說明

- `bday_privacy=0`：`date_of_birth` 回傳 `null`
- `bday_privacy=1`：`date_of_birth` 的年份會被改為 **1904**

### 頭像 URL 規則

**有頭像且 `avatar == null`：**

```
https://avatars.plurk.com/{user_id}-small.gif
https://avatars.plurk.com/{user_id}-medium.gif
https://avatars.plurk.com/{user_id}-big.jpg
```

**有頭像且 `avatar != null`：**

```
https://avatars.plurk.com/{user_id}-small{avatar}.gif
https://avatars.plurk.com/{user_id}-medium{avatar}.gif
https://avatars.plurk.com/{user_id}-big{avatar}.jpg
```

**無頭像（`has_profile_image == 0`）：**

```
https://www.plurk.com/static/default_small.jpg
https://www.plurk.com/static/default_medium.jpg
https://www.plurk.com/static/default_big.jpg
```

---

## Resource API 選單總覽

以下整理 Plurk API Resource 選單中的 API 與可輸入欄位。未標示 default 或 values 的欄位只代表選單可輸入；若文件未能確認是否必填，實作時請先視為 optional。若有 default，依表格預設值帶入。

### Alerts（通知）

| API                              | 可輸入參數 |
| -------------------------------- | ---------- |
| `/APP/Alerts/getActive`          | 無         |
| `/APP/Alerts/getUnreadCounts`    | 無         |
| `/APP/Alerts/getHistory`         | 無         |
| `/APP/Alerts/addAsFan`           | `user_id`  |
| `/APP/Alerts/addAllAsFan`        | 無         |
| `/APP/Alerts/addAllAsFriends`    | 無         |
| `/APP/Alerts/denyAll`            | 無         |
| `/APP/Alerts/addAsFriend`        | `user_id`  |
| `/APP/Alerts/denyFriendship`     | `user_id`  |
| `/APP/Alerts/removeNotification` | `user_id`  |

### Blocks（封鎖）

| API                   | 可輸入參數             |
| --------------------- | ---------------------- |
| `/APP/Blocks/get`     | `offset`（default: 0） |
| `/APP/Blocks/block`   | `user_id`              |
| `/APP/Blocks/unblock` | `user_id`              |

### Bookmarks（書籤）

| API                             | 可輸入參數                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `/APP/Bookmarks/setBookmark`    | `plurk_id`, `bookmark`, `tags`, `as_reward`（default: 0）                                               |
| `/APP/Bookmarks/getBookmarks`   | `tags`, `from_bookmark_id`, `limit`, `minimal_user`（default: false）, `minimal_data`（default: false） |
| `/APP/Bookmarks/getBookmark`    | `plurk_id`                                                                                              |
| `/APP/Bookmarks/updateBookmark` | `bookmark_id`, `tags`                                                                                   |
| `/APP/Bookmarks/getTags`        | 無                                                                                                      |
| `/APP/Bookmarks/createTag`      | `tag`                                                                                                   |
| `/APP/Bookmarks/updateTag`      | `tag`, `rename`                                                                                         |
| `/APP/Bookmarks/removeTag`      | `tag`                                                                                                   |

### Cliques（群組）

| API                         | 可輸入參數                |
| --------------------------- | ------------------------- |
| `/APP/Cliques/getCliques`   | 無                        |
| `/APP/Cliques/getClique`    | `clique_name`             |
| `/APP/Cliques/createClique` | `clique_name`             |
| `/APP/Cliques/deleteClique` | `clique_name`             |
| `/APP/Cliques/renameClique` | `clique_name`, `new_name` |
| `/APP/Cliques/add`          | `clique_name`, `user_id`  |
| `/APP/Cliques/remove`       | `clique_name`, `user_id`  |

### Emoticons（表情符號）

| API                         | 可輸入參數                                                           |
| --------------------------- | -------------------------------------------------------------------- |
| `/APP/Emoticons/get`        | `custom_only`（default: false）, `non_custom_only`（default: false） |
| `/APP/Emoticons/addFromURL` | `url`, `keyword`（default: null）                                    |
| `/APP/Emoticons/delete`     | `url`                                                                |

### FriendsFans（好友/粉絲）

| API                                      | 可輸入參數                                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| `/APP/FriendsFans/getFriendsByOffset`    | `user_id`, `offset`（default: 0）, `limit`（default: 10）, `minimal_data`（default: false） |
| `/APP/FriendsFans/getFansByOffset`       | `user_id`, `offset`（default: 0）, `limit`（default: 10）, `minimal_data`（default: false） |
| `/APP/FriendsFans/getFollowingByOffset`  | `offset`（default: 0）, `limit`（default: 10）, `minimal_data`（default: false）            |
| `/APP/FriendsFans/becomeFriend`          | `friend_id`                                                                                 |
| `/APP/FriendsFans/removeAsFriend`        | `friend_id`                                                                                 |
| `/APP/FriendsFans/becomeFan`             | `fan_id`, `follow`（default: false）                                                        |
| `/APP/FriendsFans/setFollowing`          | `user_id`, `follow`                                                                         |
| `/APP/FriendsFans/getCompletion`         | 無                                                                                          |
| `/APP/FriendsFans/getFriendshipRequests` | 無                                                                                          |
| `/APP/FriendsFans/setFollowingReplurk`   | `user_id`, `follow`                                                                         |

### Photos（照片）

| API                  | 可輸入參數                                     |
| -------------------- | ---------------------------------------------- |
| `/APP/Photos/count`  | 無                                             |
| `/APP/Photos/list`   | `offset`（default: 0）, `limit`（default: 20） |
| `/APP/Photos/delete` | `filename`                                     |

### PlurkSearch（Plurk 搜尋）

| API                       | 可輸入參數                      |
| ------------------------- | ------------------------------- |
| `/APP/PlurkSearch/search` | `query`, `offset`（default: 0） |

### Polling（輪詢）

| API                           | 可輸入參數                                                                                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/APP/Polling/getPlurks`      | `offset`, `limit`（default: 20）, `favorers_detail`, `limited_detail`, `replurkers_detail`, `minimal_data`（default: false）, `minimal_user`（default: false） |
| `/APP/Polling/getUnreadCount` | 無                                                                                                                                                             |

### Premium（高級功能）

| API                            | 可輸入參數                                                                                                                                                                       |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/APP/Premium/getStatus`       | 無                                                                                                                                                                               |
| `/APP/Premium/getBalance`      | 無                                                                                                                                                                               |
| `/APP/Premium/getSubscription` | 無                                                                                                                                                                               |
| `/APP/Premium/getTransactions` | `offset`（default: 0）, `limit`（default: 30）                                                                                                                                   |
| `/APP/Premium/sendGiftCheck`   | `user_id`（default: null）, `plurk_id`（default: null）, `response_id`（default: null）, `emopack_id`（default: null）                                                           |
| `/APP/Premium/sendGift`        | `user_id`（default: null）, `plurk_id`（default: null）, `response_id`（default: null）, `emopack_id`（default: null）, `quantity`, `message`, `send_as_anonymous`（default: 0） |

### Profile（個人資料）

| API                             | 可輸入參數                                                                                            |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `/APP/Profile/getOwnProfile`    | `minimal_data`（default: false）, `minimal_user`（default: false）, `include_plurks`（default: true） |
| `/APP/Profile/getPublicProfile` | `user_id`, `nick_name`, `minimal_data`（default: false）, `include_plurks`（default: true）           |

### Realtime（即時）

| API                            | 可輸入參數 |
| ------------------------------ | ---------- |
| `/APP/Realtime/getUserChannel` | 無         |

### Responses（回應）

| API                             | 可輸入參數                                                                                                                                                           |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/APP/Responses/get`            | `plurk_id`, `from_response`（default: 0）, `minimal_data`（default: false）, `minimal_user`（default: false）, `count`（default: 0）, `only_owner`（default: false） |
| `/APP/Responses/getById`        | `plurk_id`, `from_response_id`（default: 0）, `minimal_data`（default: false）, `minimal_user`（default: false）, `count`（default: 0）                              |
| `/APP/Responses/getAroundSeen`  | `plurk_id`, `minimal_data`（default: false）, `minimal_user`（default: false）, `count`（default: 0）                                                                |
| `/APP/Responses/responseAdd`    | `plurk_id`, `content`, `qualifier`                                                                                                                                   |
| `/APP/Responses/responseDelete` | `response_id`, `plurk_id`                                                                                                                                            |
| `/APP/Responses/edit`           | `plurk_id`, `response_id`, `content`                                                                                                                                 |
| `/APP/Responses/reportAbuse`    | `plurk_id`, `response_id`, `category`, `reason`                                                                                                                      |

### Timeline（時間軸）

| API                                     | 可輸入參數                                                                                                                                                                                                                                                                                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/APP/Timeline/getPlurk`                | `plurk_id`, `favorers_detail`, `limited_detail`, `replurkers_detail`, `minimal_data`（default: false）, `minimal_user`（default: false）                                                                                                                                                                                                   |
| `/APP/Timeline/getPlurkCountsInfo`      | `plurk_id`                                                                                                                                                                                                                                                                                                                                 |
| `/APP/Timeline/getPlurks`               | `offset`, `limit`（default: 20）, `filter`, `favorers_detail`, `limited_detail`, `replurkers_detail`, `minimal_data`（default: false）, `minimal_user`（default: false）                                                                                                                                                                   |
| `/APP/Timeline/getPublicPlurks`         | `user_id`, `nick_name`, `offset`（default: none）, `limit`（default: 30）, `favorers_detail`, `limited_detail`, `replurkers_detail`, `minimal_data`（default: false）, `minimal_user`（default: false）, `only_user`（default: false）                                                                                                     |
| `/APP/Timeline/getUnreadPlurks`         | `offset`, `limit`, `filter`（default: all）, `favorers_detail`, `limited_detail`, `replurkers_detail`, `minimal_data`（default: false）, `minimal_user`（default: false）                                                                                                                                                                  |
| `/APP/Timeline/plurkAdd`                | `content`, `qualifier`, `limited_to`（default: []）, `excluded`（default: null）, `no_comments`（default: 0）, `lang`（default: en）, `replurkable`（default: 1）, `porn`（default: 0）, `publish_to_followers`（default: 1）, `publish_to_anonymous`（default: 1）, `reaction_permission`（values: null\|everyone\|owner, default: null） |
| `/APP/Timeline/plurkDelete`             | `plurk_id`                                                                                                                                                                                                                                                                                                                                 |
| `/APP/Timeline/plurkEdit`               | `plurk_id`, `content`（default: null）, `no_comments`（values: null\|0\|1\|2, default: null）, `limited_to`（default: null）, `excluded`（default: null）, `replurkable`（values: null\|true\|false, default: null）, `porn`（default: null）, `reaction_permission`（values: null\|everyone\|owner, default: null）                       |
| `/APP/Timeline/mutePlurks`              | `ids`                                                                                                                                                                                                                                                                                                                                      |
| `/APP/Timeline/unmutePlurks`            | `ids`                                                                                                                                                                                                                                                                                                                                      |
| `/APP/Timeline/favoritePlurks`          | `ids`                                                                                                                                                                                                                                                                                                                                      |
| `/APP/Timeline/unfavoritePlurks`        | `ids`                                                                                                                                                                                                                                                                                                                                      |
| `/APP/Timeline/replurk`                 | `ids`                                                                                                                                                                                                                                                                                                                                      |
| `/APP/Timeline/unreplurk`               | `ids`                                                                                                                                                                                                                                                                                                                                      |
| `/APP/Timeline/markAsRead`              | `ids`, `note_position`（default: false）                                                                                                                                                                                                                                                                                                   |
| `/APP/Timeline/uploadPicture`           | `image`                                                                                                                                                                                                                                                                                                                                    |
| `/APP/Timeline/toggleComments`          | `plurk_id`, `no_comments`                                                                                                                                                                                                                                                                                                                  |
| `/APP/Timeline/setPorn`                 | `plurk_id`, `porn`                                                                                                                                                                                                                                                                                                                         |
| `/APP/Timeline/reportAbuse`             | `plurk_id`, `category`, `reason`                                                                                                                                                                                                                                                                                                           |
| `/APP/Timeline/setUnreadSnapshot`       | `filter`（default: all）                                                                                                                                                                                                                                                                                                                   |
| `/APP/Timeline/getSnapshotUnreadPlurks` | `filter`（default: all）, `index`（default: 0）, `limit`（default: 0）, `favorers_detail`, `limited_detail`, `replurkers_detail`, `minimal_data`（default: false）, `minimal_user`（default: false）, `snapshot`（default: false）                                                                                                         |
| `/APP/Timeline/markAllAsRead`           | `filter`（default: all）, `exclude_ids`（default: []）                                                                                                                                                                                                                                                                                     |

### UserSearch（用戶搜尋）

| API                              | 可輸入參數                      |
| -------------------------------- | ------------------------------- |
| `/APP/UserSearch/search`         | `query`, `offset`（default: 0） |
| `/APP/UserSearch/searchAllField` | `query`, `offset`（default: 0） |

### Users（用戶）

| API                                        | 可輸入參數                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/APP/Users/me`                            | 無                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `/APP/Users/getKarmaStats`                 | 無                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `/APP/Users/update`                        | `full_name`, `display_name`, `gender`, `name_color`, `date_of_birth`, `birthday_privacy`, `country_id`, `relationship`, `about`, `email`, `privacy`, `creature`, `creature_special`, `filter_porn`（values: 0\|1\|2）, `filter_anonymous`（values: 0\|1）, `filter_keywords`, `pinned_plurk_id`（values: 0\|PID）, `friend_list_privacy`（values: public\|friends-only\|only-me）, `accept_gift`（values: always\|friends-only\|never）, `accept_private_plurk`（values: all\|friends\|none） |
| `/APP/Users/updateBackground`              | `bg_image`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `/APP/Users/setNameColor`                  | `color`（values: red\|green\|blue\|default\|pink\|gold\|lightblue\|lightgreen\|orange\|purple）                                                                                                                                                                                                                                                                                                                                                                                               |
| `/APP/Users/getAliases`                    | 無                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `/APP/Users/setAlias`                      | `user_id`, `alias`                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `/APP/Users/setPhoneNumber`                | `phone_number`（default: null）                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `/APP/Users/resendPhoneVerificationNumber` | 無                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `/APP/Users/verifyPhoneNumber`             | `verify_code`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `/APP/Users/getMailNotifications`          | 無                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `/APP/Users/setMailNotifications`          | `accepts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `/APP/Users/setPrivatePlurkAcceptence`     | `scope`（values: all\|friends\|none）                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

### /APP（基礎工具）

| API                | 可輸入參數 |
| ------------------ | ---------- |
| `/APP/checkToken`  | 無         |
| `/APP/expireToken` | 無         |
| `/APP/checkTime`   | 無         |
| `/APP/checkIP`     | 無         |
| `/APP/echo`        | `data`     |

---

## Users API

### `GET /APP/Users/me` _(requires access token)_

回傳當前用戶資訊，包含 page-title 和 user-about。

- **必要參數**：無
- **成功回傳**：user data

---

### `POST /APP/Users/update` _(requires access token)_

更新用戶資訊。

- **必要參數**：無
- **選用參數**：
  - `full_name`：完整姓名
  - `email`：電子郵件
  - `display_name`：顯示名稱（最長 15 字元）
  - `privacy`：`world` 或 `only_friends`
  - `date_of_birth`：格式 `YYYY-MM-DD`，如 `1985-05-13`
- **成功回傳**：HTTP 200，含更新後的 user info JSON
- **錯誤回傳**：
  - `{"error_text": "Email invalid"}`
  - `{"error_text": "Email already found"}`
  - `{"error_text": "Display name too long, should be less than 15 characters long"}`
  - `{"error_text": "Internal service error. Please, try later"}`

---

### `POST /APP/Users/updateAvatar` _(requires access token)_

更新用戶頭像。使用 `multipart/form-data` POST。最佳圖片尺寸：195x195 px。

- **必要參數**：
  - `profile_image`：新頭像圖片
- **成功回傳**：HTTP 200，含更新後的 user info JSON
- **錯誤回傳**：`{"error_text": "Not supported image format or image too big"}`

---

### `GET /APP/Users/getKarmaStats` _(requires access token)_

回傳當前用戶的 Karma 統計資訊。

- **必要參數**：無
- **成功回傳**：
  ```json
  {
    "karma_trend": ["1282046402-97.85", "1282060802-97.86", ...],
    "current_karma": 97.88,
    "karma_graph": "http://chart.apis.google.com/..."
  }
  ```
  - `karma_trend`：最近 30 次 karma 更新，格式為 `"[unix_timestamp]-[karma_value]"`

---

## Profile API

### `GET /APP/Profile/getOwnProfile` _(requires access token)_

回傳當前用戶的私人資料，可用於建構個人頁面和時間軸。

- **必要參數**：無
- **成功回傳**：
  ```json
  {
    "friends_count": 12,
    "fans_count": 14,
    "unread_count": 12,
    "user_info": { ... },
    "privacy": "world",
    "plurks_users": {"12": user_info_12, "313": user_info_313},
    "plurks": [plurk_data_1, plurk_data_2]
  }
  ```

---

### `GET /APP/Profile/getPublicProfile` _(two-legged OAuth)_

取得用戶的公開資料。

- **必要參數**：
  - `user_id`：整數 ID 或暱稱（如 `amix`）
- **成功回傳**：
  ```json
  {
    "friends_count": 12,
    "fans_count": 12,
    "user_info": { ... },
    "are_friends": false,
    "is_fan": false,
    "is_following": false,
    "has_read_permission": true,
    "privacy": "world",
    "plurks": [...]
  }
  ```
  > `are_friends`, `is_fan`, `is_following` 未登入時為 `null`
- **錯誤回傳**：
  - `{"error_text": "Invalid user_id"}`
  - `{"error_text": "User not found"}`

---

## Real-time 通知

比輪詢更有效率，請優先使用！

### `GET /APP/Realtime/getUserChannel` _(requires access token)_

取得用戶的通知頻道 URL。

- **必要參數**：無
- **成功回傳**：
  ```json
  {
  	"comet_server": "https://comet03.plurk.com/comet/1235515351741/?channel=generic-4-...",
  	"channel_name": "generic-4-f733d8522327edf87b4d1651e6395a6cca0807a0"
  }
  ```

### Comet 頻道規格

對取得的 URL 發送 GET 請求。無新資料時會等待約 50 秒再回應。**已登入用戶自己發的回應不會收到通知，但會收到新 Plurk 通知。**

- **選用參數**：
  - `offset`：從指定 offset 之後取新訊息，回傳時附帶 `new_offset`

**無新資料回傳：**

```json
{"new_offset": -1}   // 等待中，應用 offset=-1 繼續請求
{"new_offset": 3}    // 無新資料，用回傳的 offset 繼續請求
```

**有新回應（`"type":"new_response"`）：**

```json
{"new_offset": 21, "data": [{"plurk_id": 241392217, "response_count": 12, "type": "new_response", "response": {...}, "user": {...}, "_cid": 21}]}
```

**有新 Plurk（`"type":"new_plurk"`）：**

```json
{"new_offset": 27, "data": [{"lang":"en", "content":"test", "user_id":1, "plurk_type":1, "plurk_id":241403675, "type":"new_plurk", ...}]}
```

**錯誤：**

```json
{ "new_offset": -3 } // offset 錯誤，需重新同步資料
```

---

## Polling API

### `GET /APP/Polling/getPlurks` _(requires access token)_

取得用戶時間軸的新 Plurk，比 `/APP/Timeline/getPlurks` 更有效率。

- **必要參數**：
  - `offset`：回傳比此時間更新的 Plurk，格式 `2009-6-20T21:55:34`
- **選用參數**：
  - `limit`：最多回傳幾筆（預設 20）
  - `favorers_detail`、`limited_detail`、`replurkers_detail`：詳見 Timeline/getPlurks
- **成功回傳**：
  ```json
  {"plurks": [...], "plurk_users": {"3": {"id": 3, "nick_name": "alvin", ...}}}
  ```

---

### `GET /APP/Polling/getUnreadCount` _(requires access token)_

取得未讀 Plurk 數量。

- **必要參數**：無
- **成功回傳**：
  ```json
  { "all": 2, "my": 1, "private": 1, "responded": 0 }
  ```

---

## Timeline API

### `GET /APP/Timeline/getPlurk` _(requires access token)_

取得單一 Plurk。

- **必要參數**：
  - `plurk_id`：Plurk 的唯一 ID（數字，非 base36）
- **選用參數**：
  - `favorers_detail`：true 時在 `plurk_users` 加入所有按讚者詳細資訊
  - `limited_detail`：true 時在 `plurk_users` 加入私人 Plurk 接收者資訊
  - `replurkers_detail`：true 時在 `plurk_users` 加入所有 replurk 者詳細資訊
- **成功回傳**：`{"plurks": {...}, "user": {...}}`
- **錯誤回傳**：
  - `{"error_text": "Plurk owner not found"}`
  - `{"error_text": "Plurk not found"}`
  - `{"error_text": "No permissions"}`

---

### `GET /APP/Timeline/getPlurks` _(requires access token)_

取得時間軸 Plurk 列表。

- **必要參數**：無
- **選用參數**：
  - `offset`：回傳比此時間更舊的 Plurk，格式 `2009-6-20T21:55:34`
  - `limit`：回傳筆數（預設 20）
  - `filter`：`my`、`responded`、`private`、`favorite`、`replurked`、`mentioned`（`mentioned` 需 premium）
  - `favorers_detail`、`limited_detail`、`replurkers_detail`
- **成功回傳**：`{"plurks": [...], "plurk_users": {...}}`

---

### `GET /APP/Timeline/getUnreadPlurks` _(requires access token)_

取得未讀 Plurk 列表。

- **必要參數**：無
- **選用參數**：
  - `offset`：格式 `2009-6-20T21:55:34`
  - `limit`
  - `filter`：`my`、`responded`、`private`、`favorite`、`replurked`、`mentioned`
  - `favorers_detail`、`limited_detail`、`replurkers_detail`
- **成功回傳**：`{"plurks": [...], "plurk_users": {...}}`

---

### `GET /APP/Timeline/getPublicPlurks` _(requires access token)_

取得指定用戶的公開 Plurk。

- **必要參數**：
  - `user_id`：整數 ID 或暱稱
- **選用參數**：
  - `offset`：格式 `2009-6-20T21:55:34`
  - `limit`：預設 20
  - `favorers_detail`、`limited_detail`、`replurkers_detail`
- **成功回傳**：`{"plurks": [...], "plurk_users": {...}}`

---

### `POST /APP/Timeline/plurkAdd` _(requires access token)_

發佈新 Plurk。

- **必要參數**：
  - `content`：Plurk 內容
  - `qualifier`：英文限定詞（見 Qualifier 清單）
- **選用參數**：
  - `limited_to`：JSON 陣列，如 `[3,4,66,34]`；`[0]` 表示僅好友可見
  - `no_comments`：`0`=允許, `1`=禁止, `2`=僅好友
  - `lang`：語言代碼（見語言代碼清單）
- **成功回傳**：新 Plurk 的 JSON 物件
- **錯誤回傳**：
  - `{"error_text": "Invalid data"}`
  - `{"error_text": "Content is empty"}`
  - `{"error_text": "no-permission-to-comment"}`
  - `{"error_text": "anti-flood-same-content"}`
  - `{"error_text": "anti-flood-spam-domain"}`
  - `{"error_text": "anti-flood-too-many-new"}`

---

### `POST /APP/Timeline/plurkDelete` _(requires access token)_

刪除 Plurk。

- **必要參數**：`plurk_id`
- **成功回傳**：`{"success_text": "ok"}`
- **錯誤回傳**：`{"error_text": "Plurk not found"}` / `{"error_text": "No permissions"}`

---

### `POST /APP/Timeline/plurkEdit` _(requires access token)_

編輯 Plurk 內容。

- **必要參數**：`plurk_id`、`content`
- **成功回傳**：更新後的 Plurk JSON 物件
- **錯誤回傳**：`{"error_text": "Plurk not found"}` / `{"error_text": "No permissions"}`

---

### `POST /APP/Timeline/toggleComments` _(requires access token)_

切換 Plurk 的回應設定。

- **必要參數**：`plurk_id`、`no_comments`（0、1 或 2）
- **成功回傳**：`{"no_comments": 1}`
- **錯誤回傳**：`{"error_text": "Plurk not found"}`

---

### `POST /APP/Timeline/mutePlurks` _(requires access token)_

靜音多個 Plurk。

- **必要參數**：`ids`：JSON 陣列，如 `[342,23242,2323]`
- **成功回傳**：`{"success_text": "ok"}`

---

### `POST /APP/Timeline/unmutePlurks` _(requires access token)_

取消靜音多個 Plurk。

- **必要參數**：`ids`：JSON 陣列
- **成功回傳**：`{"success_text": "ok"}`

---

### `POST /APP/Timeline/favoritePlurks` _(requires access token)_

對多個 Plurk 按讚。

- **必要參數**：`ids`：JSON 陣列
- **成功回傳**：`{"success_text": "ok"}`

---

### `POST /APP/Timeline/unfavoritePlurks` _(requires access token)_

取消對多個 Plurk 按讚。

- **必要參數**：`ids`：JSON 陣列
- **成功回傳**：`{"success_text": "ok"}`

---

### `POST /APP/Timeline/replurk` _(requires access token)_

Replurk 多個 Plurk。

- **必要參數**：`ids`：JSON 陣列
- **回傳**：`{"success": true, "results": {342: {"success": true, "error": ""}}}`（頂層 `success` 為 true 表示全部成功）

---

### `POST /APP/Timeline/unreplurk` _(requires access token)_

取消 replurk 多個 Plurk。

- **必要參數**：`ids`：JSON 陣列
- **回傳**：同 replurk 格式

---

### `POST /APP/Timeline/markAsRead` _(requires access token)_

將多個 Plurk 標為已讀。

- **必要參數**：`ids`：JSON 陣列
- **選用參數**：`note_position`：`true` 時同步更新 `responses_seen`
- **成功回傳**：`{"success_text": "ok"}`

---

### `POST /APP/Timeline/uploadPicture` _(requires access token)_

上傳圖片到 Plurk CDN。使用 `multipart/form-data` POST。

- **必要參數**：`image`：圖片檔案
- **成功回傳**：
  ```json
  {
  	"full": "https://images.plurk.com/3466076_9b41abf90c623ba18f6ada5c1d37156f.jpg",
  	"thumbnail": "https://images.plurk.com/tn_3466076_9b41abf90c623ba18f6ada5c1d37156f.gif"
  }
  ```
- **錯誤回傳**：`{"error_text": "Invalid file"}`

---

### `POST /APP/Timeline/reportAbuse` _(requires access token)_

檢舉 Plurk 濫用。

- **必要參數**：
  - `plurk_id`
  - `categoty`（原文有 typo）：`porn`、`spam`、`privacy`、`violence`、`others`
- **成功回傳**：`{"success_text": "ok"}`

---

## Responses API

### `GET /APP/Responses/get` _(two-legged OAuth)_

取得指定 Plurk 的回應。

- **必要參數**：`plurk_id`
- **選用參數**：
  - `from_response`：從第幾筆開始（可為 5、10、15，預設 0）
  - `minimal_data`：回傳最小化資料（預設 false）
  - `count`：最多回傳幾筆（預設 0 = 全部）
- **匿名回應說明**：
  - 匿名 Plurk 的回應者 `user_id` 為 `99999`
  - 每個回應額外附帶 `handle`（匿名識別，作為顯示名稱）
  - `my_anonymous: true` 表示此回應為當前用戶所發
- **成功回傳**：`{"friends": {...}, "responses_seen": 2, "responses": [...]}`
- **錯誤回傳**：
  - `{"error_text": "Invalid data"}`
  - `{"error_text": "Plurk not found"}`
  - `{"error_text": "No permissions"}`

---

### `POST /APP/Responses/responseAdd` _(requires access token)_

新增回應。語言繼承自所回應的 Plurk。

- **必要參數**：
  - `plurk_id`
  - `content`：回應內容
  - `qualifier`：英文限定詞
- **成功回傳**：新回應的 JSON 物件
- **錯誤回傳**：
  - `{"error_text": "Invalid data"}`
  - `{"error_text": "Content is empty"}`
  - `{"error_text": "Plurk not found"}`
  - `{"error_text": "No permissions"}`
  - `{"error_text": "anti-flood-same-content"}`
  - `{"error_text": "anti-flood-too-many-new"}`

---

### `POST /APP/Responses/responseDelete` _(requires access token)_

刪除回應。用戶可刪除自己的回應，或刪除發佈在自己 Plurk 上的回應。

- **必要參數**：`response_id`、`plurk_id`
- **成功回傳**：`{"success_text": "ok"}`
- **錯誤回傳**：
  - `{"error_text": "Invalid data"}`
  - `{"error_text": "No permissions"}`

---

## Friends & Fans API

### `GET /APP/FriendsFans/getFriendsByOffset` _(two-legged OAuth)_

取得指定用戶的好友列表（每次 10 筆）。

- **必要參數**：`user_id`
- **選用參數**：`offset`（10、20、30...）、`limit`（預設 10）
- **成功回傳**：`[{"id": 3, "nick_name": "alvin", ...}, ...]`

---

### `GET /APP/FriendsFans/getFansByOffset` _(two-legged OAuth)_

取得指定用戶的粉絲列表（每次 10 筆）。

- **必要參數**：`user_id`
- **選用參數**：`offset`、`limit`（預設 10）
- **成功回傳**：`[{"id": 3, "nick_name": "alvin", ...}, ...]`

---

### `GET /APP/FriendsFans/getFollowingByOffset` _(requires access token)_

取得當前用戶正在追蹤（以粉絲身分）的用戶列表（每次 10 筆）。

- **必要參數**：無
- **選用參數**：`offset`、`limit`（預設 10）
- **成功回傳**：`[{"id": 3, "nick_name": "alvin", ...}, ...]`

---

### `POST /APP/FriendsFans/becomeFriend` _(requires access token)_

發送好友請求。

- **必要參數**：`friend_id`
- **成功回傳**：`{"success_text": "ok"}`
- **錯誤回傳**：
  - `{"error_text": "User can't be befriended"}`
  - `{"error_text": "User already befriended"}`

---

### `POST /APP/FriendsFans/removeAsFriend` _(requires access token)_

移除好友（對方不會收到通知）。

- **必要參數**：`friend_id`
- **成功回傳**：`{"success_text": "ok"}`

---

### `POST /APP/FriendsFans/becomeFan` _(requires access token)_

成為某用戶的粉絲。若要取消追蹤，使用 `/APP/FriendsFans/setFollowing?fan_id=FAN_ID&follow=false`。

- **必要參數**：`fan_id`
- **成功回傳**：`{"success_text": "ok"}`

---

### `POST /APP/FriendsFans/setFollowing` _(requires access token)_

更新對某用戶的追蹤狀態（可追蹤好友或取消追蹤粉絲）。

- **必要參數**：
  - `user_id`
  - `follow`：`true` 追蹤，`false` 取消追蹤
- **成功回傳**：`{"success_text": "ok"}`
- **錯誤回傳**：`{"error_text": "User must be befriended before you can follow them"}`

---

### `GET /APP/FriendsFans/getCompletion` _(requires access token)_

取得好友的暱稱和全名，用於私人 Plurk 的自動補全。（好友列表可能很大，建議 lazy-load）

- **必要參數**：無
- **成功回傳**：`{"2": {"nick_name": "kan", "full_name": "Kan Kan"}, ...}`

---

## Alerts API

### Alert 資料結構

| 類型                | 結構                                                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 好友請求（需處理）  | `{"type": "friendship_request", "from_user": {...}, "posted": ...}`                                                   |
| 好友請求待確認      | `{"type": "friendship_pending", "to_user": {...}, "posted": ...}`                                                     |
| 新粉絲通知          | `{"type": "new_fan", "new_fan": {...}, "posted": ...}`                                                                |
| 好友請求接受通知    | `{"type": "friendship_accepted", "friend_info": {...}, "posted": ...}`                                                |
| 新好友通知          | `{"type": "new_friend", "new_friend": {...}, "posted": ...}`                                                          |
| 私人 Plurk          | `{"type": "private_plurk", "owner": {...}, "posted": ..., "plurk_id": ...}`                                           |
| Plurk 被按讚        | `{"type": "plurk_liked", "from_user": {...}, "posted": ..., "plurk_id": ..., "num_others": ...}`                      |
| Plurk 被 replurk    | `{"type": "plurk_replurked", "from_user": {...}, "posted": ..., "plurk_id": ..., "num_others": ...}`                  |
| 被 @ 提及           | `{"type": "mentioned", "from_user": {...}, "posted": ..., "plurk_id": ..., "num_others": ..., "response_id": ...}`    |
| 自己的 Plurk 被回應 | `{"type": "my_responded", "from_user": {...}, "posted": ..., "plurk_id": ..., "num_others": ..., "response_id": ...}` |

> `mentioned` 的 `response_id` 若為 `null`，表示在 Plurk 本文中被提及（非回應）

---

### `GET /APP/Alerts/getActive` _(requires access token)_

取得當前活躍的 alert 列表。

- **成功回傳**：`[{"id": 42, "nick_name": "frodo_b", ...}, ...]`

---

### `GET /APP/Alerts/getHistory` _(requires access token)_

取得過去 30 筆 alert 歷史紀錄。

- **成功回傳**：`[{"nick_name": "frodo_b", ...}, ...]`

---

### `POST /APP/Alerts/addAsFan` _(requires access token)_

接受某用戶為粉絲。

- **必要參數**：`user_id`
- **成功回傳**：`{"success_text": "ok"}`

---

### `POST /APP/Alerts/addAllAsFan` _(requires access token)_

接受所有好友請求為粉絲。

- **成功回傳**：`{"success_text": "ok"}`

---

### `POST /APP/Alerts/addAllAsFriends` _(requires access token)_

接受所有好友請求為好友。

- **成功回傳**：`{"success_text": "ok"}`

---

### `POST /APP/Alerts/addAsFriend` _(requires access token)_

接受某用戶為好友。

- **必要參數**：`user_id`
- **成功回傳**：`{"success_text": "ok"}`

---

### `POST /APP/Alerts/denyFriendship` _(requires access token)_

拒絕好友請求。

- **必要參數**：`user_id`
- **成功回傳**：`{"success_text": "ok"}`

---

### `POST /APP/Alerts/removeNotification` _(requires access token)_

移除對某用戶的通知。

- **必要參數**：`user_id`
- **成功回傳**：`{"success_text": "ok"}`

---

## Search API

### `GET /APP/PlurkSearch/search` _(two-legged OAuth)_

搜尋 Plurk，回傳最新 20 筆。

- **必要參數**：`query`
- **選用參數**：`offset`（10、20、30...）
- **成功回傳**：`[{"id": 3, "content": "Test", ...}, ...]`

---

### `GET /APP/UserSearch/search` _(two-legged OAuth)_

搜尋用戶，回傳 10 筆，依 karma 排序。

- **必要參數**：`query`
- **選用參數**：`offset`
- **成功回傳**：用戶列表 JSON 陣列

---

## Emoticons API

### `GET /APP/Emoticons/get` _(two-legged OAuth)_

取得所有表情符號。

- **成功回傳**：
  ```json
  {
    "karma": {"0": [[":-))", "https://s.plurk.com/xxxxx.gif"], ...], ...},
    "recruited": {"10": [["(bigeyes)", "https://s.plurk.com/xxxxx.gif"], ...], ...}
  }
  ```
  - `karma[25]`：karma 需達 25 才能使用
  - `recruited[10]`：`user.recruited >= 10` 才能使用
  - `custom`：用戶自訂表情（需三腳 OAuth）

---

## Blocks API

### `GET /APP/Blocks/get` _(requires access token)_

取得已封鎖的用戶列表。

- **選用參數**：`offset`（0、10、20...）
- **成功回傳**：`{"total": 12, "users": [{...}, ...]}`

---

### `POST /APP/Blocks/block` _(requires access token)_

封鎖用戶。

- **必要參數**：`user_id`
- **成功回傳**：`{"success_text": "ok"}`

---

### `POST /APP/Blocks/unblock` _(requires access token)_

解除封鎖用戶。

- **必要參數**：`user_id`
- **成功回傳**：`{"success_text": "ok"}`

---

## Cliques API

### `GET /APP/Cliques/getCliques` _(requires access token)_

取得當前用戶的所有 Clique 列表。

- **成功回傳**：`["Homies", "Coders", ...]`

---

### `GET /APP/Cliques/getClique` _(requires access token)_

取得指定 Clique 的成員列表。

- **必要參數**：`clique_name`
- **成功回傳**：`[{"display_name": "amix3", ...}, ...]`

---

### `POST /APP/Cliques/createClique` _(requires access token)_

建立新 Clique。

- **必要參數**：`clique_name`
- **成功回傳**：`{"success_text": "ok"}`

---

### `POST /APP/Cliques/renameClique` _(requires access token)_

重新命名 Clique。

- **必要參數**：`clique_name`、`new_name`
- **成功回傳**：`{"success_text": "ok"}`

---

### `POST /APP/Cliques/add` _(requires access token)_

將用戶加入 Clique。

- **必要參數**：`clique_name`、`user_id`
- **成功回傳**：`{"success_text": "ok"}`
- **錯誤回傳**：`{"error_text": "Clique not created"}`

---

### `POST /APP/Cliques/remove` _(requires access token)_

從 Clique 移除用戶。

- **必要參數**：`clique_name`、`user_id`
- **成功回傳**：`{"success_text": "ok"}`
- **錯誤回傳**：`{"error_text": "Clique not created"}`

---

## OAuth Utilities

### `GET /APP/checkToken` _(requires access token)_

驗證當前 access token 並回傳 token 資訊。

- **成功回傳**：`app_id`、`user_id`、`issued`（發行時間）、`deviceid`

---

### `GET /APP/expireToken` _(requires access token)_

讓當前 access token 失效。

- **成功回傳**：`app_id`、`user_id`、`issued`、`deviceid`

---

### `GET /APP/checkTime` _(two-legged OAuth)_

取得 Plurk 伺服器當前時間。

- **成功回傳**：
  - `now`：伺服器當前時間
  - `timestamp`：Unix timestamp
  - `app_id`
  - `user_id`（兩腳 OAuth 為 null）

---

### `GET /APP/echo` _(two-legged OAuth)_

測試參數傳遞。

- **必要參數**：`data`
- **成功回傳**：`data`（原值）、`length`（資料長度）
