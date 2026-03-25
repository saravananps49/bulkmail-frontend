import axios from "axios";
import { useState } from "react";
// import XLSX from "xlsx" - WRONG
import * as XLSX from "xlsx"

function App() {

  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState(false)
  const [emailList, setEmailList] = useState([])

  function handlemsg(evt) 
  {
    setmsg(evt.target.value)
  }


  function handlefile(event) 
  {
    const file = event.target.files[0]
    console.log(file)

    const reader = new FileReader()

    reader.onload = function(event) 
    {
      const data = event.target.result
      // console.log(data)
      const workbook = XLSX.read(data, { type: 'binary' })
      // console.log(workbook)
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      // console.log(worksheet)
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
      // console.log(emailList)
      const totalemail = emailList.map(function(item)
      {
       return item.A
      }
      )
      console.log(totalemail)
      setEmailList(totalemail)
    }
    reader.readAsBinaryString(file)
  }


  function send() 
  {
    setstatus(true)
    axios.post("https://bulkmail2.vercel.app/sendmail",{msg:msg,emailList:emailList})
      .then(function (data) {
        if (data.data === true) {
          alert("Email sent successfully")
          setstatus(false)
        }
        else {
          alert("Failed")
        }
      }
      )
  }

  return (
    <div>

      {/* <h1>hello</h1> */}

      <div className="bg-blue-950 text-white text-center">
        <h1 className="text-2xl font-medium px-5 py-3">BulkMail</h1>
      </div>

      <div className="bg-blue-800 text-white text-center">
        <h1 className="font-medium px-5 py-3">We help you send multiple email at once</h1>
      </div>

      <div className="bg-blue-600 text-white text-center">
        <h1 className="font-medium px-5 py-3">Drag and Drop</h1>
      </div>

      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">
        <textarea onChange={handlemsg} value={msg} className="w-[80%] h-32 py-2 outline-none px-2 border border-black rounded-md" placeholder="Email list goes here.."></textarea>
      </div>

      <div>
        <input type="file" onChange={handlefile} className="border-4 border-dashed py-4 px-4 mt-5 mb-5" />
      </div>

      {/* <p>Total emails in the file: 0</p> */}
      <p>Total emails in the file: {emailList.length}</p>

      

      {/* <button onClick={send} className="bg-blue-950 py-2 px-2 text-white font-medium rounded-md w-fit">Send</button> */}
      <button onClick={send} className="bg-blue-950 py-2 px-2 text-white font-medium rounded-md w-fit">{status ? "sending.." : "send"}</button>

    </div>
  );
}

export default App;
