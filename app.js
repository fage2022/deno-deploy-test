import express from 'express'
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const app = express()

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(80, () => {
    console.log('Server is running on http://localhost:3000')
})





wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.send('something');
});

console.log('WebSocket server is running on ws://localhost:8080');