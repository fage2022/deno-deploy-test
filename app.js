import cron from "./cron.js";
import http from "./http.js";
import ws from "./ws.js";
cron();

Deno.serve((req) => {
    if (req.headers.get("upgrade") != "websocket") {
      return http(req);
    }
    ws(req)
    return response;
});
