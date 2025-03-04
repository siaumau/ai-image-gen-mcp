const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3003;

// 獲取本機IP地址
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // 跳過非IPv4和內部地址
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '0.0.0.0'; // 如果找不到合適的IP，返回0.0.0.0
}

const localIp = getLocalIpAddress();

// 啟用CORS和JSON解析
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MCP服務器元數據
const mcpMetadata = {
  jsonrpc: "2.0",
  name: 'fetch-mcp',
  description: '提供fetch功能的MCP服務器',
  version: '1.0.0',
  tools: [
    {
      name: 'fetch',
      description: '從指定URL獲取數據',
      parameters: {
        type: 'object',
        required: ['method', 'url'],
        properties: {
          method: {
            type: 'string',
            description: '請求方法 (GET, POST, PUT, DELETE等)',
            enum: ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'],
          },
          url: {
            type: 'string',
            description: '要請求的URL',
          },
          body: {
            type: 'string',
            description: '請求體 (對於POST, PUT等請求)',
          },
          headers: {
            type: 'object',
            description: '請求頭',
            additionalProperties: {
              type: 'string',
            },
          },
        },
      },
    },
  ],
};

// MCP元數據端點
app.get('/mcp', (req, res) => {
  res.json(mcpMetadata);
});

// 添加 SSE 端點
app.get('/mcp/sse', (req, res) => {
  console.log('SSE連接請求來自:', req.ip);

  // 設置 SSE 頭部
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // 發送初始連接成功消息
  res.write(`data: ${JSON.stringify({ jsonrpc: "2.0", type: 'connection_established' })}\n\n`);

  // 保持連接活躍
  const keepAliveInterval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ jsonrpc: "2.0", type: 'ping' })}\n\n`);
  }, 30000); // 每30秒發送一次ping

  // 當客戶端斷開連接時清除定時器
  req.on('close', () => {
    console.log('SSE連接關閉:', req.ip);
    clearInterval(keepAliveInterval);
  });
});

// 添加一個測試SSE的HTML頁面
app.get('/test-sse', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SSE Test</title>
    </head>
    <body>
      <h1>SSE Test</h1>
      <div id="messages"></div>
      <script>
        const messagesDiv = document.getElementById('messages');
        const eventSource = new EventSource('/mcp/sse');

        eventSource.onmessage = function(event) {
          const message = document.createElement('p');
          message.textContent = event.data;
          messagesDiv.appendChild(message);
        };

        eventSource.onerror = function(error) {
          const message = document.createElement('p');
          message.textContent = 'Error: ' + JSON.stringify(error);
          message.style.color = 'red';
          messagesDiv.appendChild(message);
        };
      </script>
    </body>
    </html>
  `);
});

// Fetch工具端點
app.post('/mcp/tools/fetch', async (req, res) => {
  try {
    const { id, method, url, body, headers = {} } = req.body;

    if (!method || !url) {
      return res.status(400).json({
        jsonrpc: "2.0",
        id: id || null,
        error: {
          code: -32602,
          message: '缺少必要參數: method和url是必需的',
        }
      });
    }

    // 準備請求選項
    const options = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    // 如果有請求體，添加到選項中
    if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      try {
        // 嘗試解析為JSON
        options.body = typeof body === 'string' ? body : JSON.stringify(body);
      } catch (e) {
        // 如果不是有效的JSON，直接使用字符串
        options.body = body;
      }
    }

    // 發送請求
    const response = await fetch(url, options);

    // 獲取響應頭
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    // 嘗試解析為JSON，如果失敗則返回文本
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = await response.text();
      }
    } else {
      responseData = await response.text();
    }

    // 返回結果
    res.json({
      jsonrpc: "2.0",
      id: id || null,
      result: {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data: responseData,
      }
    });
  } catch (error) {
    res.status(500).json({
      jsonrpc: "2.0",
      id: req.body.id || null,
      error: {
        code: -32603,
        message: error.message,
        data: {
          stack: error.stack
        }
      }
    });
  }
});

// 健康檢查端點
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'fetch-mcp',
    version: '1.0.0',
    ip: localIp,
  });
});

// 啟動服務器，監聽所有網絡接口
app.listen(PORT, '0.0.0.0', () => {
  console.log(`MCP服務器運行在 http://localhost:${PORT} (本地訪問)`);
  console.log(`MCP服務器運行在 http://${localIp}:${PORT} (內網訪問)`);
  console.log(`MCP端點: http://${localIp}:${PORT}/mcp`);
  console.log(`MCP SSE端點: http://${localIp}:${PORT}/mcp/sse`);
  console.log(`SSE測試頁面: http://${localIp}:${PORT}/test-sse`);
});
