//qui passera una form action invece e invece di sibmit avrai action

export default function SimpleFormWrapper({rejectLabel,confirmLabel,handleSubmit,handleReject,children,...othprops}){

    return(
      <div className="w-[30vw] m-auto h-[100vh] flex flex-col align-middle justify-center">
        <form onSubmit={handleSubmit}>
         {children}
         <div className="flex flex-row justify-around items-center">
         <Button styleType={"standard"} type="submit">{confirmLabel}</Button>
         <Button styleType="execute" type="button" onClick={handleReject}>{rejectLabel}</Button>
        </div>
         
        </form>
      </div>
    )
}
