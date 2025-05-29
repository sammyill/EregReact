import Button from "../components/Button";
import { useContext } from "react";
import { EregContext } from "../contexts/EregContext";
import { useNavigate } from "react-router-dom";


export default function CourseCard({courseName,courseLength,courseStart,courseEnd,courseId}){
    const{setActiveCourse}=useContext(EregContext);
    const navigate=useNavigate()
    
    function handleCourseChange(courseId){
      console.log(`è stata chiamata ed ha settato ${courseId}`)
      setActiveCourse(courseId)
      navigate("/")
    }
    return (
    <div className="flex flex-col justify-center align-middle border border-gray-200 rounded-md overflow-hidden shadow-sm bg-white mb-2 w-[60vw]">
        <div className="w-full bg-blue-500 text-white flex flex-row  justify-center align-middle p-3">
        <span className=" md:text-2xl text-sm font-bold text-center">{courseName}</span>
        </div>
         <div className="w-full px-4 py-3 text-gray-800 text-xs md:text-sm  text-center font-bold"> 
          <p className="mb-1">Durata{courseLength} ,Dal {courseStart} al {courseEnd} </p>
        </div>
        <Button styleType="standardIntegrated" onClick={()=>handleCourseChange(courseId)}>seleziona</Button>
    </div>
  
    )
}