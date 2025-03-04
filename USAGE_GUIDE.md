# Fetch MCP 使用指南

這個指南將幫助您設置和使用Fetch MCP服務器，讓您可以在Cursor IDE中使用fetch功能。

## 安裝步驟

1. 克隆此倉庫：
   ```bash
   git clone https://github.com/yourusername/ai-image-gen-mcp.git
   cd ai-image-gen-mcp
   ```

2. 安裝依賴：
   ```bash
   npm install
   ```

3. 啟動服務器：
   ```bash
   npm start
   ```

   服務器將顯示以下信息：
   - 本地訪問地址：`http://localhost:3000`
   - 內網訪問地址：`http://YOUR_IP_ADDRESS:3000`（顯示您的實際IP地址）
   - MCP端點：`http://YOUR_IP_ADDRESS:3000/mcp`
   - MCP SSE端點：`http://YOUR_IP_ADDRESS:3000/mcp/sse`

## 在Cursor中設置MCP

1. 打開Cursor IDE
2. 點擊左下角的設置圖標（⚙️）
3. 選擇"功能"選項卡
4. 找到並啟用"MCP服務器"功能（如果尚未啟用）
5. 點擊"添加MCP服務器"按鈕
6. 填寫以下信息：
   - 名稱：`fetch`（這將是您在Cursor中使用的命令名稱）
   - 類型：`sse`
   - 服務器URL：
     - 本地使用：`http://localhost:3000/mcp/sse`
     - 從其他設備使用：`http://YOUR_IP_ADDRESS:3000/mcp/sse`（使用服務器啟動時顯示的IP地址）
7. 點擊"保存"

## 使用方法

在Cursor中，您可以使用以下格式的命令來使用fetch功能：

### 基本GET請求

```
@fetch get https://api.example.com/data
```

### 帶有請求體的POST請求

```
@fetch post https://api.example.com/data {"key": "value"}
```

### 帶有自定義請求頭的請求

```
@fetch get https://api.example.com/data {"headers": {"Authorization": "Bearer token123"}}
```

### 完整選項

```
@fetch post https://api.example.com/data {"body": {"key": "value"}, "headers": {"Content-Type": "application/json", "Authorization": "Bearer token123"}}
```

## 使用場景

### 1. 獲取API數據

```
@fetch get https://api.openai.com/v1/models
```

### 2. 發送圖像生成請求

```
@fetch post https://api.openai.com/v1/images/generations {"body": {"prompt": "一隻可愛的貓咪", "n": 1, "size": "1024x1024"}, "headers": {"Authorization": "Bearer YOUR_API_KEY"}}
```

### 3. 獲取網頁內容

```
@fetch get https://example.com
```

## 內網使用說明

如果您想從同一網絡的其他設備訪問此MCP服務器：

1. 確保服務器運行在可以訪問的設備上
2. 記下服務器啟動時顯示的內網IP地址
3. 在其他設備的Cursor中，使用該IP地址配置MCP服務器，記得使用 `/mcp/sse` 路徑
4. 確保您的防火牆允許3000端口的訪問

## 故障排除

如果您遇到問題，請檢查以下事項：

1. 確保MCP服務器正在運行（http://localhost:3000 或 http://YOUR_IP_ADDRESS:3000 應該返回一個狀態頁面）
2. 確保您在Cursor中正確配置了MCP服務器，特別是使用了正確的 SSE 端點 (`/mcp/sse`)
3. 檢查控制台輸出是否有錯誤信息
4. 如果從其他設備訪問，請確保兩台設備在同一網絡中，並且沒有防火牆阻止連接
5. 如果看到 "SSE error: TypeError: fetch failed" 錯誤，請確保使用了正確的 SSE 端點

## 高級用法

### 使用環境變量

您可以創建一個`.env`文件來存儲API密鑰等敏感信息：

```
API_KEY=your_api_key_here
```

然後修改服務器代碼以使用這些環境變量。

### 自定義響應處理

您可以修改`src/index.js`文件中的`fetchTool`處理程序來自定義響應處理邏輯。

### 更改端口

如果您需要更改默認的3000端口，可以在啟動服務器時設置PORT環境變量：

```bash
PORT=8080 npm start
```
