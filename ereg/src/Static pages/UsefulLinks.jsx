import { useState} from 'react';
const arrowDown="\u23EC";
const arrowUp="\u23EB";

const UsefulLinks = ({content,title}) => {
    const [showContent,setShowContent]=useState(new Array(content.length).fill(false))

    function handleContent(i){
      setShowContent((prev)=>{
        const newvalue=[...prev];
        newvalue[i]=!newvalue[i];
        return newvalue
      })
    }
  return (
    <div className="mx-auto w-[60vw] flex flex-col items-center justify-center">
      
      <div className="space-y-6  w-full">
        <h2 className="text-xl md:text-3xl font-semibold p-6 mb-8 text-center">{title}</h2>
        {content.map((faq, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg w-full break-all  "
          >
            <div className='flex flex-row justify-between'><h3 className="md:text-xl font-semibold text-gray-800 text-base  ">{faq.question}</h3> <span onClick={()=>handleContent(i)}>{showContent[i] ? arrowUp:arrowDown }</span></div>
            <p className="mt-2 text-gray-600 w-full break-all" style={{display:showContent[i] ? "inline":"none"}}>{faq.answer} </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsefulLinks;
