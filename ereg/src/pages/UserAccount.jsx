import UserBasicInfoCard from "../components/UserBasicInfoCard";
import Button from "../components/Button";
import { useState,useContext,useEffect } from "react";
import { EregContext } from "../contexts/EregContext";
import { fetchHelper } from "../utilities";
import { useNavigate } from "react-router-dom";


export default function UserAccount()  {
  const [userData,setUserData]=useState(null);
  const [isLoading,setIsLoading]=useState(false)
  const {activeCourseId,token,user,activeCourseRole}=useContext(EregContext)
  const navigate = useNavigate();
  let role="unknow";
  if(activeCourseRole===parseInt(1) ) role="Student";
  if(activeCourseRole===parseInt(2) ) role="Professor";
  if(activeCourseRole===parseInt(3) ) role="Coordinator";

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const data = await fetchHelper('GET',`/getuser/${activeCourseId}/${user.iduser}`,token,"none");
      if(data?.error===true){
         return
      }
      //console.log(data)
      setUserData(data);
      setIsLoading(false)
    }

    fetchData();
  }, []);

function handleGoBack(){
 navigate("/")
}

if(isLoading){
  return(
     <div className="m-auto w-[60vw] text-4xl h-[100vh]">Unable to Load data,plese reload the page</div>
  )
}


if(userData){
return (
<div className="p-4 space-y-4 max-w-3xl mx-auto">

  <UserBasicInfoCard 
  userData={userData}
  role={role} 
  firstname={userData.userdata.firstname}  
  lastname={userData.userdata.lastname}
  email={userData.userdata.email}
  phone={userData.userdata.phone}
  age={userData.userdata.email}
  imgurl={userData.userdata.imgurl || "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/800px-Grosser_Panda.JPG" }
  selectedUserID={user.iduser}
  />

  {userData.associateCourses.length > 0 && (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center mb-4">
      <span className="mr-2">&#127891;</span>
      <h2 className="text-xl font-bold">Associated Courses</h2>
    </div>
    <ul className="list-disc list-inside space-y-1">
      {userData.associateCourses.map((course) => (
      <li key={course.courseid}>
        <strong>{course.rolename}</strong> – {course.coursename} ({course.startyear}–{course.endyear})
      </li>
      ))}
    </ul>
  </div>
  )}
   
  {userData.teachedModules.length > 0 && (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center mb-4">
      <span className="mr-2">&#128218;</span>
      <h2 className="text-xl font-bold">Teached Modules</h2>
    </div>
    <ul className="list-disc list-inside space-y-1">
      {userData.teachedModules.map((module) => (
      <li key={module.moduleid}>
        <strong>{module.modulename}</strong> – {module.coursename} ({module.startyear}–{module.endyear})
      </li>
      ))}
    </ul>
  </div>
  )}

 {userData.studentAttendance.length > 0 && (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center mb-4">
      <span className="mr-2">&#128202;</span>
      <h2 className="text-xl font-bold">Attendance</h2>
    </div>
    <ul className="list-disc list-inside space-y-1">
      {userData.studentAttendance.map((modatt, idx) =>{ 
      const hours=(modatt.comulatedattendance!==null) ? Math.round(modatt.comulatedattendance/3600)  :"N/A";
      return (
      <li key={modatt.moduleid}>
        <strong>{modatt.modulename}</strong> – Attended {hours}  of {modatt.modulelength} total hourse 
      </li>
      )
      })}
    </ul>
  </div>)}
  <div className="flex flex-row justify-center"><Button styleType="standard" onClick={handleGoBack} >Go back</Button></div>

</div>
);}else{
   return(
     <div className="m-auto w-[60vw] text-4xl h-[100vh]">Unable to Load data,plese reload the page</div>
  )
}
};

