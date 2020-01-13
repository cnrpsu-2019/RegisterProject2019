import React, { Component } from "react"
import _ from "lodash"
import Axios from "axios"
let basedURL = "http://localhost:8080/result/"

class RegisteredList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      studentCode: "",
      subject: [],
      regisDisplayTable: null
    }
    this.handleStudentCode = this.handleStudentCode.bind(this)
    this.searchRegisteredList = this.searchRegisteredList.bind(this)
  }

  handleStudentCode = event => {
    this.setState({
      studentCode: event.target.value
    })
    console.log(this.state.studentCode)
  }

  searchRegisteredList = event => {
    this.listRegisteredList()
    event.preventDefault()
  }

  listRegisteredList = () => {
    let url = basedURL + this.state.studentCode
    console.log(url)
    Axios.get(url).then(valueRespond => {
      console.log(valueRespond.data)
      if (valueRespond.data == undefined) {
        this.setState({
          regisDisplayTable: "ยังไม่มีวิชาที่ลงทะเบียนแล้ว"
        })
        return
      }
      let dataTable = this.renderSubject(valueRespond.data)
      this.setState({
        subject: valueRespond.data.SubjectName,
        regisDisplayTable: dataTable
      })
    })
  }

  renderSubject = group => {
    let regisDisplayTable = _.map(group, subjectinfo => {
      return (
        <tr>
          <td>{subjectinfo}</td>
        </tr>
      )
    })
    return regisDisplayTable
  }

  render() {
    return (
      <div>
        <h3 className="subtitle is-4">รายวิชาที่ลงทะเบียนไปแล้ว</h3>
        <div className="columns">
          <div className="column is-6">
            <form onSubmit={this.searchRegisteredList}>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  placeholder="ใส่รหัสนักศึกษาของคุณ"
                  value={this.state.studentCode}
                  onChange={this.handleStudentCode}
                  maxLength="10"
                  minLength="10"
                  required
                  pattern="[0-9]{10}"
                />
                <br />
                <button type="submit" className="button is-primary">
                  ค้นหา
                </button>
              </div>
            </form>
          </div>
        </div>
        <hr />
        <table className="table">
          <thead>
            <tr>
              <th>ชื่อวิชา</th>
            </tr>
          </thead>
          <tbody>{this.state.regisDisplayTable}</tbody>
        </table>
      </div>
    )
  }
}
export default RegisteredList
