import { fetchHelper } from "../utilities";
import { useEffect, useState, useContext } from "react";
import { EregContext } from "../contexts/EregContext";
import UserCard from "../components/UserCard";
import UserDatail from "../components/UserDetail";
import SearchField from "../components/SearchField";

//per poter usare entrambi i valori  dovre avere 3 stati 
//uno per il some selezionato
//uno per il cognome selezonato
//e l'output sarebbe un array in cui i valori compaiono in entrambi praticamente per ogni arrai 
//si scorre l'altro e si ritornano solo i  valori che sono in entrambi praticamente si filtra uno dei due
//array e si usa un find sull altro

export default  function Professors() {
  const [modulesData, setModulesData] = useState(null);
  const [searchedData, setSearchedData] = useState(null);
  const [seeFullBio,setSeeFullBio]=useState({isFullBio:false,fullBioId:0,fullBioRole:""});
  const {activeCourseId,activeCourseName,token}=useContext(EregContext);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchHelper('GET',`/getprofessors/${activeCourseId}`,token,"none");
      setModulesData(data);
      setSearchedData(data);
    }
    fetchData();
  }, []);
  
  function handleFullInfoClick(id,role){
    console.log(id)
    console.log(role)
    setSeeFullBio({
      isFullBio:true,
      fullBioId:id,
      fullBioRole:role
    })
  }

  function handleGoBack(){
    setSeeFullBio({
      isFullBio:false,
      fullBioId:0,
      fullBioRole:""
    })
  }

  if(seeFullBio.isFullBio===true){
    return(
   <div className="m-auto w-[60vw] pt-7 flex flex-col  justify-center align-middle ">
     <UserDatail 
     userRoleName={seeFullBio.fullBioRole}
     requestedUserId={seeFullBio.fullBioId}
     handleGoBack={handleGoBack} />
    </div>
    ) 
  }

  if(modulesData){
    return (
    <>
    <div className="m-auto w-[60vw] pt-7 flex flex-col  justify-center align-middle ">
    <h1 className="text-center py-10 md:text-4xl font-bold" >{activeCourseName}</h1>
    <h2 className="text-center py-10 md:text-2xl font-bold" >Profs and coordinators:</h2>
    <SearchField  setSearchedData={setSearchedData} searchField="firstname" startingData={modulesData} searchLabel="First Name"/>
    <SearchField  setSearchedData={setSearchedData} searchField="lastname" startingData={modulesData} searchLabel="Last Name"/>
    <div className="m-auto  pt-7 flex flex-row flex-wrap justify-center align-middle ">
        {searchedData.map((professor)=><UserCard
                                key={professor.iduser}
                                userID={professor.iduser}
                                firstName={professor.firstname}
                                lastName={professor.lastname}
                                userRole={professor.userrole}
                                 handleFullInfoClick={handleFullInfoClick}
                                imgSource="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/800px-Grosser_Panda.JPG"          
                            />
         )}
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