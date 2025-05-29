import { useState,useEffect,useRef } from "react"


export default function OutOfFormInputField({ref,type,setFormIsValid,label,id,name,whatIsRight,startingvalue,constrolExpression,...othProps}){
    const [value,setValue]=useState(startingvalue);
    const [error,setError]=useState(false);
 
    useEffect(()=>{
         if(constrolExpression.test(startingvalue)){
           setFormIsValid((prev)=>{
      return{
        ...prev,
        [name]:true
      } })
    }
    },[])
 

    function handleChage(e){
    setValue(e.target.value)
    const inputFieldControl=constrolExpression.test(e.target.value)
    //setFormIsValid(inputFieldControl)
     setFormIsValid((prev)=>{
        return{
           ...prev,
          [name]:inputFieldControl
        } 
     })
    console.log(constrolExpression.test(e.target.value))
    setError(!inputFieldControl)

    }

return(
  <div className="mb-4">
  <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
    {label}
  </label>
  <input
    ref={ref}
    type={type}
    id={id}
    name={name}
    value={value}
    onChange={handleChage}
    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
             appearance-none"
    required
    {...othProps}
  />
  <div className="mt-1 text-sm text-red-500">
    { error && whatIsRight}
  </div>
</div>
)

}