Deno.serve((req) => {
    if (req.headers.get("upgrade") != "websocket") {
      const url = new URL(req.url);
      const path = url.pathname;
      const method = req.method;
    
      // 路由匹配逻辑
      if (method === "GET" && path === "/") {
        return new Response("首页 🎯", { status: 200 });
      }
    
      if (method === "GET" && path === "/about") {
        return new Response("关于我们 📖", { status: 200 });
      }
    
      if (method === "GET" && path === "/api/users") {
        // 返回 JSON 数据
        return new Response(JSON.stringify([
          { id: 1, name: "张三" },
          { id: 2, name: "李四" }
        ]), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }        
      return new Response(null, { status: 426 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);
    socket.addEventListener("open", () => {
        console.log("a client connected!");
    });

    socket.addEventListener("message", (event) => {
        if (event.data === "ping") {
            socket.send("pong");
        }
        console.log(event.data.toString());
        socket.send(event.data);
    });

    return response;
});

Deno.cron("cleanup-old-data", "0 * * * *", () => {
  // Runs every hour
  console.log("Cleaning up old data...");
});

Deno.cron("daily-report", "0 9 * * *", () => {
  // Runs daily at 9:00 AM
  console.log("Generating daily report...");
});
