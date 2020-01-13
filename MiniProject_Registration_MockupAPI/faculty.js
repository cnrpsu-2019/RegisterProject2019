var faculty = [
  {
    id: 1,
    facultyName: "engineering",
    subject: [
      {
        id: 1,
        SubjectID: "240461",
        SubjectName: "Enterprise Network Managment",
        Enrolled: 2,
        Capacity: 30
      },
      {
        id: 2,
        SubjectID: "240460",
        SubjectName: "Internet Programing",
        Enrolled: 3,
        Capacity: 30
      }
    ]
  },
  {
    id: 2,
    facultyName: "science",
    subject: [
      {
        id: 1,
        SubjectID: "332104",
        SubjectName: "General Physic II",
        Enrolled: 45,
        Capacity: 50
      }
    ]
  }
]

exports.findAll = () => {
  return faculty
}

exports.findByFaculty = thisFaculty => {
  for (var i = 0; i < faculty.length; i++) {
    if (faculty[i].facultyName == thisFaculty) return faculty[i]
  }
}
exports.findBySubject = (thisFaculty, subject) => {
  for (var i = 0; i < faculty.length; i++) {
    if (faculty[i].facultyName == thisFaculty) {
      for (var j = 0; j < faculty[i].subject.length; j++) {
        if (faculty[i].subject[j].subjectCode == subject) return subject[j]
      }
    }
  }
}
