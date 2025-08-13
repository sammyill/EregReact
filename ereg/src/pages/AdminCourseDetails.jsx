//dettagli del singolo corso dell' amminstratore 
//qui ci saranno anche i bottono che permettono di modificare e cancellare 
//oltre ai bottoni che permettono di tornare alla rispettiva pagina
//cioè course page
import { useLocation } from 'react-router-dom';
import { fetchHelper } from "../utilities";
import { useState,useEffect,useContext } from "react"
import { useNavigate } from 'react-router-dom';
import { EregContext } from "../contexts/EregContext";

export default function AdminCourseDetails(){
  const [courseData,setCourseData]=useState(null);
  const [isError,setIsError]=useState({});
  const location = useLocation();
     const {token}=useContext(EregContext)
   const navigate = useNavigate();
  const { id } = location.state || {};
  useEffect(() => {
    async function fetchData() {
      const data = await fetchHelper('GET',`/getcourse/${id}`,token,"none");
      console.log(data)
       if(data.error) setIsError({error:true,message:"unexpected load error"})
      setCourseData(data);
    }
    if(id) fetchData();
  }, [id]);

  if(isError?.error)navigate("/errorpage")
  if(!courseData)return(<p>No data found</p>)
  

  return <div>ID from state: {id}</div>;

}