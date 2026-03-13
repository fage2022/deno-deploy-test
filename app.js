import cron from "./cron.js";
import http from "./http.js";
import ws from "./ws.js";
cron();

Deno.serve(async(req) => {
    if (req.headers.get("upgrade") != "websocket") {
      return await http(req);
    }
    return ws(req);
});
