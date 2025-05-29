
const buttonClasses={
    disabled:"opacity-50 hover:bg-gray-800 text-xs md:text-base bg-white text-gray-800 hover:text-white font-bold px-6 py-2  border-gray-800 border rounded cursor-not-allowed",
    standardBlack:"hover:bg-black  text-xs md:text-base bg-white text-black hover:text-white font-bold px-6 py-2  border-black border rounded ",
    standard:"hover:bg-blue-800 text-xs md:text-base bg-white text-blue-800 hover:text-white font-bold px-6 py-2  border-blue-800 border rounded ",
    standardIntegrated:"hover:bg-blue-500 text-xs md:text-base bg-white text-blue-500 hover:text-white font-bold px-4 py-2  border-blue-500 border-top rounded",
    standardTiny:"px-4 py-2 bg-white text-white rounded border border-blue-500 hover:bg-green-600 transition",
    danger:"hover:bg-red-500 bg-white  md:text-base text-xs text-red-500 hover:text-white font-bold px-6 py-2  border-red-500 border rounded ",
    dangerIntegrated:"hover:bg-red-500 text-xs md:text-base bg-white text-red-500 hover:text-white font-bold px-4 py-2  border-red-500 border-top rounded",
    execute:"hover:bg-green-600 bg-white md:text-base text-xs text-green-600 hover:text-white font-bold px-6 py-2  border-green-600 border rounded ",
    executeIntegrated:"hover:bg-green-600 text-xs md:text-base bg-white text-green-600 hover:text-white font-bold px-6 py-2  bg-green-600 border-top rounded"
}

export default function Button({children,styleType,...othProps}){
    return (

        <button className={buttonClasses[styleType]} disabled={styleType==="disabled"? true:false} {...othProps} >{children}</button>
        
        
    )
}