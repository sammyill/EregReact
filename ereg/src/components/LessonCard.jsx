import { useState,useContext } from "react";
import Button from "../components/Button";
import FormWrapper from "../components/FormWrapper";
import InputField from "./InputField";
import { fullName } from "../utilities";
import { EregContext } from "../contexts/EregContext";
import { beginDate,endDate } from "./formsdasates";
import { fetchHelper } from "../utilities";

const months=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


const resoultMessage={
    success:{
        classColor:"ml-1 text-green-600 text-center",
        message:"Executed successfully"
    },
    failure:{
        classColor:"ml-1 text-red-600 text-center",
        message:"Error in the execution"
    },
    standard:{
        classColor:"",
        message:""
    }
}

export default function LessonCard({handleRequestDetails,lessonId,lessonStart,lessonModule,lessonEnd,lessonProfFN,lessonProfLN,setCalendarReload}){
  const fullname=fullName(lessonProfFN,lessonProfLN)
  const lstart=new Date(lessonStart);
  const lend=new Date(lessonEnd)
  const day=lstart.getDate();
  const month=months[lstart.getMonth()];
  const shours=lstart.getHours();
  const sminutes=(lstart.getMinutes()===0) ? "00":lend.getMinutes()
  const ehours=lend.getHours();
  const eminutes=(lend.getMinutes()===0) ? "00":lend.getMinutes();
  const a=lend.ge
  const {token,activeCourseId}=useContext(EregContext)
  const [reqStatus,setReqStatus]=useState("standard");
  const [userMode,setUserMode]=useState("standard");

  async function handleDelete(){
    const data = await fetchHelper('DELETE',`/deletelesson/${activeCourseId}/${lessonId}`,token,"");
    console.log(data)
    if(data.error===true) {
    setReqStatus("failure")
    }else {
    setReqStatus("success")
    setCalendarReload((prev)=>!prev)
    }
    setUserMode("standard")
  }

  function handleUserMode(mode){
    setUserMode(mode)
  }

  async function handleSubmit(event){
    event.preventDefault()
    console.log(event.target.beginDate.value)
    console.log(event.target.endDate.value)
    const userrequest={
      begindate:event.target.beginDate.value,
      enddate:event.target.endDate.value,
    } 
    const data = await fetchHelper('PATCH',`/updatelesson/${activeCourseId}/${lessonId}`,token,userrequest);
    console.log(data)
    
    if(data.error===true) {
    setReqStatus("failure")
    }else {
    setReqStatus("success")
    setCalendarReload((prev)=>!prev)
    }
    setUserMode("standard")
  }

  function handleReget(){
    setUserMode("standard")
  }

  if(userMode==="edit"){
    return(
      <div className="w-full basis-full  flex-shrink-0">
      <FormWrapper confirmButton="Update" regetButton="Don't update" handleSubmit={handleSubmit} handleReget={handleReget} beginDate="beginDate" mendDate="endDate" >
      <InputField {...beginDate}/>
      <InputField {...endDate} />
      </FormWrapper>
      </div>
    )
  }

return (

<div className="flex flex-col border border-gray-200 rounded-md overflow-hidden shadow-sm bg-white mb-2 w-48 md:w-64"> <div className="w-full bg-blue-500 text-white flex flex-col items-center justify-center p-3">

    <span className=" md:text-2xl text-sm font-bold">{day}</span> <span className="text-sm font-semibold">{month}</span> </div>
    <div className="w-full px-4 py-3 text-gray-800 text-xs md:text-sm  text-center"> 
      <p className="mb-1">{lessonModule}  </p>
      <p className="mb-1">{fullname} </p>
      <p className="text-gray-600 text-xs md:text-sm">{shours}:{sminutes}-{ehours}:{eminutes} </p>
    </div>
   <div className={resoultMessage[reqStatus].classColor}>{resoultMessage[reqStatus].message}</div>
   {userMode==="delete"&&
    <div className="flex flex-row justify-center">
    <Button styleType="dangerIntegrated" onClick={handleDelete}>Confirm</Button>
    <Button styleType="executeIntegrated" onClick={()=>handleUserMode("standard")}>Reject</Button>
   </div>}
   {userMode==="standard" &&
    <div className="flex flex-row justify-center">
    <Button styleType="standardIntegrated" onClick={handleRequestDetails}>Details</Button>
    <Button styleType="standardIntegrated" onClick={()=>handleUserMode("edit")}>Edit</Button>
    <Button styleType="dangerIntegrated" onClick={()=>handleUserMode("delete")}>Delete</Button>
   </div>}
   
    
   
   

</div>

)}