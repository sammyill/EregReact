import { useState,useContext } from "react";
import { EregContext } from "../contexts/EregContext";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { passwortInput,emailInput } from "../components/formsdasates";
import { fetchHelper } from "../utilities";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const [data,setData]=useState("");
  const {setEreg}=useContext(EregContext)
  const [formIsValid,setFormIsValid]=useState({
        password:false,
        email:false
    })
  const navigate = useNavigate();

    let wrongLoginData=false;
    const handleSubmit = async (e) => {
    e.preventDefault()
    try {
          const data = await fetchHelper("POST",`/login`,"",{
            email: e.target.email.value,
            password:e.target.password.value
          })
          if(data.error===false) {
            console.log("fethed data");
            console.log(data)
            setEreg(data)
            navigate("/")
          }
          setData(data)
    } catch (err) {
         console.log(err.message)
    }
    }
    if(data.error===true) wrongLoginData=true; 

    return(
      <div className="w-[30vw] m-auto h-[100vh] flex flex-col align-middle justify-center">
        <div className="font-bold text-center text-2xl mb-5 rounded-2xl">Accedi al tuo account</div>
        
        <form onSubmit={handleSubmit} className="flex flex-col align-middle justify-center">
         <InputField {...passwortInput} setFormIsValid={setFormIsValid}/>
         <InputField {...emailInput} setFormIsValid={setFormIsValid}/>
         {wrongLoginData && <div className="text-white text-center text-xl mb-5 bg-red-500 rounded-2xl">Email o password errati</div>}
         <Button styleType={(formIsValid.password && formIsValid.email) ? "standard":"disabled"} type="submit">Login</Button>
        </form>
      </div>
    )
}

