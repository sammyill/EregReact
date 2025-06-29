//l'admin riceve tutti i corsi attivi e li visualizza in una lista di 20 alla volta
//aggiungere pulsanti che permettono di scorrere la lista 
import { useState,useEffect,useContext } from "react"
import SimpleCard from "../components/SimpleCard"
import { useNavigate } from 'react-router-dom';
import { fetchHelper } from "../utilities";
import { EregContext } from "../contexts/EregContext";

export default function AdmincoursesPage() {
   const [courses,setCourses]=useState([]);
   const [isError,setIsError]=useState({});
   const {token}=useContext(EregContext)
   const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      const data = await fetchHelper('GET',`/getallcourses`,token,"none");
       if(data.error) setIsError({error:true,message:"unexpected load error"})
        console.log(data)
      setCourses(data.allCourses);
    }
    fetchData();
  }, []);

  if(isError?.error)navigate("/errorpage")
  if(courses.length<=0)return(<p>No data found</p>)
  

  return (
    <>
    <div className="m-auto w-[60vw]   pt-7 flex flex-col  justify-center align-middle   ">
      {courses.map((course)=>
      <SimpleCard  cardLabel={`${course.name} ${course.startyear}-${course.endyear}`}   
      elementID={course.id}  
      elementStatus={course.status===1 ? "active":"inactve"}/>
      )}
      <SimpleCard   cardLabel="Industrial Software  Developer 2029-2032"   elementID="2"  elementStatus="active"/>
      <SimpleCard  cardLabel="Mario Sgravola Mario.Scravola@gmail.com" elementID="2" elementStatus="inactve" />
      </div>
    </>
  );
}
