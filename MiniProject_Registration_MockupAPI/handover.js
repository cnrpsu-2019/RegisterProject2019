const EventEmitter = require("events")
// FOR PROCESSED QUEUE

const pusherEventLoop = new EventEmitter()

const zmq = require("zeromq")
var zmqPushSock = new zmq.Push()

//Mockup data the real data will provide by frost
let mockdata = {
  StudentID: "5910110267",
  SubjectSuccessEnroll: false
}

//Mockdata Show AS dataObj
pusherEventLoop.on("push", dataObj => {
  zmqPushSock.send(JSON.stringify(dataObj)).then(() => {
    console.log("Successful Push in to outQueue/ Processed Queue")
    console.log(dataObj)
    console.log(JSON.stringify(dataObj))
  })
})

zmqPushSock.bind("tcp://127.0.0.1:3090").then(() => {
  pusherEventLoop.emit("push", mockdata)
})
