/**
 * 8080 if for Express server
 * 8090 is for Unprocessed Queue Zero MQ
 * 3090 is for Processed Queue ZeroMQ
 * 3030 is for Socket IO
 *  */

/**-------Express Dependencies----------- */

var app = require("express")()
var port = 8080
var faculty = require("./faculty")
var bodyParser = require("body-parser")
const EventEmitter = require("events")
//New Added 6/12/2019 9.59 PM
var result = require("./registerResult")
const pusherEventLoop = new EventEmitter()

/**---------ZeroMQ Dependencies ---------------- */

const zmq = require("zeromq")
var zmqPushSock = new zmq.Push()
var zmqPullSock = new zmq.Pull()
zmqPushSock.bind("tcp://127.0.0.1:8090")
pulling()

/**-------Socket.io Dependencies-------------- */

var io = require("socket.io")(3030)
var sessionIO = { 0000000: "55555 " }

/**---------Function------------------ */

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Methods",
    "POST,GET,PUT,PATCH,DELETE,OPTIONS"
  )
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Option,Authorization"
  )
  next()
})
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

/**-----Data Fetching-------- */
app.get("/", (req, res) => {
  res.send("Welcome to API Server")
})

app.get("/all/", (req, res) => {
  console.log("User Request All Subject")
  res.json(faculty.findAll())
})

app.get("/:faculty", (req, res) => {
  var thisFaculty = req.params.faculty
  res.json(faculty.findByFaculty(thisFaculty))
})

//New Added 6/12/2019 9.57 PM
app.get("/result/", (req, res) => {
  console.log("Get Result Has Called")
  res.json(result.findAll())
})

app.get("/result/:student", (req, res) => {
  var thisStudent = req.params.student
  res.json(result.findRegister(thisStudent))
})

app.get("/:faculty/:subject", (req, res) => {
  var thisFaculty = req.params.faculty
  var subject = req.params.subject
  res.json(faculty.findBySubject(thisFaculty, subject))
})

/**--------------Registration---------------- */
app.post("/register/", (req, res) => {
  let input = req.body
  console.log("post request has arrive at the server")
  res.send("Register " + input.StudentID + "is come to process")
  console.log("User Want to Enroll " + input.SubjectToEnroll.length)
  console.log(input.SubjectToEnroll)

  //Push to Message Queue
  pusherEventLoop.emit("push", input.StudentID, input.SubjectToEnroll)

  io.on("connection", socket => {
    console.log("-----------------------------")
    console.log("Socket IO Server Start Create Session")
    console.log("From Process " + input.StudentID)
    console.log("process ID " + socket.id)

    sessionIO[input.StudentID] = socket
    socket.join(input.StudentID)

    console.log("Create in Array" + sessionIO[input.StudentID])
    console.log("-------------------------------------")
    socket.on("disconnect", () => {
      console.log("Socket" + input.StudentID + " is close")
    })
  })

  res.end()
})

/**----------Unprocessed Queue Manaing----------*/
pusherEventLoop.on("push", (student, subject) => {
  let dataObj = {
    StudentID: student,
    SubjectToEnroll: subject
  }
  zmqPushSock
    .send(JSON.stringify(dataObj))
    .catch(err => {
      console.error(err)
    })
    .then(() => {
      console.log("send to zmq complete")
    })
  console.log("Push To Unprocessed Queue is ready")
  console.log(dataObj)
})

/**-------Processed Queue Managing--------------*/
async function pulling() {
  zmqPullSock.connect("tcp://127.0.0.1:3090")
  console.log("Worker is ready")
  while (true) {
    try {
      const [mgs] = await zmqPullSock.receive()
      let mgsInString = mgs.toString()
      console.log(mgsInString)
      let mgsInObject = JSON.parse(mgsInString)
      console.log(mgsInObject)

      //Handling Out To Socket.io
      if (mgsInObject != null) {
        connectToSocketIO(mgsInObject)
      }
    } catch (err) {
      console.error(err)
    }
  }
}

/**--------Socket IO ----------*/
function connectToSocketIO(result) {
  if (sessionIO[result.StudentID] != null) {
    console.log("----------------------------------------------------")
    console.log("Attempt in Socket IO Connection ")
    console.log("SocketIO 1")
    console.log("Student ID" + result.StudentID)
    console.log("Session ID" + sessionIO[result.StudentID].id)
    sessionIO[result.StudentID].emit("RegisterIO", result)
    console.log("Success Sending")
    // sessionIO[result.StudentID].disconnect()
    // delete sessionIO[result.StudentID]
  }
}

/**-------Port Listening------- */
app.listen(port, () => {
  console.log("App is run at port " + port)
})
