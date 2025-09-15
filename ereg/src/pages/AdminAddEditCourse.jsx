import { useContext, useState,useEffect } from "react";
import Button from "../components/Button";
import FormWrapper from "../components/FormWrapper";
import InputField from "../components/InputField";
import InputSelect from "../components/InputSelect";
import { fetchHelper } from "../utilities";
import { EregContext } from "../contexts/EregContext";
import { useNavigate,useParams  } from 'react-router-dom';

/**
 * AddCourseCard — prototype to create a new Course
 * Course shape (as requested): { name, lenght (2|3), startyear, endyear, status (0|1) }
 *
 * IMPORTANT: This version aligns with your FormWrapper pattern — no cross-field client checks.
 * Validation (if any) comes only from each InputField's own constrolExpression, just like ModuleCard.
 */
const courseName = {
  startingvalue: "",
  label: "Course Name",
  type: "text",
  id: "courseName",
  name: "courseName",
  whatIsRight: "Between 5 and 100 characters",
  constrolExpression: /^.{5,100}$/,
};

// Using InputField (number) like your moduleLenght; allowed values 2 or 3
const courseLenght = {
  startingvalue: "2",
  label: "Length (years)",
  type: "number",
  id: "courseLenght",
  name: "courseLenght",
  whatIsRight: "Accepted values: 2 or 3",
  constrolExpression: /^(2|3)$/,
};

const courseStartYear = {
  startingvalue: String(new Date().getFullYear()),
  label: "Start Year",
  type: "number",
  id: "courseStartYear",
  name: "courseStartYear",
  whatIsRight: "Use a 4-digit year (e.g., 2025)",
  constrolExpression: /^(19|20)[0-9]{2}$/,
};

const courseEndYear = {
  startingvalue: String(new Date().getFullYear() + 1),
  label: "End Year",
  type: "number",
  id: "courseEndYear",
  name: "courseEndYear",
  whatIsRight: "Use a 4-digit year",
  constrolExpression: /^(19|20)[0-9]{2}$/,
};

// Select options — NOT included in FormWrapper's validation keys (same as your newprofessor)
const statusOptions = [
  { idvalue: 1, labelvalue: "Active" },
  { idvalue: 0, labelvalue: "Inactive" },
];

export default function AdminAddEditCourse({}) {
  const { token } = useContext(EregContext);
  const [elHasHerror, setelHasHerror] = useState({error:true,message:""});
  const [successMsg, setSuccessMsg] = useState("");
  const [courseData,setCourseData]=useState(null);
  const navigate = useNavigate();
  const {id} = useParams()
  const isEdit = id !== undefined;
  const courseId = id ? Number(id) : null;
  console.log("prova")

  useEffect(()=>{
    async function getCourseData() {
       const data = await fetchHelper("GET", `/getcourse/${courseId}`, token, "none");
       console.log("data",data.courseData[0])
      if(data.error) setelHasHerror({error:true,message:"Errore nel fetch dei dati"})
      setCourseData(data.courseData[0]);
    }
    if(isEdit) getCourseData();
  },[])

  function handleReget() {
    navigate("/admincoursespage")
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setelHasHerror({error:true,message:""});
    setSuccessMsg("");

    const payload = {
      name: event.target.courseName?.value,
      lenght: event.target.courseLenght?.value,
      startyear: event.target.courseStartYear?.value,
      endyear: event.target.courseEndYear?.value,
      status: Number(event.target.courseStatus?.value ?? 1),
    };

    const data = await fetchHelper("POST", "/createcourse", token, payload);
    if (data?.error === true) {
      setelHasHerror({error:true,message:"unexpected load error"});
      return;
    }
    navigate("/admincoursespage")
    setSuccessMsg("Course created successfully.")
  }

  console.log("coursedata",courseData)
  return (
    <div className="w-full basis-full flex-shrink-0">
      {elHasHerror.error && (
        <div className="text-center text-red-600">{elHasHerror.message}</div>
      )}
      {successMsg && (
        <div className="text-center text-green-600">{successMsg}</div>
      )}
      {(courseData &&isEdit) &&
     
      <FormWrapper
        confirmButton="Create"
        regetButton="Annulla"
        handleSubmit={handleSubmit}
        handleReget={handleReget}
        courseName="courseName"
        courseLenght="courseLenght"
        courseStartYear="courseStartYear"
        courseEndYear="courseEndYear"
      >
        <InputField {...{...courseName,startingvalue:courseData?.name ||""}} />
        <InputField {...{...courseLenght,startingvalue:courseData?.lenght||""}} />
        <InputField {...{...courseStartYear,startingvalue:courseData?.startyear||""}} />
        <InputField {...{...courseEndYear,startingvalue:courseData?.endyear||""}} />
        <InputSelect
          label="Status"
          id="courseStatus"
          name="courseStatus"
          values={statusOptions}
          selectedvalue={1}
        />
      </FormWrapper>
      }
      {!isEdit &&      <FormWrapper
        confirmButton="Create"
        regetButton="Annulla"
        handleSubmit={handleSubmit}
        handleReget={handleReget}
        courseName="courseName"
        courseLenght="courseLenght"
        courseStartYear="courseStartYear"
        courseEndYear="courseEndYear"
      >
        <InputField {...courseName} />
        <InputField {...courseLenght} />
        <InputField {...courseStartYear} />
        <InputField {...courseEndYear} />
        <InputSelect
          label="Status"
          id="courseStatus"
          name="courseStatus"
          values={statusOptions}
          selectedvalue={1}
        />
      </FormWrapper>}
    </div>
  );
}
