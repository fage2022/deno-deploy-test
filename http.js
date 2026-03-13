export default async function main(req){
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


    // 处理文件上传接口
  if (req.method === "POST" && url.pathname === "/upload") {
    try {
      // 解析 multipart/form-data 格式的上传请求
      const formData = await req.formData();
      const file = formData.get("file");

      if (!file) {
        return new Response(JSON.stringify({ error: "未选择文件" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // 限制文件大小（Deno KV 单值建议 <25MB）
      if (file.size > 25 * 1024 * 1024) {
        return new Response(JSON.stringify({ error: "文件大小不能超过 25MB" }), {
          status: 413,
          headers: { "Content-Type": "application/json" },
        });
      }

      // 读取文件内容为 ArrayBuffer
      const fileBuffer = await file.arrayBuffer();
      const fileKey = `uploads/${crypto.randomUUID()}-${file.name}`; // 生成唯一键

      // 存储到 Deno KV
      const kv = await Deno.openKv();
      await kv.set([fileKey], fileBuffer);
      await kv.close();

      // 返回文件访问链接
      return new Response(JSON.stringify({
        success: true,
        fileKey,
        url: `${new URL(req.url).origin}/file/${fileKey}`,
      }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // 处理文件访问接口
  if (req.method === "GET" && url.pathname.startsWith("/file/")) {
    try {
      const fileKey = url.pathname.slice(6); // 截取 /file/ 后的键
      const kv = await Deno.openKv();
      const res = await kv.get([fileKey]);
      await kv.close();

      if (!res.value) {
        return new Response(JSON.stringify({ error: "文件不存在" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // 解析文件名和 MIME 类型
      const fileName = fileKey.split("-").slice(1).join("-");
      const mimeType = fileName.includes(".") 
        ? new File([res.value], fileName).type 
        : "application/octet-stream";

      // 返回文件
      return new Response(res.value, {
        headers: {
          "Content-Type": mimeType,
          "Content-Disposition": `inline; filename="${fileName}"`,
        },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // 上传表单页面（测试用）
  return new Response(`
    <html>
      <body>
        <form method="POST" action="/upload" enctype="multipart/form-data">
          <input type="file" name="file" />
          <button type="submit">上传文件</button>
        </form>
      </body>
    </html>
  `, { headers: { "Content-Type": "text/html" } });



    return new Response(null, { status: 426 });
}