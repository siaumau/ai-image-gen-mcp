# AI Image Gen MCP

這是一個基於Model Context Protocol (MCP)的服務器，提供fetch功能，可以用於從網絡獲取數據，特別適用於AI圖像生成等應用。

## 功能

- 提供fetch工具，可以從任何URL獲取數據
- 支持GET和POST請求
- 支持自定義請求頭
- 支持JSON和文本格式的響應
- 支持內網訪問，可以從同一網絡的其他設備訪問

## 安裝

```bash
# 安裝依賴
npm install

# 啟動服務器
npm start
```

啟動後，服務器將顯示本地和內網訪問地址。

## 在Cursor中使用

1. 打開Cursor IDE
2. 進入設置 > 功能
3. 啟用MCP功能
4. 添加新的MCP服務器配置：
   - 名稱：`fetch`
   - 類型：`sse`
   - 服務器URL：
     - 本地訪問：`http://localhost:3002/mcp/sse`
     - 內網訪問：`http://YOUR_IP_ADDRESS:3002/mcp/sse`（啟動服務器時會顯示確切的IP地址）

## 測試SSE連接

您可以通過訪問以下URL來測試SSE連接是否正常工作：
```
http://YOUR_IP_ADDRESS:3002/test-sse
```

如果連接成功，您將看到一個網頁，顯示從服務器接收到的SSE消息。

## 使用示例

在Cursor中，您可以使用以下命令來使用fetch功能：

```
@fetch get https://api.example.com/data
```

或者帶有POST數據：

```
@fetch post https://api.example.com/data {"key": "value"}
```

## 故障排除

如果在Cursor中看到"SSE error: TypeError: fetch failed"錯誤，請檢查：
1. 確保服務器正在運行
2. 確保URL中包含`/mcp/sse`路徑（注意路徑必須完整）
3. 確保沒有防火牆阻止連接
4. 嘗試在瀏覽器中訪問 `/test-sse` 頁面，確認SSE連接是否正常工作
5. 檢查服務器控制台輸出，查看是否有連接請求和錯誤信息

如果啟動服務器時出現 `EADDRINUSE` 錯誤，表示端口已被佔用：
1. 嘗試終止佔用該端口的進程（可能是之前啟動的服務器實例）
2. 使用以下命令查找並終止佔用端口的進程：
   ```
   # Windows
   netstat -ano | findstr :3002
   taskkill /PID <進程ID> /F

   # Linux/Mac
   lsof -i :3002
   kill -9 <進程ID>
   ```
3. 或者修改 `src/index.js` 中的 PORT 變量，使用不同的端口

## 許可證

MIT
