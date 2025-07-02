import { fetchHelper } from "../utilities";
import { useEffect, useState, useContext } from "react";
import { EregContext } from "../contexts/EregContext";
import LessonCard from "../components/LessonCard";
import SearchField from "../components/SearchField";
import Button from "../components/Button";
import FormWrapper from "../components/FormWrapper";
import InputField from "../components/InputField";
import InputSelect from "../components/InputSelect";
import LessonPage from "../components/LessondDetails";
import {beginDate,endDate } from "../components/formsdasates";
const todayDate=new Date();
const monthName=["","Jen","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//per poter usare entrambi i valori  dovre avere 3 stati 
//uno per il some selezionato
//uno per il cognome selezonato
//e l'output sarebbe un array in cui i valori compaiono in entrambi praticamente per ogni arrai 
//si scorre l'altro e si ritornano solo i  valori che sono in entrambi praticamente si filtra uno dei due
//array e si usa un find sull altro

export default  function Calendar() {
  const [calendarReload,setCalendarReload]=useState(false)
  const [lessonsData, setlessonsData] = useState(null);
  const [modulesData,setModulesData]=useState(null)
  const [searchedData, setSearchedData] = useState(null);
  const [reqMonth,setReqMonth]=useState(parseInt(todayDate.getMonth())+1)
  const [reqYear,setReqYear]=useState(todayDate.getFullYear())
  const {activeCourseId,activeCourseName,token}=useContext(EregContext);
   const [newLesson,setNewLesson]=useState(false);
   const [errorAddingLesson,setErrorAddingLesson]=useState(false);
  const[isDetailsActive,setIsDetailsActive]=useState(false)
  const todayMonth=todayDate.getMonth();
  const todayYear=todayDate.getFullYear();
  // /getalllessons/:idcourse/:month/:year
  //da modificare prendendo la data di oggi in futuro
  //aggingere de la durata del modulo è 0 Non ci sono lezioni
  //aggiungere bottone previous,next per cambiare i mesi
  //monta e year diventano stati che vanno cambiati quando si preme previou o next

  function handleGoNext(){
    if (reqMonth === 12) {
    setReqYear(prev => prev + 1); 
    setReqMonth(1);            
    } else {
    setReqMonth(prev => prev + 1);
    }

  }
  function handleGoPrevious(){
    if(reqMonth===1){
      setReqYear((prev)=>prev-1)
      setReqMonth(12)
    }else{
      setReqMonth((prev)=> prev-1)
    }
    
  }

  function handleRequestDetails(lessonId){
     console.log("lessonID:",lessonId)
     setIsDetailsActive(true)
  }

  const handleSubmit =async (event) => {
    event.preventDefault()
    console.log(event.target.beginDate.value)
    console.log(event.target.endDate.value)
    console.log(event.target.modules.value)
    const userrequest={
      begindate:event.target.beginDate.value,
      enddate:event.target.endDate.value,
      idmodule:event.target.modules.value,
      idcourse:activeCourseId
    } 
    const data = await fetchHelper('POST',`/createlesson`,token,userrequest);

    if (data.error===true){
    setErrorAddingLesson(true)
     setNewLesson(false)
      return
    } 
    setNewLesson(false)
    setCalendarReload((prev)=>!prev)
  }
  function handleReget(){
    setNewLesson(false)
  }

  function handleAddNewLesson(){
    setNewLesson(true)
  }

  useEffect(() => {
    async function fetchData() {
      const data = await fetchHelper('GET',`/getalllessons/${activeCourseId}/${reqMonth}/${reqYear}`,token,"none");
      console.log(`/getalllessons/${activeCourseId}/${reqMonth}/${reqYear}`)
      setlessonsData(data);
      console.log(data)
      setModulesData(data.allmodules.map((mod) => {
                    return {
                     idvalue:mod.idmodule,
                     labelvalue:mod.name
      }}))
  
      setSearchedData(data.allMonthLessons);
    }
    fetchData();
  }, [calendarReload,activeCourseId,reqMonth,reqYear]);
  if(isDetailsActive) return(<p>prova</p>)
  //console.log(`La mia data è Mese ${monthName[reqMonth]} Anno: ${reqYear}`)
  if(lessonsData){
    return (
    <>
    <div className="m-auto w-[60vw]  pt-7 flex flex-col  justify-center align-middle   ">
    <h1 className="text-center py-10 md:text-4xl font-bold" >{activeCourseName}</h1>
    <h2 className="text-center py-10 md:text-2xl font-bold" >Lezioni del corso:</h2>
    <SearchField  setSearchedData={setSearchedData} searchField="modulename" startingData={lessonsData.allMonthLessons} searchLabel="Module"/>
    <div className="flex justify-center items-center space-x-4 mt-6">
    <div className="flex justify-center items-center space-x-4 mt-6">
     {(lessonsData.previous) ? 
     <Button styleType="standardTiny" onClick={handleGoPrevious} >&#9664;</Button>
     :<Button styleType="disabledTiny" onClick={handleGoPrevious} disabled>&#9664;</Button>}
    <span className="text-lg font-medium text-gray-700">{monthName[reqMonth]} {reqYear}</span>
    {(lessonsData.next)?
     <Button styleType="standardTiny"  onClick={handleGoNext}>&#9654;</Button>:
      <Button styleType="disabledTiny"  onClick={handleGoNext} disabled>&#9654;</Button>}
    </div>
    </div>
    {errorAddingLesson && <div className="m-auto text-xl">Error in adding the lesson</div> }
    {!newLesson &&
     <div className="flex justify-center items-center space-x-4 mt-6">
     <Button styleType="standard" onClick={handleAddNewLesson}>Add a new Lesson</Button>
    </div>
    }
    {newLesson &&
    <div className="flex justify-center items-center space-x-4 mt-6">
         <FormWrapper confirmButton="Add" regetButton="Don't add" handleSubmit={handleSubmit} handleReget={handleReget} beginDate="beginDate" endDate="endDate" >
                <InputField {...beginDate} />
                <InputField {...endDate} />
                <InputSelect label="Modules" id="modules" name="modules" values={modulesData} selectedvalue={modulesData[0].idvalue}/> 
          </FormWrapper>
    </div>

    }

    <div className="m-auto  pt-7 flex flex-row flex-wrap justify-center align-middle ">
        {(searchedData.length>0) ?    searchedData.map((lesson)=><LessonCard
                                key={lesson.idlesson}
                                lessonProfFN={lesson.firstname}
                                lessonProfLN={lesson.lastname}
                                lessonEnd={lesson.begindate}
                                lessonStart={lesson.enddate}
                                lessonModule={lesson.modulename}  
                                lessonId={lesson.idlesson}
                                handleRequestDetails={handleRequestDetails} 
                                setCalendarReload={setCalendarReload}      
                            /> ) :<div className="m-auto text-4xl">NO LESSONS FOUND</div>
        }
   </div>
   </div>
    </>
    
  );
  }else {
    return(
      <>
      <div className="m-auto w-[60vw]"><h1 className="text-5xl">Unable to Load data,plese reload the page</h1></div>
      </>
    )
  }

  
}

    //alternarive way,deprected
    /*
    setReqMonth((prev)=>{
      if(prev===11) {
        setReqYear((prev)=>prev+1)
      return 0
      }else{
         return prev+1
      }
    }) 
     */