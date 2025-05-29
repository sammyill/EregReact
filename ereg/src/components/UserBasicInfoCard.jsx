import { fullName } from "../utilities";
import { fetchHelper } from "../utilities";
import { useContext,useState,useRef } from "react";
import { EregContext } from "../contexts/EregContext";
import { passwortInput } from "./formsdasates";
import OutOfFormInputField from "./OutOfFormInputField";
import Button from "./Button";

const resoultMessage={
    success:{
        classColor:"ml-1 text-green-600 ",
        message:"Password changed"
    },
    failure:{
        classColor:"ml-1 text-red-600",
        message:"Error"
    },
    standard:{
        classColor:"",
        message:""
    }
}




export default function UserBasicInfoCard ({userData,selectedUserID,role,firstname,lastname,email,phone,age,imgurl}) {
  const [isSettingPassword,setIsSettingPassword]=useState(false)
  const [pwHasBeenChanged,setPvHasBeenChanged]=useState("standard");
  const [passwordIsValid,setPasswordIsValid]=useState({password:false})
 const passwordValue = useRef(null);
 const {token}=useContext(EregContext)

  console.log(userData)
  console.log(`ECCO I NOMI ${firstname} ${lastname}`)
  const {user}=useContext(EregContext) 

  function handleISSettingPassword(value){
     setIsSettingPassword(value)
     if(value===false) setPasswordIsValid({password:false})
  }

  async function handleChangePassword(){
    const userrequest={
    password:passwordValue.current.value
    }
    const data = await fetchHelper('PATCH',`/changepw`,token,userrequest);
    if(data.error===true) {
    setPvHasBeenChanged("failure")
    }else {
    setPvHasBeenChanged("success")
    }
    setIsSettingPassword(false);
    setPasswordIsValid({password:false})
  }


  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="bg-gray-100 p-4 border-b rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2 text-gray-600">&#8505;</span>
            <h2 className="text-lg font-bold text-gray-700">User Info</h2>
          </div>
          <div>
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded capitalize">
            {role}
            </span>
          </div>
        </div>
        <div className="flex p-4">
          <div className="w-1/3 pr-4">
            <img
              src={imgurl}
              alt={`${fullName(firstname,lastname)}`}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
          <div className="w-2/3 space-y-2">
            <p><strong>Name:</strong> {fullName(firstname,lastname)}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Age:</strong> {age}</p>
            {user.iduser===selectedUserID && !isSettingPassword &&
            <p>
              <strong>Reset Password:</strong>
              <button onClick={()=>handleISSettingPassword(true)} className="ml-2 text-blue-600 text-lg hover:cursor-pointer " >&#128274;</button>
            <span className={resoultMessage[pwHasBeenChanged].classColor} >{resoultMessage[pwHasBeenChanged].message}</span>
            </p>} 
            {user.iduser===selectedUserID && isSettingPassword &&
            <p>
              <OutOfFormInputField  ref={passwordValue} {...{...passwortInput,startingvalue:""}} setFormIsValid={setPasswordIsValid}/>
              <div>
              <Button styleType={(passwordIsValid.password ) ? "standard":"disabled"} onClick={handleChangePassword}>Reset</Button>
              <Button styleType="standard" onClick={()=>handleISSettingPassword(false)}>Cancel</Button>
              </div> 
            </p>}

          </div>
        </div>
      </div> 
      </>
  );
};


