import { useState, createContext,useEffect } from "react";

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

  //on page reload
    useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("ereg"));
    if (saved?.token) {
      setContext({
        isLoggedIn: true,
        token: saved.token,
        user: saved.user,
        usercourses: saved.usercourses || [],
        activeCourseRole:saved.usercourses?.[0]?.idrole || 0,
        activeCourseId: saved.usercourses?.[0]?.idcourse || 0,
        activeCourseName:saved.usercourses?.[0]?.coursename ||"",
        activeCourseStart:saved.usercourses?.[0]?.startyear ||"",
        activeCourseEnd:saved.usercourses?.[0]?.endyear ||"",
      });
    }
  }, []);

  //on logging
  function setEreg(ereg) {
    localStorage.setItem("ereg", JSON.stringify(ereg));
    setContext({
      isLoggedIn: true,
      token: ereg.token,
      user: ereg.user,
      usercourses: ereg.usercourses || [],
      activeCourseRole:ereg.usercourses?.[0]?.idrole || 0,
      activeCourseId: ereg.usercourses?.[0]?.idcourse || 0,
      activeCourseName:ereg.usercourses?.[0]?.coursename ||"",
      activeCourseStart:ereg.usercourses?.[0]?.startyear ||"",
      activeCourseEnd:ereg.usercourses?.[0]?.endyear ||"",
    });

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
