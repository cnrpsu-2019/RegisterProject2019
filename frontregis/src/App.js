import React, { Component } from "react"
import "bulma/css/bulma.min.css"
import Menu from "./Component/Menu"
import SubjectSearch from "./Component/SubjectSearch"
// import Register from "./Component/Register"
import RegisteredList from "./Component/RegisteredList"
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      renderPage: "search",
      studentName: "Ms.Dook",
      studentFaculty: "Engineering",
      studentCode: "5910110999",
      regisSubject: [],
      allSubject: []
    }
    this.returnRegisPage = this.returnRegisPage.bind(this)
  }

  componentDidMount() {
    console.log("Go to ComponentDidMount")
  }

  returnSubjectSearch = () => {
    this.setState({
      renderPage: "search"
    })
  }

  returnRegisPage = subject => {
    this.setState({
      renderPage: "register",
      regisSubject: subject
    })
    console.log("Return Regis Subject")
    console.log(subject)
  }

  returnRegistered = () => {
    this.setState({
      renderPage: "registered"
    })
  }

  render() {
    if (this.state.renderPage == "search") {
      var elementFrontPage = (
        <SubjectSearch
          student={this.state.studentCode}
          returnRegisPage={this.returnRegisPage}
        />
      )
    } else if (this.state.renderPage == "register") {
      var elementFrontPage = null
    } else if (this.state.renderPage == "registered") {
      var elementFrontPage = <RegisteredList />
    } else {
      var elementFrontPage = null
    }
    return (
      <div className="container">
        <br />
        <h1 className="subtitle is-3">
          ระบบลงทะเบียนเรียน | Subject Registration System
        </h1>
        <hr />
        {/* <div className="columns"> */}
        {/* <div className="column is-3">
            <Menu
              name={this.state.studentName}
              faculty={this.state.studentFaculty}
            />
          </div> */}
        {/* <div className="column is-6"> */}
        <div className="tabs">
          <ul>
            <li
              className={this.state.renderPage == "search" ? "is-active" : ""}
            >
              <a onClick={this.returnSubjectSearch}> ค้นหารายวิชา </a>
            </li>
            <li
              className={
                this.state.renderPage == "registered" ? "is-active" : ""
              }
            >
              <a onClick={this.returnRegistered}> รายวิชาที่ลงไปแล้ว </a>
            </li>
          </ul>
        </div>
        <div id="element">{elementFrontPage}</div>
      </div>
      // </div>
      // </div>
    )
  }
}
export default App
