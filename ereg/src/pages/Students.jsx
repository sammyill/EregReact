import { fetchHelper } from "../utilities";
import { useEffect, useState, useContext } from "react";
import { EregContext } from "../contexts/EregContext";
import UserCard from "../components/UserCard";
import UserDatail from "../components/UserDetail";
import SearchField from "../components/SearchField";



export default  function Students() {
  const [modulesData, setModulesData] = useState(null);
  const [searchedData, setSearchedData] = useState(null);
  const [seeFullBio,setSeeFullBio]=useState({isFullBio:false,fullBioId:0,fullBioRole:""});
  const {activeCourseId,activeCourseName,token}=useContext(EregContext);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchHelper('GET',`/getstudents/${activeCourseId}`,token,"none");
      setModulesData(data);
      setSearchedData(data);
    }
    fetchData();
  }, []);
  
    function handleFullInfoClick(id,role){
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
    <h2 className="text-center py-10 md:text-2xl font-bold" >Students :</h2>
    <SearchField  setSearchedData={setSearchedData} searchField="lastname" startingData={modulesData} searchLabel="Last Name"/>
    <div className="m-auto  pt-7 flex flex-row flex-wrap justify-center align-middle ">
        {searchedData.map((student)=><UserCard
                                key={student.iduser}
                                userID={student.iduser}
                                firstName={student.firstname}
                                lastName={student.lastname}
                                userRole={student.userrole}
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
