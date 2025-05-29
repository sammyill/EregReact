
import { useState } from "react";
import Button from "../components/Button";
import { fullName } from "../utilities";

export default function UserCard({firstName,lastName,imgSource,userRole,userID,handleFullInfoClick}){
    const fullname=fullName(firstName,lastName);

    function handleFullInfoButtonClick(){
          handleFullInfoClick(userID,userRole);
    }

    
    return (
    <div className="w-45 md:w-60 h-60 md:h-80 rounded-lg overflow-hidden  flex flex-col justify-center items-center">
        <div><img className="w-36 md:w-48 h-36 md:h-48 object-cover rounded-4xl" src={imgSource} alt={`image of  ${fullname}`} /></div>
        <div className="px-3 md:px-6 py-2 md:py-4  flex flex-col justify-center items-center">
            <div className="font-bold text-sm md:text-xl mb-2 text-gray-800  text-center">{`${userRole.slice(0,1).toUpperCase()}${userRole.slice(1,4)}. ${fullname} `}</div>
            <Button styleType="standard" onClick={handleFullInfoButtonClick}>Full info</Button>
        </div>
    </div>
  
    )
}