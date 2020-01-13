import React, { Component } from "react"
import _ from "lodash"
import Axios from "axios"
import io from "socket.io-client"
const expressIP = "172.30.80.26"
var baseUrl = "http://" + expressIP + ":8080/register"
let url = "http://" + expressIP + ":8080/" //socketIOURL

class Register extends Component {
  constructor(props) {
    super(props)
    let subject = this.props.subject
    console.log(subject)
    let subjectCode = []
    subject.forEach(sub => {
      subjectCode.push(sub.SubjectID)
    })
    //result Fail = false, Success = true
    this.state = {
      student: this.props.student,
      subjectCode: subjectCode,
      result: false,
      socket: "",
      serverEventResult: null
    }
  }
  componentDidMount() {
    //Post
    console.log("Subject Code Array")
    console.log(this.state.subjectCode)
    let registerRequest = {
      StudentID: this.state.student,
      SubjectToEnroll: this.state.subjectCode
    }
    console.log(registerRequest)
    let registerRequestJSON = JSON.stringify(registerRequest)
    let socket
    console.log(registerRequestJSON)
    console.log("String Parse")
    console.log(JSON.parse(registerRequestJSON))
    Axios.post(baseUrl, JSON.parse(registerRequestJSON))
      .then(response => {
        console.log(response)
        if (response.data.Success == true) {
          window.alert("Request ของคุณกำลังส่งมายังคิวเพื่อประมวลผลแล้ว")
        } else if (response.data.Success == false) {
          window.alert(
            "คุณมี Request ก่อนหน้านี้แล้ว กรุณารอผลตอบรับจาก Request ก่อนหน้า แล้วจึงสามารถส่ง Request ใหม่ได้"
          )
        }
      })
      .catch(error => {
        console.log("Socket IO Client Error")
        console.log(error)
      })
      .finally(() => {})

    this.setState({ result: true })
  }

  socketReturn = () => {
    if (this.state.result == true) {
      console.log(url)
      console.log("Initial SocketIO Client")
      console.log("Student Code" + this.state.student)
      let socket = io.connect(url, {
        query: "StudentID=" + this.state.student
      })
      socket.on("RegisterIO", data => {
        console.log("Socket Initial Success")
        console.log(data)
        this.setState({
          serverEventResult: data
        })
        if (data == "true") {
          window.alert("ยินดีด้วย คุณลงทะเบียนสำเร็จ ")
        } else {
          window.alert("เสียใจด้วย คุณลงทะเบียนไม่สำเร็จ ")
        }
      })
      socket.on("disconnect", () => {
        socket.disconnect()
      })
    }
  }

  render() {
    this.socketReturn()
    return (
      <div>
        <h3 className="title is-4">เริ่มเข้าสู่การลงทะเบียน</h3>
        <p>รหัสนักศึกษา {this.state.student} </p>
        {this.state.serverEventResult !== null
          ? "การลงทะเบียนจบแล้ว"
          : "กรุณารอสักครู่"}
        <hr />
      </div>
    )
  }
}
export default Register
