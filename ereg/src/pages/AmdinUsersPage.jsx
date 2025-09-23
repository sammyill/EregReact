//l'admin riceve tutti i corsi attivi e li visualizza in una lista di 20 alla volta
//aggiungere pulsanti che permettono di scorrere la lista 
import { useState,useEffect,useContext } from "react"
import SimpleCard from "../components/SimpleCard"
import Button from "../components/Button";
import { useNavigate } from 'react-router-dom';
import { fetchHelper,fullName } from "../utilities";
import { EregContext } from "../contexts/EregContext";

export default function AdminUsersPage() {
   const [users,setUsers]=useState([]);
   const [isError,setIsError]=useState({});
   const {token}=useContext(EregContext)
   const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      const data = await fetchHelper('GET',`/getallusers`,token,"none");
       if(data.error) setIsError({error:true,message:"unexpected load error"})
        console.log(data)
      setUsers(data.users);
    }
    fetchData();
  }, []);

  if(isError?.error)navigate("/errorpage")
  if(users.length<=0)return(<p>No data found</p>)
  

  return (
    <>
    <div className="m-auto w-[60vw]   pt-7 flex flex-col  justify-center align-middle   ">
      <Button styleType={"standard"} onClick={()=>navigate(`/addedituser`)}>Aggiungi Utente</Button>
      {users.map((user)=>
      <SimpleCard 
      key={user.id} 
      cardLabel={` ${fullName(user.firstname,user.lastname)}-${user.email}`}   
      elementID={user.id}  
      elementStatus={user.status===1 ? "active":"inactve"}
      navigateToPage="/adminuserdetail"/>
      )}
      </div>
    </>
  );
}
