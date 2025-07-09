import { useEffect,useState,useContext } from "react";
import { fetchHelper,fullName,formatTimeFromDate,isFutureDate,formatFullDateTime } from "../utilities";
import { EregContext } from "../contexts/EregContext";
const todayDate=new Date();

export default function LessonPage  ({ courseID,lessonId, onGoBack }) {
  const [reloadData,setRealoadData]=useState(false)
  const [lessonDetails,setlessonDetails]=useState(null);
  const [students,setStudents]=useState(null);
  const {token,user}=useContext(EregContext)
  const{iduser}=user
  let isOwner=(iduser===lessonDetails?.idowner)||false;
//console.log("boolean",lessonDetails.idowner===iduser)
  //console.log("props:", courseID,lessonId, onGoBack )
  useEffect(()=>{
  async function fetchData() {
      const data = await fetchHelper('GET',`/getalesson/${courseID}/${lessonId}`,token,"none");
      console.log(data)
      setlessonDetails(data.lessondetails);
      setStudents(data.students)
      isOwner=iduser===data.lessondetails.idowner
    }
    fetchData();
  },[reloadData])
  function handleNotes(e){
    //aggiungere fetch che aggiorna le note
    setlessonDetails((prev)=>{
      return{
        ...prev,
      notes:e.target.value
      }
    })


  }

  function handleExit(idStudent){
    async function fetchData() {
      const data = await fetchHelper('PATCH',`/studenleave/${courseID}/${lessonId}/${idStudent}`,token,{});
      console.log(data)
      setRealoadData((prev)=>!prev)
    }
    fetchData();
  }

  function handleEnter(idStudent){
    async function fetchData() {
      const data = await fetchHelper('POST',`/studentattend/${courseID}/${lessonId}/${idStudent}`,token,{});
      console.log(data)
      setRealoadData((prev)=>!prev)
    }
    fetchData();
    
  }
  if(!lessonDetails ) return(<p className="h-[500px]">Error,Contact your coordinator or an admin</p>)
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Lesson Description */}
      <div className="bg-white rounded-2xl shadow p-4 space-y-2 text-center">
        <h2 className=" md:text-2xl text-base font-semibold text-gray-800">{lessonDetails.modulename}</h2>
        <h3 className=" md:text-xl text-base font-semibold text-gray-800">{fullName(lessonDetails.firstname,lessonDetails.lastname)}</h3>
        <div className="text-gray-600 text-sm md:text-base">
          <p>Begin: <span className="font-medium">{formatFullDateTime(lessonDetails.begindate)}</span></p>
          <p>End: <span className="font-medium">{formatFullDateTime(lessonDetails.enddate)}</span></p>
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col justify-center items-center">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="lesson-note">Notes</label>
        {isOwner &&    <textarea
          id="lesson-note"
          rows="4"
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Write lesson notes here..."
          value={lessonDetails.notes || ""}
          onChange={(e)=>handleNotes(e)}
        ></textarea> }
        {isOwner &&   <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mt-1 disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={()=>handleNotes(e)}
          disabled={!isOwner}>Update</button>}
        {!isOwner && <p>{lessonDetails.notes || ""}</p>}
    
     
      </div  >

      {/* Student List */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Students</h3>
        <ul className="space-y-3">
          {students.map((student, index) => (
            <li key={index} className="flex items-center justify-between p-3 border rounded-xl">
              <span className="text-gray-800">{fullName(student.firstname,student.lastname)}</span>
              <div className="space-x-2">     
                {student.entry_hour?
                `Entrance:${formatTimeFromDate(student.entry_hour)}  `:
                isFutureDate(lessonDetails.enddate) ? 
                  <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed" 
                  onClick={()=>handleEnter(student.iduser)} 
                  disabled={!isOwner ||isFutureDate(lessonDetails.begindate)}>Enter</button>:"Assente  "
                 }
                {student.exit_hour?
                `Leave:${formatTimeFromDate(student.exit_hour)}  `:
                isFutureDate(lessonDetails.enddate) ? 
                  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed" 
                  onClick={()=>handleEnter(student.iduser)} 
                  disabled={!isOwner ||isFutureDate(lessonDetails.begindate) }>Exit</button>:"Assente  "
                 }           
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Back Button */}
      <div className="flex items-center justify-center">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
          onClick={onGoBack}
        >
          Go back to calendar
        </button>
      </div>
    </div>
  );
  
};

