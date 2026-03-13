export default function main(req){
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
}