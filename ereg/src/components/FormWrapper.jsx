import { useState } from "react";
import Button from "./Button";
import InputField from "./InputField";
import TextArea from "./textArea";
import { Children, cloneElement } from 'react';

export default function FormWrapper({regetButton,confirmButton,handleSubmit,handleReget,children,...othprops}){
    const [formIsValid,setFormIsValid]=useState(Object.values(othprops).reduce((avi,mykey)=>{
      avi[mykey]=false;
      return avi
      },{}))

  
  const enhancedChildren = Children.map(children, child => {
  if (child.type === InputField || child.type === TextArea) { 
    console.log("done")
     return cloneElement(child, {
        setFormIsValid 
     });
    }
    return child;
  });
 
 
    const isFormValid=Object.values(formIsValid).every((input)=>input===true)
    return(
      <div className="w-[30vw] m-auto h-[100vh] flex flex-col align-middle justify-center">
        <form onSubmit={handleSubmit}>
         {enhancedChildren}
         <div className="flex flex-row justify-around items-center">
         <Button styleType={(isFormValid) ? "standard":"disabled"} type="submit">{confirmButton}</Button>
         <Button styleType="execute" type="button" onClick={handleReget}>{regetButton}</Button>
        </div>
         
        </form>
      </div>
    )
}

/*

Alternative code for inpute wrapper

FormWrapper({presentFields,presentFieldsInputs})
    const [formIsValid,setFormIsValid]=useState(presentFields.reduce((avi,mykey)=>{
      avi[mykey]=false;
      return avi
      },{}))

   return(
      <div className="w-[30vw] m-auto h-[100vh] flex flex-col align-middle justify-center">
        <form onSubmit={handleSubmit}>
         {presentFieldsInputs.map((inputAttributes)=>{
          <InputField {...inputAttributes}  setFormIsValid={setFormIsValid}/>
          })}
         <Button styleType={(Object.values(formIsValid).every((input)=>input===true)) ? "standard":"disabled"} type="submit">Login</Button>
        </form>
      </div>
    )
*/