import { useState } from "react"


export default function SearchField({setSearchedData,startingData,searchField,searchLabel}){
    const [value,setValue]=useState(""); 

    function handleChage(e){
    const newValue = e.target.value.toLowerCase();
    setValue(newValue);
    console.log(newValue)
    setSearchedData((prev)=>{
        console.log("prev");
        console.log (prev)
        return startingData.filter((el)=>el[searchField].toLowerCase().includes(newValue));
    })

    }

return(
  <div className="mb-4">
  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1 text-center">
    Search({searchLabel})
  </label>
  <input
    type="text"
    id="search"
    name="search"
    value={value}
    onChange={handleChage}
    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
             appearance-none"
  />
</div>
)

}