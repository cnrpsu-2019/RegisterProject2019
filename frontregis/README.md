# Registration Frontend

เป็น Single Page App เขียนด้วย React, Javascript โดยมี App.js เป็นตัวหลัก และเชื่อมโยง Component จากโฟลเดอร์ Component โดยเมนูทุกอย่าง จะอยู่ในไฟล์ App.js ทั้งหมด เนื่องจากตอนนั้นยังทำการ Handle Component จาก Children มายัง Parent ไม่เป็น Stack/Dependencies ทั้งหมดในส่วนนี้

- React
- Axios
- Lodash
- Socket.io Client
- Bulma (CSS)

ทดลองรัน Frontend ได้ แต่อาจจะ เชื่อมต่อ Server ทั้งหมดไม่ได้

    npm install
    npm start

## Interface

![ภาพตัวอย่างหน้าตาแอพพลิเคชั่น](Frontend.png)
การทำงานคือ ผู้ใช้จะเข้าไปเลือกคณะ หรือ กลุ่มวิชาที่ต้องการ จากนั้นรายวิชาจะขึ้นมาในวิชาที่ค้นหาได้ ผู้ใช้งานทำการเพิ่ม หรือ ลดวิชาจาก List ในการลงทะเบียน ระบบจำนับจำนวนวิชา เมื่อผู้ใช้ต้องการจะส่งแบบฟอร์มการลงทะเบียน ผู้ใช้จะใส่รหัสนักศึกษา และกดลงทะเบียน

## Searching

การค้นหาอยู่ในไฟล์ `SubjectSearch.js` [SubjectSearch.js](Component/SubjectSearch.js) ซึ่งในส่วนของฟอร์ม จะใช้หลักการใส่ Atrribute `onChange={}` เพื่อเรียกค่าของฟอร์มไปเปลี่ยนค่าของ State ในทุกครั้งที่พิมพ์ ตามหลักของ React และจากนั้นโดยเมื่อฟอร์มส่งไปแล้ว(onSubmit) จะไปนำข้อมูลมาจาก REST API Server ผ่านฟังก์ชัน `onSubmitSearcjFrom`

### ฟังก์ชัน onSubmitSearchForm

มีตัวแปล `baseURL` ไว้สำหรับเก็บ URL เบื้องตันของของ Server จากนั้นจะส่ง `GET` Request โดยนำชื่อคณะที่จะ Search หาวิชา มาต่อท้าย ดัง ก่อนที่จะใช้ Axios เป็นตัวยิง GET Request แล้วนำผลที่ได้จาก request มา `setState` ดังนี้

    let url = baseUrl + this.state.searchFaculty

    Axios.get(url).then(valueRespond => {
        this.setState({ subject: valueRespond.data })
    })

นอกจากนั้น ในฟังก์ชันนี้ จะมีการส่งข้อมูลไป Render ตารางรายวิชา โดยใช้ฟังก์ชัน `renderSubject()` ก่อนจะมาเปลี่ยน state ของ table

     let table = this.renderSubject(this.state.subject, 1)

### ฟังก์ชัน renderSubject()

มีพารามิเตอร์ 2 ตัวคือ State กับ Phase State คือข้อมูลของตาราง ส่วน Phase คือ ตัวเลขที่ใช้กำกับกระบวนการ โดย 1 แทนการเพิ่ม (default) ส่วน 2 จะแทนการลบ (ตอนนั้นไม่เข้าใจเหมือนกันว่าทำไมไม่ใช้ Boolean) นำมาเรียงตาม Subject ID และ นำมา Map ลงไปที่ Table

    renderSubject = (group, phase) => {
        let sortGroup = _.sortBy(group, "SubjectID")

        let displayTable = _.map(sortGroup, subjectinfo => {
            return(<table>
            ...
            </table>)
        }

ในส่วนของ HTML Element ในฟังก์ชันนี้ จะมีปุ่ม โดยปุ่มจะเปลี่ยนเพิ่ม / ลบ โดยอัตโนมัติ

        <button className={phase == 1 ? "button is-primary" : "button is-danger"}
            onClick={() => this.addOrRemoveForRegister(subjectinfo, phase)}>
            {phase == 1 ? "เพิ่ม" : "ลบ"}
        </button>

แล้วนำค่าไปเข้าฟังก์ชั่น `addOrRemoveForRegister()` ซึ่งมีการส่ง Phase ไปเช่นกัน

### ฟังก์ชัน addOrRemoveForRegister

เนื่องจากกำหนดค่า Phase เอาไว้ว่า Phase 1 คือ เพิ่ม Phase 2 คือ ลบ (ซึ่งจริง ๆ ไม่ใช่วิธีเขียนโปรแกรมที่ดี) แดังนั้น เราจะเริ่มต้นที่เช็คก่อนว่า ในการ เรียกใช้ฟังก์ชันนี้เรียกเพื่อบวก หรือ ลบ

มีการกำหนด `addAble` เป็น boolean ที่มาจากการค้นหา และ เปรียบเทียบว่าวิชาที่ผู้ใช้กำลังจะเพิ่มเป็นวิชาที่ลงไปแล้วหรือไม่ถ้าหากไม่ได้ซ้ำกับที่ลงไปแล้ว ก็จะ push ลงไปใน Stack ของ `newRegisSubject` ในส่วนของฟังก์ชันนี้ไม่ได้มีการเช็คว่า ลงทะเบียนที่ Server ได้ไม่ได้ แต่อย่างไร

### ฟังก์ชัน register()

เป็นการเก็บค่าจาก Stage ที่เปลี่ยนขณะ `typingChange` และขณะ `addOrRemoveForRegister` มาใส่ไว้ในตัวแปร และส่งออกไปที่ Component Register ตาม Prototype

    <Register student={student} subject={subject} />

## Register

จะอยู่ในไฟล์ `src/Register.js` จะมี UI เล็ก ๆ น้อย ๆ เพื่อแจ้งผู้ใช้ว่า อยู่ในสถานะการลงทะเบียน หรือ ลงทะเบียนเสร็จแล้ว(ทั้งสำเร็จ และ ไม่สำเร็จ) ด้วยส่วนสำคัญของส่วนนี้คือ

1. การ POST ข้อมูลการลงทะเบียนไปที่ Server
2. การเปิด Socket ของ Socket.IO เอาไว้ เพื่อรองรับ Server Event ที่จะ Return กลับมาจาก Server เมื่อมีการลงทะเบียนผ่านพ้นแล้ว

จะมี URL สองตัวที่จะใช้ คือ URL(IP Address) ของ Express Server ในส่วนที่จะ Server เปิดรับ POST Request ไว้ อยู่ใน `http://expressIP:8080/register` และส่วนที่เป็น URL เฉย ๆ เพื่อรับ Socket IO Event

> ในส่วนนี้อันที่จริง ควรจะเก็บ Config ไฟล์ไว้ในไฟล์อื่น เช่นไฟล์ .env และใช้ getenv เข้ามา จะทำให้แก้ไขได้ง่ายกว่าในภายหลัง

### การส่งข้อมูล POST Request ไปยัง Server

อยู่ใน `componentDidMount()` จะใช้นำ `registerRequest` ผ่านการ stringify เป็น JSON และส่ง POST Request ด้วย Axios ไปที่ URL ที่ตั้งไว้รับ POST Request ทำเพียงเท่านี้ จากนั้นกระบวนการต่าง ๆ จะเป็นการคุยกันของฝั่ง Server

อย่างไรก็ดี มีการ Exception Handler ให้มีการแสดงผลการส่งไปยัง alert box ของ browser

### การรับข้อมูล Server Event จาก Socket IO

เมื่อทางฝั่ง Server ทำการประมวลผลเสร็จเรียบร้อยแล้ว จะเอาข้อมูลส่งกลับมาด้วยวิธี Server Event ผ่าน Library Socket IO หน้าที่ของฝั่ง Frontend คือ เมื่อทำการส่งข้อมูลไปแล้ว ก็ทำการเปิด Socket IO Client รอเอาไว้

Socket IO Client จะต่อไปยัง url `http://expressIP:8080` โดยมี Query เป็น Student ID โดยทำการเปิด Socket ด้วยการกำหนดค่า Socket เป็น

     let socket = io.connect(url, {
        query: "StudentID=" + this.state.student
      })

และทำการ Listen ไปที่ Socket เมื่อเกิด `RegisterIO` จะรับข้อมูลกลับมาเป็น `string` ที่มีข้อความว่า true หรือ false โดยใช้ฟังก์ชัน

    socket.on("RegisterIO",data=>{
        if(data == "true")
            // Do Something
        else
             // Do Another thing
    })

หลังจากนั้น สั่งการ disconnect โดยบอกว่าเมื่อเกิด `disconnect` ให้ Socket ทำคำสั่ง `disconnect`

         socket.on("disconnect", () => {
        socket.disconnect()
      })
