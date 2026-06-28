# n8n-nodes-plurk

這是一個 n8n community node，提供 Plurk API 2.0 的常用資源與操作，讓你可以在 n8n workflow 中讀取時間軸、發噗、管理回應、搜尋、上傳照片，以及呼叫其他 Plurk API endpoint。

## 功能特色

- 支援 Plurk API 2.0 endpoint
- 使用 OAuth 1.0a 簽署 Plurk API request
- 依 Plurk API 類別整理 Resources 與 Operations
- 支援可接受檔案的 API endpoint 進行 binary upload
- 可作為 n8n AI tool 使用
- 支援 Plurk 的 two-legged OAuth endpoint；這類 endpoint 只需要 `Consumer Key` 與 `Consumer Secret`

## 安裝方式

在 n8n 的 Community Nodes 設定中安裝此 package：

```text
@vin87426/n8n-nodes-plurk
```

安裝後，在 workflow 中新增 `Plurk` node 即可開始設定資源、操作與認證資訊。

## Plurk Credential 設定

此 node 使用 `Plurk OAuth1 API` credential。你需要在 n8n 中建立一組 credential，並填入以下欄位：

| n8n 欄位             | Plurk OAuth 對應資訊                   | 用途                      |
| -------------------- | -------------------------------------- | ------------------------- |
| `Consumer Key`       | Plurk App 的 consumer key              | 辨識你的 Plurk App        |
| `Consumer Secret`    | Plurk App 的 consumer secret           | 用於 OAuth request 簽章   |
| `OAuth Token`        | 使用者授權後取得的 access token key    | 代表 Plurk 使用者呼叫 API |
| `OAuth Token Secret` | 使用者授權後取得的 access token secret | 用於 access token 簽章    |

大多數 Plurk API 都是 three-legged OAuth，需要四個欄位都填寫。少數公開或工具類 endpoint 是 two-legged OAuth，只需要 `Consumer Key` 與 `Consumer Secret`；如果你不確定要呼叫的操作是哪一種，建議先填完整四個欄位。

### 取得 Consumer Key 與 Consumer Secret

1. 登入 Plurk。
2. 開啟 [Plurk App 建立頁面](https://www.plurk.com/PlurkApp/create)。
3. 建立一個 Plurk App。
4. 建立完成後，在 App 資訊頁取得 `consumer key` 與 `consumer secret`。
5. 回到 n8n，開啟 `Credentials`，新增 `Plurk OAuth1 API`。
6. 將 Plurk App 的 `consumer key` 填入 `Consumer Key`，將 `consumer secret` 填入 `Consumer Secret`。

### 取得 OAuth Token 與 OAuth Token Secret

Plurk API 使用 OAuth 1.0a。一般完整流程是：先取得 request token，引導使用者到 Plurk 授權頁，取得 OAuth verifier，再交換永久 access token。對 n8n 自動化或 bot 使用情境，最簡單的方式是使用 Plurk 官方 test console 直接產生永久 token。

1. 確認你已經有 Plurk App 的 `consumer key` 與 `consumer secret`。
2. 開啟 [Plurk OAuth test console](https://www.plurk.com/OAuth/test)。
3. 輸入你的 `consumer key` 與 `consumer secret`。
4. 依頁面指示授權你的 Plurk App 存取帳號。
5. 授權完成後，複製產生的 `oauth_token` 與 `oauth_token_secret`。
6. 回到 n8n 的 `Plurk OAuth1 API` credential。
7. 將 `oauth_token` 填入 `OAuth Token`，將 `oauth_token_secret` 填入 `OAuth Token Secret`。
8. 儲存 credential，並在 `Plurk` node 中選用這組 credential。

> 請妥善保存 `Consumer Secret` 與 `OAuth Token Secret`。這些資訊等同於允許你的 workflow 代表該 Plurk 帳號呼叫 API，不應提交到 Git repository 或公開分享。

### OAuth 端點參考

如果你要自行實作 OAuth 授權流程，可參考 Plurk API 2.0 文件中的 OAuth flow。主要端點如下：

| 用途                     | URL                                         |
| ------------------------ | ------------------------------------------- |
| 取得 Request Token       | `https://www.plurk.com/OAuth/request_token` |
| 使用者授權頁面           | `https://www.plurk.com/OAuth/authorize`     |
| 使用者授權頁面（行動版） | `https://www.plurk.com/m/authorize`         |
| 取得 Access Token        | `https://www.plurk.com/OAuth/access_token`  |

OAuth request 使用 HMAC-SHA1 簽章，OAuth 參數會放在 HTTP `Authorization` header。更多 Plurk API 細節可參考 [docs/plurk-api-2.0.md](docs/plurk-api-2.0.md)。

## 基本使用方式

1. 在 n8n workflow 中新增 `Plurk` node。
2. 選擇 `Plurk OAuth1 API` credential。
3. 選擇要使用的 `Resource`，例如 `Timeline`、`Responses`、`Users`、`Search`。
4. 選擇對應的 `Operation`。
5. 填寫該 operation 需要的參數。
6. 執行 workflow。

## 可用資源

目前 node 依 Plurk API 類別提供下列資源：

- Users
- Profile
- Realtime
- Polling
- Timeline
- Responses
- Friends/Fans
- Alerts
- Bookmarks
- Photos
- Premium
- Search
- Emoticons
- Blocks
- Cliques
- OAuth Utilities

實際可用 operation 會顯示在 n8n 的 `Operation` 下拉選單中。

## 本機開發

```bash
npm install
npm run lint
npm run build
```

開發時可使用：

```bash
npm run dev
```

完整檢查可執行：

```bash
npm run check
```

## 發布與 n8n verified 流程

此專案使用 `n8n-node release` 搭配 GitHub Actions 發布，讓 npm package 產生 provenance，符合 n8n Creator Portal verified community node 的發布要求。

1. 先在 npm package settings 設定 Trusted Publishing，publisher 指向此 GitHub repository 與 `.github/workflows/publish.yml`；或在 GitHub Actions secrets 設定 `NPM_TOKEN` 作為 fallback。
2. 本機執行：

   ```bash
   npm run release
   ```

3. 本機 release 會執行 lint/build、更新 changelog、建立 release commit、建立版本 tag，並 push 到 GitHub。
4. GitHub Actions 會被版本 tag 觸發，執行 `npm run release`；在 CI 中這個 command 會 build 後以 `npm publish` 搭配 provenance 發布到 npm。
5. npm package 顯示 provenance 後，再提交到 n8n Creator Portal 申請 verified。

## 參考文件

- [Plurk API 2.0 摘要](docs/plurk-api-2.0.md)
- [Plurk App 建立頁面](https://www.plurk.com/PlurkApp/create)
- [Plurk OAuth test console](https://www.plurk.com/OAuth/test)
- [n8n Community Nodes 文件](https://docs.n8n.io/integrations/community-nodes/)

## License

MIT
