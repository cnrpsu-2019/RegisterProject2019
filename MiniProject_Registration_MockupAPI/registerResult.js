var registerResult = [
  {
    StudentID: "5910110150",
    SubjectName: ["PhysicEng", "DataCommunication", "EnterpriseNetwork"]
  },
  {
    StudentID: "5910110573",
    SubjectName: ["NetworkProtocol", "Medical"]
  },
  {
    StudentID: "5910110267",
    SubjectName: ["InternetPrograming", "AdvanceAlgorithm"]
  }
]

exports.findAll = () => {
  return registerResult
}

exports.findRegister = student => {
  for (let i = 0; i < registerResult.length; i++) {
    if (registerResult[i].StudentID == student) {
      return registerResult[i]
    }
  }
}
