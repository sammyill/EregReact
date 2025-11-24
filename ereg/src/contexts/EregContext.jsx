import { useState, createContext,useEffect } from "react";
import { fetchHelper } from "../utilities";

function isYoungerThan(pastDate, maxSeconds) {
  if (!pastDate || !maxSeconds) return false;

  const date =
    pastDate instanceof Date ? pastDate : new Date(pastDate);

  const diffSeconds = (Date.now() - date.getTime()) / 1000;
  return diffSeconds < maxSeconds;
}

// 1. Create the context with empty default values
export const EregContext = createContext({
  isLoggedIn: false,
  token: "",
  user: {},
  password: "",
  lastLogData: null,
  tokenDutarion: 0,
  usercourses: [],
  activeCourseRole: 0,
  activeCourseId: 0,
  activeCourseName:"",
  activeCourseStart:"",
  activeCourseEnd:"",
  setEreg: () => {},
  setActiveCourse: () => {},
  logout:()=>{},
  relog:()=>{}
});


export  function EregContextProvider({ children }) {
  const [context, setContext] = useState({
    isLoggedIn:false,
    token: "",
    user: {},
    password: "",
    lastLogData: null,
    tokenDutarion: 0,
    usercourses: [],
    activeCourseRole:0,
    activeCourseId: 0,
    activeCourseName:"",
    activeCourseStart:"",
    activeCourseEnd:"",
  });

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
          }else{
            const data = await fetchHelper("POST",`/login`,"",{
              email: saved.user.email,
              password:saved.password
            });
            if(data.error===false) {
              console.log("fethed data");
              console.log(data)
              setEreg({
                ...data,
                password:saved.password
              })
            }
          }
        }
      }

      loadContextData();
  }, []);

  //timer for relog/new token request
  useEffect(()=>{

  })

  async function relog(){
        const savedRaw = localStorage.getItem("ereg");
        if (!savedRaw) {
          logout(); // or just return
          return;
        }
        const saved = JSON.parse(savedRaw);
          
      const data = await fetchHelper("POST",`/login`,"",{
              email: saved.user.email,
              password:saved.password
      });
      if(data.error===false) {
              console.log("fethed data");
              console.log(data)
              setEreg({
                ...data,
                password:saved.password
              })
      }else if(data.error===true){
        localStorage.removeItem("ereg"); 
        setEreg({
              isLoggedIn:false,
              token: "",
              user: {},
              password: "",
              lastLogData: null,
              tokenDutarion: 0,
              usercourses: [],
              activeCourseRole:0,
              activeCourseId: 0,
              activeCourseName:"",
              activeCourseStart:"",
              activeCourseEnd:"",
        })
      }
  }


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
     if (!activeCourse) return;
    console.log("activeCourse",activeCourse)
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
    <EregContext.Provider value={{ ...context, setEreg, setActiveCourse,logout,relog }}>
      {children}
    </EregContext.Provider>
  );
}
