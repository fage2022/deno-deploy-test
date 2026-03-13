import express from 'express'
import http from 'http'
import { WebSocketServer } from 'ws';

// 1. 创建 Express 应用
const app = express();
const PORT = 80;

// 普通 HTTP 接口（测试用）
app.get('/', (req, res) => {
  res.send('Express 服务正常运行，WebSocket 端口：ws://localhost:80');
});

// 2. 创建 HTTP 服务器（Express 挂载到该服务器）
const server = http.createServer(app);

// 3. 基于 HTTP 服务器创建 WebSocket 服务
const wss = new WebSocketServer({ server });

// 4. 监听 WebSocket 连接事件（核心：处理握手和通信）
wss.on('connection', (ws, req) => {
  console.log('新的 WebSocket 客户端连接成功');

  // ① 监听客户端发送的消息
  ws.on('message', (message) => {
    console.log(`收到客户端消息：${message}`);
    // 回复客户端（WebSocket 响应）
    ws.send(`服务器已收到：${message}`);
    
    // 广播消息给所有连接的客户端（可选）
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`广播：${message}`);
      }
    });
  });

  // ② 监听连接关闭
  ws.on('close', () => {
    console.log('WebSocket 客户端断开连接');
  });

  // ③ 监听错误
  ws.on('error', (error) => {
    console.error('WebSocket 错误：', error);
  });

  // 主动发送欢迎消息（连接成功后立即响应）
  ws.send('欢迎连接 WebSocket 服务器！');
});

// 5. 启动服务器（同时监听 HTTP 和 WebSocket）
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`WebSocket 地址：ws://localhost:${PORT}`);
});
