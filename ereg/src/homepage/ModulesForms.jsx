//qui va messa tutta la logia di aggiornamento/update dei moduli in un unico componente,che dopo servirà 
//da base per essere copia incollato da tutti gli altri modili
//qui va inoltre messa anche tutta la logica di gestione
//in modo da copiare e incollare per il calendario
//e copiare e incollare per modificare i dati relativi a se stessi
import { useContext,useState } from "react";
import Button from "../components/Button";  // da togliere e spostare la logica su modulesforms
import FormWrapper from "../components/FormWrapper"; // da togliere e spostare la logica su modulesforms
import InputField from "../components/InputField"; // da togliere e spostare la logica su modulesforms
import TextArea from "../components/textArea"; // da togliere e spostare la logica su modulesforms
import InputSelect from "../components/InputSelect"; // da togliere e spostare la logica su modulesforms
import { fetchHelper } from "../utilities";
import { moduleDescription,moduleName,moduleLenght} from "../components/formsdasates";


export default function ModuleForms({mode,setModulesReload,setCardMode,setOperationError,...moduledate}){
   const [elHasHerror,setelHasHerror]=useState(false)
   const handleSubmit = async (event) => {
    event.preventDefault()
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


    if(mode==="edit"){
        return(<>
           <div className="w-full basis-full  flex-shrink-0">
               <FormWrapper confirmButton="Update" regetButton="Don't update" handleSubmit={handleSubmit} handleReget={handleReget} moduleName="moduleName" moduleLenght="moduleLenght" moduleDescription="moduleDescription">
                 <InputField {...{...moduleName,startingvalue:moduledate.title}} />
                 <InputField {...{...moduleLenght,startingvalue:moduledate.length}} />
                 <TextArea  {...{...moduleDescription,startingvalue:moduledate.description}} />
                 <InputSelect label="Prfessori" id="newprofessor" name="newprofessor" values={moduledate.availableProfessors} selectedvalue={moduledate.professorID}/> 
               </FormWrapper>
               </div>
        </>)
    }



    if(mode==="addnew"){
        return(<>

        </>)
    }
}