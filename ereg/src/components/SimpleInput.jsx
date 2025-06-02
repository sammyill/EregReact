import {useState} from "react"


export default function simpleInput({inputType,
                                  errorMessage="",
                                  type,
                                  name,
                                  label,
                                  initialValue,
                                  selectOptions,
                                  ...othProps}){
const [value,setValue]=useState(initialValue);

function handleChage(e){
setValue(e.target.value)
}

if(inputType==="select") return(
  <div className="mb-4">
  <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
  <select 
   className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
   name={name}
   defaultValue={selectOptions.defaultValue} required {...othProps} >
   {selectOptions.values.map((val)=> <option key={val.idvalue} value={val.idvalue} >{val.labelvalue}</option>)}
   </select>
</div>)



if(inputType==="textarea") return(
  <div className="mb-4">
  <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
  <textarea name={name} value={value} onChange={handleChage}
    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
             appearance-none"
    required {...othProps}/>
  <div className="mt-1 text-sm text-red-500">{errorMessage}</div>
</div>)

if(inputType==="input") return(
  <div className="mb-4">
  <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
  <input name={name} type={type} value={value} onChange={handleChage}
    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
             appearance-none"
    required {...othProps} />
  <div className="mt-1 text-sm text-red-500">{errorMessage}</div>
</div>)

}