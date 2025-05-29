import { useContext } from "react";
import { EregContext } from "../contexts/EregContext";
import CourseCard from "../components/CourseCard";



export default  function Courses() {
  const {usercourses}=useContext(EregContext);
   console.log(usercourses)

return(
    <>
    <div className="m-auto w-[60vw] pt-7 flex flex-col ">
     <h1 className="text-center py-10 md:text-2xl font-bold" >Available courses</h1>
     {usercourses.map((course)=>{
        return <CourseCard  key={course.idcourse} 
         courseName={course.coursename} 
         courseLength={course.courselength}
         courseStart={course.startyear}
         courseEnd={course.endyear}
         courseId={course.idcourse}
         />
     })}
    </div>
    </>
)

  
}