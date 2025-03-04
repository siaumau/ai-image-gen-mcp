#!/usr/bin/env node

const fetch = require('node-fetch');

// 解析命令行參數
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`
使用方法: fetch-mcp <method> <url> [body] [headers]

參數:
  method   - 請求方法 (GET, POST, PUT, DELETE等)
  url      - 要請求的URL
  body     - 請求體 (對於POST, PUT等請求)，JSON格式
  headers  - 請求頭，JSON格式

示例:
  fetch-mcp get https://api.example.com/data
  fetch-mcp post https://api.example.com/data {"key":"value"}
  fetch-mcp get https://api.example.com/data "" {"Authorization":"Bearer token123"}
  `);
  process.exit(1);
}

const method = args[0].toLowerCase();
const url = args[1];
let body = undefined;
let headers = {};

// 處理請求體和請求頭
if (args.length > 2 && args[2] !== '') {
  try {
    // 嘗試解析為JSON
    body = args[2];
  } catch (e) {
    // 如果不是有效的JSON，直接使用字符串
    body = args[2];
  }
}

if (args.length > 3 && args[3] !== '') {
  try {
    headers = JSON.parse(args[3]);
  } catch (e) {
    console.error('錯誤: 請求頭必須是有效的JSON格式');
    console.error('提供的請求頭:', args[3]);
    process.exit(1);
  }
}

// 發送請求到MCP服務器
async function sendRequest() {
  try {
    console.log('發送請求到:', url);
    console.log('方法:', method.toUpperCase());
    if (body) console.log('請求體:', body);
    if (Object.keys(headers).length > 0) console.log('請求頭:', headers);

    const response = await fetch('http://localhost:3000/mcp/tools/fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method,
        url,
        body,
        headers,
      }),
    });

    const data = await response.json();

    // 格式化輸出
    console.log('\n狀態碼:', data.status, data.statusText);
    console.log('\n響應頭:');
    for (const [key, value] of Object.entries(data.headers)) {
      console.log(`  ${key}: ${value}`);
    }

    console.log('\n響應體:');
    if (typeof data.data === 'object') {
      console.log(JSON.stringify(data.data, null, 2));
    } else {
      console.log(data.data);
    }
  } catch (error) {
    console.error('錯誤:', error.message);
    process.exit(1);
  }
}

sendRequest();
