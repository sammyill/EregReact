import Button from "../components/Button";
import { useNavigate } from "react-router-dom";


//aggiungere rimando al alla pagina  admincoursedetail,ricodarsi si passare il corso id come parametro 
//dove ci saranno i singoli dettagli della pagina del corso
//quest componente accetta ancheutenti e in quel caso rimanda alla pagina utenti
//quindi accatta un terzo parameto navigateToPage che gmanta alla pagina selezionata
const elementStyleStatus={
    active:"w-full bg-blue-500 text-white flex flex-row  justify-between items-center align-middle p-3",
    inactve:"w-full bg-gray-500 text-white flex flex-row  justify-between items-center align-middle p-3"
}

export default function SimpleCard({cardLabel,elementID,elementStatus,navigateToPage}){
    const navigate=useNavigate()
    
    function handleCourseChange(elementID){
      navigate(navigateToPage,{id:elementID});
    }
    return (
    <div className="flex flex-col justify-center align-middle border border-gray-200 rounded-md overflow-hidden shadow-sm bg-white mb-2 w-[60vw]">
        <div className={elementStyleStatus[elementStatus]}>
        <div><span className=" md:text-2xl text-sm font-bold text-center">{cardLabel}</span></div>
        <div ><Button styleType="standardTiny" onClick={()=>handleCourseChange(elementID)}>Details</Button></div>
        </div>
        
    </div>
  
    )
}