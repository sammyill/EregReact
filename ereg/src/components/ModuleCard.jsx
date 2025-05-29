import { useContext,useState } from "react";
import Button from "../components/Button";
import FormWrapper from "./FormWrapper";
import InputField from "./InputField";
import TextArea from "./textArea";
import InputSelect from "./InputSelect";
import { fullName } from "../utilities";
import { fetchHelper } from "../utilities";
import { EregContext } from "../contexts/EregContext";
import { moduleDescription,moduleName,moduleLenght} from "./formsdasates";



export default function ModuleCard({title,modulePFN="sconosciuto",
  modulePLN="sconosciuto",description,length,moduleID,setForcedReload,availableProfessors,professorID}){
  const[cardMode,setCardMode]=useState("read");
  const [elHasHerror,setelHasHerror]=useState(false)
  const {activeCourseRole,activeCourseId,token}=useContext(EregContext) ;
  const fullname=fullName(modulePFN,modulePLN)
  
   const handleSubmit = async (event) => {
    event.preventDefault()
    console.log(event.target.moduleName.value)
    console.log(event.target.moduleLenght.value)
    console.log(event.target.moduleDescription.value)
    console.log(event.target.newprofessor.value)
    const userrequest={
      name:event.target.moduleName.value,
      description:event.target.moduleDescription.value,
      lenght:event.target.moduleLenght.value,
      status:1,
      idprofessor:event.target.newprofessor.value
    } 
    const data = await fetchHelper('PATCH',`/updatemodule/${moduleID}`,token,userrequest);
    if (data.error===true){
    setelHasHerror(true)
      return
    } 
      
    setCardMode("read")
    setForcedReload((prev)=>!prev)
  }
 
  function handleReget(){
    setCardMode("read")
    setelHasHerror(false)
  }

  function handleEditClick(){
    setCardMode("edit")
  }
  function handleDeletionClick(){
    setCardMode("delete")
  }
  function handleDeletionReject(){
    setCardMode("read")
    setelHasHerror(false)
  }

  
  //FIXA ON DELETE UPDATE SUL DATABASE TOGLILI TUTTI E LASCIA CHE IN UPDATE/DELETE NON SUCCEDE NULLA
  //OPPURE SEGUI LE SOLUZIONI DI CHATGPT:
  //Option 1: Delete related lessons first
  //Option 2: Add ON DELETE CASCADE to the foreign key (if you want dependent lessons deleted automatically)
  //opdzione 3:cambia il back hand non puoi eliminare un modulo che ha delle lezioni associate.
  async function deleteHasBeenChosen(){
    const data = await fetchHelper('DELETE',`/deletemodule/${activeCourseId}/${moduleID}`,token,"none");
    if (data.error===true){
       setelHasHerror(true)
       return
    } 
    setForcedReload((prev)=>!prev)
  }
  
  if(cardMode==="edit"){

    return(
      <>
    <div className="w-full basis-full  flex-shrink-0">
    {elHasHerror &&<div className="text-center text-red-600">Cannot update the module</div>}
    <FormWrapper confirmButton="Update" regetButton="Don't update" handleSubmit={handleSubmit} handleReget={handleReget} moduleName="moduleName" moduleLenght="moduleLenght" moduleDescription="moduleDescription">
      <InputField {...{...moduleName,startingvalue:title}} />
      <InputField {...{...moduleLenght,startingvalue:length}} />
      <TextArea  {...{...moduleDescription,startingvalue:description}} />
      <InputSelect label="Prfessori" id="newprofessor" name="newprofessor" values={availableProfessors} selectedvalue={professorID}/> 
    </FormWrapper>
    </div>
      </>
    )
  }

  return (
     
    <div className="w-[30vw] flex flex-col justify-center align-middle border border-gray-200 rounded-md overflow-hidden shadow-sm bg-white m-2 ">
        <div className={cardMode==="delete" ? "w-full h-full bg-red-600 text-white flex flex-row flex-wrap justify-center align-middle p-3":"w-full h-full bg-blue-500 text-white flex flex-row flex-wrap justify-center align-middle p-3"}>
        <span className=" md:text-xl text-sm font-bold mx-1 text-center">{title}</span>
        <span className=" md:text-xl text-sm font-bold mx-1 text-center">{fullname} </span>
        <span className=" md:text-xl text-sm font-bold mx-1 text-center">{length} Ore</span>
        </div>
        <div className="w-full px-4 py-3 text-gray-800 text-xs md:text-sm  text-center"> 
          <p className="mb-1">{description} </p>
        </div>
        {elHasHerror &&<div className="text-center text-red-600">Cannot delete,Module elready deleted or have lessons associate with it,Click Don't Delete</div>}
        {activeCourseRole===3 && cardMode==="read" &&
          <div className="flex flex-row justify-center items-center"> 
          <Button styleType="standardIntegrated" onClick={handleEditClick}>Edit</Button>
          <Button styleType="dangerIntegrated"  onClick={handleDeletionClick} >Delete</Button>
          </div>}
        {cardMode==="delete" &&
          <div className="flex flex-row justify-center items-center">
          <Button styleType="dangerIntegrated"  onClick={deleteHasBeenChosen} >CONFIRM </Button>
          <Button styleType="executeIntegrated"  onClick={handleDeletionReject} >REJECT</Button>
        </div>}
       
    </div>
  
    )
}


/* 
//VECCHIO COMPONENTE,SE FAI DISASTRI
export default function ModuleCard({title,modulePFN="sconosciuto",
  modulePLN="sconosciuto",description,length,moduleID,setForcedReload}){
  const[elHasBeenClicked,setElHasBeenClicked]=useState(false);
  const [elHasHerror,setelHasHerror]=useState(false)
  const {activeCourseRole,activeCourseId,token}=useContext(EregContext) 
  const fullname=fullName(modulePFN,modulePLN)
  
   const handleSubmit = (event) => {
    event.preventDefault()
    console.log(event.target.moduleName.value)
    console.log(event.target.moduleLenght.value)
    console.log(event.target.moduleDescription.value)
    //console.log(formIsValid)
    }

  function handleElHasBeenClicked(){
    setElHasBeenClicked(true)
  }
  function handleElRejection(){
    setElHasBeenClicked(false)
    setelHasHerror(false)
  }

  //FIXA ON DELETE UPDATE SUL DATABASE TOGLILI TUTTI E LASCIA CHE IN UPDATE/DELETE NON SUCCEDE NULLA
  //OPPURE SEGUI LE SOLUZIONI DI CHATGPT:
  //Option 1: Delete related lessons first
  //Option 2: Add ON DELETE CASCADE to the foreign key (if you want dependent lessons deleted automatically)
  //opdzione 3:cambia il back hand non puoi eliminare un modulo che ha delle lezioni associate.
  async function deleteHasBeenChosen(){
    console.log("Ricevuto messaggio di cancellazione")
    const data = await fetchHelper('DELETE',`/deletemodule/${activeCourseId}/${moduleID}`,token,"none");
    if (data.error===true){
       setelHasHerror(true)
    } 
    setForcedReload((prev)=>!prev)
  }
  
  if(3===4){
    return(
      <>
    <FormWrapper confirmButton="Update" regetButton="Don't update" handleSubmit={handleSubmit} moduleName="moduleName" moduleLenght="moduleLenght" moduleDescription="moduleDescription">
      <InputField {...{...moduleName,startingvalue:title}} />
      <InputField {...{...moduleLenght,startingvalue:length}} />
      <TextArea {...{...moduleDescription,startingvalue:description}} />
    </FormWrapper>
      </>
    )
  }

  return (
     
    <div className="w-[30vw] flex flex-col justify-center align-middle border border-gray-200 rounded-md overflow-hidden shadow-sm bg-white m-2 ">
        <div className={elHasBeenClicked ? "w-full h-full bg-red-600 text-white flex flex-row flex-wrap justify-center align-middle p-3":"w-full h-full bg-blue-500 text-white flex flex-row flex-wrap justify-center align-middle p-3"}>
        <span className=" md:text-xl text-sm font-bold mx-1 text-center">{title}</span>
        <span className=" md:text-xl text-sm font-bold mx-1 text-center">{fullname} </span>
        <span className=" md:text-xl text-sm font-bold mx-1 text-center">{length} Ore</span>
        </div>
        <div className="w-full px-4 py-3 text-gray-800 text-xs md:text-sm  text-center"> 
          <p className="mb-1">{description} </p>
        </div>
        {activeCourseRole===3 && <Button styleType="standardIntegrated">Modifica</Button>}
        {elHasHerror &&<div className="text-center text-red-600">Cannot delete,Module elready deleted or have lessons associate with it,Click Don't Delete</div>}
        {activeCourseRole===3 && !elHasBeenClicked && <Button styleType="dangerIntegrated"  onClick={handleElHasBeenClicked} >DELETE</Button>}
        {elHasBeenClicked &&<div className="flex flex-row justify-center items-center">
          <Button styleType="dangerIntegrated"  onClick={deleteHasBeenChosen} >CONFIRM </Button>
          <Button styleType="executeIntegrated"  onClick={handleElRejection} >DON'T DELETE</Button>
        </div>}
       
    </div>
  
    )
}
*/