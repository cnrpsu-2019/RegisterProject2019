//Reserve file

var app = require("express")()
var server = require("http").Server(app)
var io = require("socket.io")(server)
const port = 6060
server.listen(port)

app.get("/", (req, res) => {
  res.send("Hello HTML World")
})

io.on("connection", socket => {
  socket.emit("news", { hello: "world" })
})

io.on("Enroll", () => {})
