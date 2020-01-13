import React, { Component } from "react"
import _ from "lodash"
import Axios from "axios"
import Register from "./Register"
let baseUrl = "http://172.30.80.26:8080/"

//Note On Function RenderObject
// Phase Number to set Button Add or Remove Subject
// 1 Be ADD 2 Be Remove
class SubjectSearch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subject: [],
      registerSubject: [],
      searchFaculty: "",
      displayTable: null,
      displayPreregisTable: null,
      enableRegisterProcess: false,
      registerResult: null,
      studentCode: ""
    }
    this.activeFacultySearch = this.activeFacultySearch.bind(this)
    this.onSubmitSearchForm = this.onSubmitSearchForm.bind(this)
    this.typingChange = this.typingChange.bind(this)
    this.register = this.register.bind(this)
  }

  onSubmitSearchForm = event => {
    let url = baseUrl
    url = baseUrl + this.state.searchFaculty
    console.log("On Submit")
    console.log(this.state.searchFaculty)
    Axios.get(url).then(valueRespond => {
      this.setState({ subject: valueRespond.data })
    })
    let table = this.renderSubject(this.state.subject, 1)
    event.preventDefault()
    this.setState({
      displayTable: table
    })
  }

  // Phase Number to set Button Add or Remove Subject
  // 1 Be ADD 2 Be Remove
  renderSubject = (group, phase) => {
    let sortGroup = _.sortBy(group, "SubjectID")
    // console.log(sortGroup)
    let displayTable = _.map(sortGroup, subjectinfo => {
      return (
        <tr>
          <td>{subjectinfo.SubjectID}</td>
          <td>{subjectinfo.SubjectName}</td>
          <td>{subjectinfo.Enrolled}</td>
          <td>{subjectinfo.Capacity}</td>
          <td>
            <button
              className={phase == 1 ? "button is-primary" : "button is-danger"}
              onClick={() => this.addOrRemoveForRegister(subjectinfo, phase)}
            >
              {phase == 1 ? "เพิ่ม" : "ลบ"}
            </button>
          </td>
        </tr>
      )
    })
    return displayTable
  }

  addOrRemoveForRegister = (subject, phase) => {
    //phase 1 is add , phase 2 is remove
    console.log("Add or Remove For Register call")
    let newRegisSubject = this.state.registerSubject
    if (phase == 1) {
      var addAble = true
      for (var i = 0; i < this.state.registerSubject.length; i++) {
        if (this.state.registerSubject[i].SubjectID == subject.SubjectID) {
          window.alert("คุณได้ลงวิชานี้ไปแล้ว")
          addAble = false
        }
      }
      if (addAble == true) {
        newRegisSubject.push(subject)
      }
    }
    if (phase == 2) {
      newRegisSubject.pop(subject)
    }
    this.setState({
      registerSubject: newRegisSubject
    })
    console.log(this.state.registerSubject)
    let table = this.renderSubject(this.state.registerSubject, 2)
    this.setState({
      displayPreregisTable: table
    })
  }

  activeFacultySearch = event => {
    console.log(event.target.value)
    this.setState({
      searchFaculty: event.target.value,
      enableSubjectSearch: true
    })
    console.log(this.state.searchFaculty)
  }

  register = event => {
    console.log("Register Function Call")
    console.log(this.state.studentCode)
    var student = this.state.studentCode
    var subject = this.state.registerSubject
    var registerResult
    registerResult = <Register student={student} subject={subject} />
    this.setState({
      enableRegisterProcess: true,
      registerResult: registerResult
    })
    event.preventDefault()
  }

  typingChange = event => {
    this.setState({
      studentCode: event.target.value
    })
    console.log(this.state.studentCode)
  }

  render() {
    return (
      <div>
        {this.state.enableRegisterProcess == true
          ? this.state.registerResult
          : ""}
        <div className="columns">
          <div className="column is-6">
            <form onSubmit={this.onSubmitSearchForm}>
              <div className="control">
                <label className="label">เลือกคณะ</label>
                <div className="select">
                  <select
                    value={this.state.searchFaculty}
                    onChange={this.activeFacultySearch}
                  >
                    <option value="">เลือกคณะที่ต้องการ</option>
                    <option value="MedicineSubject">MedicineSubject</option>
                    <option value="EngineerSubject">EngineerSubject</option>
                    <option value="ScienceSubject">ScienceSubject</option>
                    <option value="LiberalArtsSubject">
                      LiberalArtsSubject
                    </option>
                    <option value="PharmacySubject">PharmacySubject</option>
                    <option value="PharmaceuticalSubject">
                      PharmaceuticalSubject
                    </option>
                  </select>
                </div>
                <button type="submit" className="button is-primary">
                  ค้นหา
                </button>
              </div>
            </form>
          </div>

          <div className="columns">
            <div className="column">
              <p>จำนวนการลงทะเบียน</p>
              <h5 className="subtitle is-3">
                {this.state.registerSubject.length} วิชา
              </h5>
            </div>
            <div className="column">
              <form onSubmit={this.register}>
                <p>ส่งฟอร์มการลงทะเบียน</p>
                <div className="control">
                  <label className="label">ใส่รหัสนักศีกษา</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Enter Student Code"
                    maxLength="10"
                    minLength="10"
                    required
                    pattern="[0-9]{10}"
                    value={this.state.studentCode}
                    onChange={this.typingChange}
                  ></input>
                </div>
                <br />

                <button type="submit" className="button is-primary">
                  ลงทะเบียน
                </button>
              </form>
            </div>
          </div>
          <hr />
        </div>
        <div className="columns">
          <div className="column is-6">
            <h4 className="title is-5 ">รายวิชาที่ค้นหาได้</h4>
            <table className="table">
              <thead>
                <tr>
                  <th>รหัสวิชา</th>
                  <th>ชื่อวิชา</th>
                  <th>ลงแล้ว</th>
                  <th>จาก</th>
                  <th>เพิ่ม</th>
                </tr>
              </thead>
              <tbody>{this.state.displayTable}</tbody>
            </table>
          </div>
          <div className="column is-6">
            <h4 className="title is-5 ">รายวิชาที่อยู่ใน List การลงทะเบียน</h4>
            <p>การลบนั้นสามารถลบได้โดยเริ่มจากวิชาที่เพิ่มล่าสุดเท่านั้น</p>
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th>รหัสวิชา</th>
                    <th>ชื่อวิชา</th>
                    <th>ลงแล้ว</th>
                    <th>จาก</th>
                    <th>ลบ</th>
                  </tr>
                </thead>
                <tbody>{this.state.displayPreregisTable}</tbody>
              </table>
            </div>
          </div>
        </div>

        <hr />
      </div>
    )
  }
}
export default SubjectSearch
