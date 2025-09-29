

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


export default function AdminAddEditUser({}) {
  const { token } = useContext(EregContext);
  const [elHasHerror, setelHasHerror] = useState({error:true,message:""});
  const [successMsg, setSuccessMsg] = useState("");
  const [userData,setUserData]=useState(null);
  const navigate = useNavigate();
  const {id} = useParams()
  const isEdit = id !== undefined;
  const userId = id ? Number(id) : null;
  console.log("prova")

  useEffect(()=>{
    async function getUserData() {
        const data = await fetchHelper('GET',`/getsingleuser/${userId}`,token,"none");
       console.log("data",data.user)
      if(data.error) setelHasHerror({error:true,message:"Errore nel fetch dei dati"})
      setUserData(data.user);
    }
    if(isEdit) getUserData();
  },[])

  function handleReget() {
    navigate("/adminuserspage")
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      firstname: event.target.firstname?.value,
      lastname: event.target.lastname?.value,
      phone: event.target.phone?.value,
      age: event.target.ege?.value,
      email: event.target.email?.value,
      fiscalcode: event.target.fiscalcode?.value,
      password:event.target.password?.value,
      status: Number(event.target.courseStatus?.value ?? 1),
    };
    let data;
    if(id){
      console.log("update");
      payload.id=id;
      data = await fetchHelper("PATCH", `/updateuser/${id}`, token, payload);
    }else{
      data = await fetchHelper("POST", "/adduser", token, payload);
    }

    if (data?.error === true) {
      setelHasHerror({error:true,message:"unexpected load error"});
      return;
    }
    navigate("/adminuserspage")
    setSuccessMsg("Operation completed successfully.")
  }

  console.log("coursedata",userData)
  return (
    <div className="w-full basis-full flex-shrink-0">
      {elHasHerror.error && (
        <div className="text-center text-red-600">{elHasHerror.message}</div>
      )}
      {successMsg && (
        <div className="text-center text-green-600">{successMsg}</div>
      )}
      {(userData &&isEdit) &&
     
      <FormWrapper
        confirmButton="Update"
        regetButton="Annulla"
        handleSubmit={handleSubmit}
        handleReget={handleReget}
        courseName="courseName"
        courseLenght="courseLenght"
        courseStartYear="courseStartYear"
        courseEndYear="courseEndYear"
      >
        <InputField {...{...firstname,startingvalue:userData?.firstname ||""}} />
        <InputField {...{...lastname,startingvalue:userData?.lastname||""}} />
        <InputField {...{...phone,startingvalue:userData?.phone||""}} />
        <InputField {...{...age,startingvalue:userData?.age||""}} />
        <InputField {...{...fiscalcode,startingvalue:userData?.fiscalcode||""}} />
        <InputField {...{...email,startingvalue:userData?.email||""}} />
        <InputField {...{...password,startingvalue:userData?.password||""}} />
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
        <InputField {...firstname} />
        <InputField {...lastname} />
        <InputField {...phone} />
        <InputField {...age} />
        <InputField {...fiscalcode} />
        <InputField {...email} />
        <InputField {...password} />
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
