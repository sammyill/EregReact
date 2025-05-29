import { fetchHelper } from "../utilities";
import { useEffect, useState, useContext } from "react";
import { EregContext } from "../contexts/EregContext";
import FormWrapper from "../components/FormWrapper";
import InputField from "../components/InputField";
import TextArea from "../components/textArea";
import InputSelect from "../components/InputSelect";
import Button from "../components/Button";
import ModuleCard from "../components/ModuleCard"
import SearchField from "../components/SearchField";
import { fullName } from "../utilities";
import {moduleDescription,moduleName,moduleLenght } from "../components/formsdasates";



export default  function Home() {
  const [modulesData, setModulesData] = useState(null);
  const [professorData,setProfessorData]=useState(null)
  const [searchedData, setSearchedData] = useState(null);
  const [forcedReload,setForcedReload]=useState(false);
  const [isLoading,setIsLoading]=useState(false);
  const [newModule,setNewModule]=useState(false);
  const [errorAddinModule,setErrorAddingModule]=useState(false);
  const {activeCourseId,activeCourseName,activeCourseStart,activeCourseEnd,token}=useContext(EregContext);
 
   localStorage.clear()
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const data = await fetchHelper('GET',`/getmodules/${activeCourseId}`,token,"none");
     
      setModulesData(data);
      setProfessorData(data.professors.map((prof) => {
              return {
               idvalue:prof.idprofessor,
               labelvalue:fullName(prof.firstName,prof.lastName)
        }}))
      setSearchedData(data.modules);
      setIsLoading(false)
    }
    fetchData();
  }, [forcedReload]);

   const handleSubmit =async (event) => {
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
      idprofessor:event.target.newprofessor.value,
      idcourse:activeCourseId
    } 
    const data = await fetchHelper('POST',`/addmodule`,token,userrequest);
    if (data.error===true){
    setErrorAddingModule(true)
      return
    } 
    setNewModule(false)
    setForcedReload((prev)=>!prev)
  }
   
  function handleReget(){
    setNewModule(false)
  }
  function handleAddNewModule(){
    setNewModule(true)
  }
 

  if(modulesData?.error===true){
  return(
      <div className="m-auto w-[60vw] text-4xl h-[100vh]">Unable to Load data,plese reload the page</div>
    )
  }
 
  if(modulesData){
  return (
  <div className="m-auto w-[70vw] pt-7 flex flex-col  justify-center items-center ">
    <h1 className="text-center py-10 md:text-4xl font-bold" >{activeCourseName} {activeCourseStart}-{activeCourseEnd}</h1>
    <h2 className="text-center py-10 md:text-2xl font-bold" >Moduli del corso:</h2>
     
    {isLoading &&  <div className="m-auto text-4xl">Loading Data</div>}
    {!isLoading && <div> 
        <div className="flex  items-center justify-center ">
         <div className="w-[30vw] m-2">
          <SearchField  
          setSearchedData={setSearchedData} 
          searchField="name" 
          startingData={modulesData.modules} 
          searchLabel="module name"/>
         </div>
         </div>
         {errorAddinModule && <div className="m-auto text-4xl">Error in adding the module</div> }
         { !newModule && <div className="flex  items-center justify-center ">
         <div ><Button styleType="standard"  onClick={handleAddNewModule}>Add Module</Button> </div>
        </div>}
        {newModule && <div className="flex  items-center justify-center ">
          <FormWrapper confirmButton="Add" regetButton="Don't add" handleSubmit={handleSubmit} handleReget={handleReget} moduleName="moduleName" moduleLenght="moduleLenght" moduleDescription="moduleDescription">
            <InputField {...moduleName} />
            <InputField {...moduleLenght} />
            <TextArea  {...moduleDescription}/>
            <InputSelect label="Prfessori" id="newprofessor" name="newprofessor" values={professorData} selectedvalue={professorData[0].idvalue}/> 
          </FormWrapper>
        </div>}
          
        <div className="flex  flex-wrap w-full  justify-center ">
        { searchedData.length>0 ? 
          searchedData.map((module)=><ModuleCard
                  key={module.idmodule}
                  title={module.name}
                  modulePFN={module.firstName}
                  modulePLN={module.lastName}
                  length={module.lenght}
                  description={module.description}
                  moduleID={module.idmodule}
                  professorID={module.idprofessor}
                  setForcedReload={setForcedReload}
                  availableProfessors={professorData}/>):
                  <div className="m-auto text-4xl">NO LESSONS FOUND</div>}</div>
    </div>}
   </div>);
  }

}

