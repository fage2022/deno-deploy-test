export async default main(req){
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