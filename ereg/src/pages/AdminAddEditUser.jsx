

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


const firstname = {
  startingvalue: "",
  label: "Nome",
  type: "text",
  id: "firstname",
  name: "firstname",
  whatIsRight: "Between 5 and 100 characters,only letters",
  constrolExpression: /^.{5,100}$/,//mod
};


const lastname = {
  startingvalue: "",
  label: "Cognome",
  type: "text",
  id: "lastname",
  name: "lastname",
  whatIsRight: "Between 5 and 100 characters,only letters",
  constrolExpression: /^.{5,100}$/,//mod
};

const phone = {
  startingvalue: "",
  label: "Telefono",
  type: "text",
  id: "phone",
  name: "phone",
  whatIsRight: "insert italia phone number formata",
  constrolExpression: /^(?:\+?39|0039)?\s?(?:0\d{8,9}|3\d{8,9})$/,
};

const age = {
  startingvalue: 18,
  label: "Età",
  type: "number",
  id: "age",
  name: "age",
  whatIsRight: "between 5 and 75 year of age",
  constrolExpression: /^(?:[5-9]|[1-6]\d|7[0-5])$/,
};

const email = {
  startingvalue: "",
  label: "Email",
  type: "email",
  id: "email",
  name: "email",
  whatIsRight: "insert a valid mail format",
 constrolExpression: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
};

const fiscalcode = {
  startingvalue: "",
  label: "Codice fiscale",
  type: "text",
  id: "fiscalcode",
  name: "fiscalcode",
  whatIsRight: "Insert a valid italian fiscal code",
   constrolExpression: /^[A-Z]{6}\d{2}[A-EHLMPR-T]\d{2}[A-Z]\d{3}[A-Z]$/i,
};

const password={
    startingvalue:"", 
    label:"Password", 
    type:"password", 
    id:"password", 
    name:"password", 
    whatIsRight:"Min 10 char and  Max 20 char and contains at lease 1 uppercase,1 lovercase,1 number", 
    constrolExpression:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,20}$/
}

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
