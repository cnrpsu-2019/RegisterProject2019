// DEMO THE REAL ONE WILL MAKE BY FROST
const zmq = require("zeromq")
var zmqPullSock = new zmq.Pull()

async function pulling() {
  zmqPullSock.connect("tcp://127.0.0.1:8090")
  console.log("Worker is ready")

  while (true) {
    try {
      const [mgs] = await zmqPullSock.receive()
      let mgsInString = mgs.toString()
      console.log(mgsInString)
      let mgsInObject = JSON.parse(mgsInString)
      console.log(mgsInObject)
    } catch (err) {
      console.error(err)
    }
  }
}

pulling()
