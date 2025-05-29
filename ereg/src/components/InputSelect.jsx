
export default function InputSelect({label,id,name,values,selectedvalue}){
 
return(
  <div className="mb-4">
  <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
    {label}
  </label>
  <select 
   className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
   name={name}
   id={id} 
   defaultValue={selectedvalue} required>
   {values.map((val)=>{
    return <option key={val.idvalue} value={val.idvalue} >{val.labelvalue}</option>
   })}
  </select>

</div>
)

}


/*
OLD OPTIONS 
<option key={val} value={val.idvalue} defaultValue={val===selectedvalue }>{val.labelvalue}</option>
 */
/*
<label for="pet-select">Choose a pet:</label>

<select name="pets" id="pet" >
  <option value="dog">Dog</option>
  <option value="cat" selected>cat</option>
  <option value="hamster">Hamster</option>
  <option value="parrot">Parrot</option>
  <option value="spider">Spider</option>
  <option value="goldfish">Goldfish</option>
</select>
 */