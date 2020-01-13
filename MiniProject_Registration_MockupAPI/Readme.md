# Registration Mock API

## Important

- ก่อนเริ่มทำงาน `npm install`
- เปิดระบบทั้งสองอันก่อนเพื่อให้ระบบทำงานได้
- Open Main Express Program `npm start`
- Open Pulling Queue System `npm run outqueue`

## Problem Today

- การทำงานทุกอย่างถูกต้อง ยกเว้น Socket.io ที่ไม่เป็นไปตามคาด คือ มันยังส่งตามคิวถูกต้อง แต่ทุกอย่างจะไป Response รวมกันที่ Session ล่าสุดเท่านั้น

## Port

- Main Program Input (Express) => `8080`
- Zero MQ Server Handout => `8090`
- Zero MQ Server Handin => `3090`
- Front Page (React) => `3000`

## Demo Program

- Visit this API on http://dev.theduckcreator.in.th:8080 can use API Client like curl , Postman or Browser Call

## Program Specification

- Program Run at Port8080 using command `npm start`
- `/subject` to request all subject
- `/subject/subjectCode` to request subject per code

## Method that want integration

- Need to Make Server Connect to MongoDB Database and Frost Infrastructure
- This is the mockup api that use for mock up the User Interface

## Mockup Source Code

```
app.get("/test/", (req, res) => {
  //Demo
  let mockdata1 = {
    StudentID: "5910110150",
    SubjectSuccessEnroll: true
  }
  let mockdata2 = {
    StudentID: "5910110267",
    SubjectSuccessEnroll: false
  }
  res.send("Set Time Out will Begin Shortly")
  console.log("setTimeout Function Waiting")
  console.log(sessionIO)
  setTimeout(() => {
    connectToSocketIO(mockdata1)
  }, 5000)
  setTimeout(() => {
    connectToSocketIO(mockdata2)
  }, 10000)
})
```
