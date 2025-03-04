// 這是一個示例，展示如何在Node.js中使用fetch MCP
// 在實際使用中，您會在Cursor IDE中通過@fetch命令使用

const fetch = require('node-fetch');

async function testFetchMCP() {
  try {
    // 示例1: 簡單的GET請求
    console.log('示例1: 簡單的GET請求');
    const getResponse = await fetch('http://localhost:3000/mcp/tools/fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'get',
        url: 'https://jsonplaceholder.typicode.com/todos/1',
      }),
    });

    const getData = await getResponse.json();
    console.log('GET響應:', JSON.stringify(getData, null, 2));
    console.log('-----------------------------------');

    // 示例2: 帶有請求體的POST請求
    console.log('示例2: 帶有請求體的POST請求');
    const postResponse = await fetch('http://localhost:3000/mcp/tools/fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'post',
        url: 'https://jsonplaceholder.typicode.com/posts',
        body: JSON.stringify({
          title: 'foo',
          body: 'bar',
          userId: 1,
        }),
      }),
    });

    const postData = await postResponse.json();
    console.log('POST響應:', JSON.stringify(postData, null, 2));
    console.log('-----------------------------------');

    // 示例3: 帶有自定義頭的GET請求
    console.log('示例3: 帶有自定義頭的GET請求');
    const customHeaderResponse = await fetch('http://localhost:3000/mcp/tools/fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'get',
        url: 'https://jsonplaceholder.typicode.com/users',
        headers: {
          'Accept': 'application/json',
          'X-Custom-Header': 'custom-value',
        },
      }),
    });

    const customHeaderData = await customHeaderResponse.json();
    console.log('自定義頭響應:', JSON.stringify(customHeaderData, null, 2));
    console.log('-----------------------------------');

    // 示例4: 獲取MCP元數據
    console.log('示例4: 獲取MCP元數據');
    const metadataResponse = await fetch('http://localhost:3000/mcp');
    const metadata = await metadataResponse.json();
    console.log('MCP元數據:', JSON.stringify(metadata, null, 2));
  } catch (error) {
    console.error('錯誤:', error);
  }
}

// 運行測試
console.log('開始測試fetch MCP...');
testFetchMCP()
  .then(() => console.log('測試完成!'))
  .catch(err => console.error('測試失敗:', err));
