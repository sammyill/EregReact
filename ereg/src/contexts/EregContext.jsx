import { useState, createContext,useEffect } from "react";


function isYoungerThan(pastDate, maxSeconds) {
  const nowMs = Date.now();              
  const pastMs = pastDate.getTime();    
  const diffSeconds = (nowMs - pastMs) / 1000;
  return diffSeconds < maxSeconds;
}
// 1. Create the context with empty default values
export const EregContext = createContext({
  isLoggedIn: false,
  token: "",
  user: {},
  usercourses: [],
  activeCourseRole: 0,
  activeCourseId: 0,
  activeCourseName:"",
  activeCourseStart:"",
  activeCourseEnd:"",
  setEreg: () => {},
  setActiveCourse: () => {},
  logout:()=>{}
});


export  function EregContextProvider({ children }) {
  const [context, setContext] = useState({
    isLoggedIn:false,
    token: "",
    user: {},
    usercourses: [],
    activeCourseRole:0,
    activeCourseId: 0,
    activeCourseName:"",
    activeCourseStart:"",
    activeCourseEnd:"",
  });
  const [timeLeft,setTimeLeft]=useState();

  //on page reload
    useEffect(() => {
      async function loadContextData(){
        const saved = JSON.parse(localStorage.getItem("ereg"));
        //if there is a token,otherwhise go to login
        if (saved?.token) {
          //if the time left is inferiot to the duration
          if(isYoungerThan(saved.lastLogData,saved.tokenDutarion)){
            setContext({
              isLoggedIn: true,
              token: saved.token,
              user: saved.user,
              password:saved.password,
              lastLogData:saved.lastLogData,//new data
              tokenDutarion:saved.tokenDutarion,
              usercourses: saved.usercourses || [],
              activeCourseRole:saved.usercourses?.[0]?.idrole || 0,
              activeCourseId: saved.usercourses?.[0]?.idcourse || 0,
              activeCourseName:saved.usercourses?.[0]?.coursename ||"",
              activeCourseStart:saved.usercourses?.[0]?.startyear ||"",
              activeCourseEnd:saved.usercourses?.[0]?.endyear ||"",
            });
          }else{//otherwhise reaquest a new token and new data
            //fare di nuovo il login qui,prendere i nuovi dati e salvarli su ereg localstorata
            //dopo implementare anche un timer quando la funzione si apre che data x secondi di tempo rimanenti rilogga
          }
         
          
        }
      }

      loadContextData();
  }, []);

  //timer for relog/new token request
  useEffect(()=>{

  })



  //on logging
  function setEreg(ereg) {
    const contexToSet={
      isLoggedIn: true,
      token: ereg.token,
      user: ereg.user,
      password:ereg.password,
      lastLogData:new Date(),
      tokenDutarion:ereg.tokenDutarion,
      usercourses: ereg.usercourses || [],
      activeCourseRole:ereg.usercourses?.[0]?.idrole || 0,
      activeCourseId: ereg.usercourses?.[0]?.idcourse || 0,
      activeCourseName:ereg.usercourses?.[0]?.coursename ||"",
      activeCourseStart:ereg.usercourses?.[0]?.startyear ||"",
      activeCourseEnd:ereg.usercourses?.[0]?.endyear ||"",
    };
    localStorage.setItem("ereg", JSON.stringify(contexToSet));
    setContext(contexToSet);

  }

  //on changing course
  function setActiveCourse(courseId) {
    console.log(`al context è arrivato questo valore ${courseId}`)
    const activeCourse=context.usercourses.find((course)=>course.idcourse===courseId);
    console.log(activeCourse)
    setContext((prev) => {
        console.log("previous values")
        console.log(prev)
      return {
      ...prev,
      activeCourseRole:activeCourse.idrole,
      activeCourseId: activeCourse.idcourse,
      activeCourseName:activeCourse.coursename,
      activeCourseStart:activeCourse.startyear,
      activeCourseEnd:activeCourse.endyear,

    }
    });
   }

   //on logging out 
   function logout() {
    localStorage.removeItem("ereg");
    setContext({
      isLoggedIn: false,
      token: "",
      user: {},
      usercourses: [],
      activeCourseId: 0,
      activeCourseRole:0,
      activeCourseName:"",
      activeCourseStart:"",
      activeCourseEnd:"",
    });
   }
  console.log(context)
  return (
    <EregContext.Provider value={{ ...context, setEreg, setActiveCourse,logout }}>
      {children}
    </EregContext.Provider>
  );
}
