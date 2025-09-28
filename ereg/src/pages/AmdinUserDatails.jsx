

//dettagli del singolo corso dell' amminstratore 
//qui ci saranno anche i bottono che permettono di modificare e cancellare 
//oltre ai bottoni che permettono di tornare alla rispettiva pagina
//cioè user page
import { useLocation } from 'react-router-dom';
import { fetchHelper,fullName } from "../utilities";
import { useState,useEffect,useContext } from "react"
import { useNavigate } from 'react-router-dom';
import { EregContext } from "../contexts/EregContext";
import Button from '../components/Button';

export default function AmdinUserDetails(){
  const [userData,setUserData]=useState(null);
  const [isError,setIsError]=useState({});
  const [deleteOn,setDeleteOn]=useState(false)
  const location = useLocation();
  const [reload,setReload]=useState(0);
  const [associatedCourse,setassociatedCourse]=useState(null);

  const {token}=useContext(EregContext)
  const navigate = useNavigate();
  const { id } = location.state || {};
  
  useEffect(() => {
    async function fetchData() {
      const data = await fetchHelper('GET',`/getsingleuser/${id}`,token,"none");
      if(data.error ) setIsError({error:true,message:"unexpected load error"})
      console.log(data)
      setUserData(data);
      setassociatedCourse(data.associatedcourses);
    }
    if(id) fetchData();
  }, [id,reload]);

  const handleDelete=async ()=>{
 
 
    const data = await fetchHelper('DELETE',`/deleteuser/${id}`,token,"none");
    console.log("DATA",data)
    if(data.error) setIsError({error:true,message:"Errore cancellazione"})
    else {
      navigate("/adminuserspage")
    }
  }

  if(isError?.error)navigate("/errorpage")
  if(!userData )return(<p>No data found</p>)
  
  const user = userData?.user?.[0] || null;
  const assCourses = userData?.associatedcourses || [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
    
      {/* user details */}
      {userData &&       <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        {(user.firstname  && user.lastname) ? fullName(user.firstname,user.lastname):"N/A"}
        </h1>
        <p className="text-gray-700">Telefono: {user?.phone || "N/A"} anni</p>
        <p className="text-gray-700">Età: {user?.age || "N/A"}</p>
        <p className="text-gray-700">Email: {user?.email || "N/A" }</p>
        <p className="text-gray-700">Codice Fiscale: {user?.fiscalcode || "N/A"}</p>
        <p className="text-gray-700">Stato: {user?.status === 1 ? "Attivo" : "Disattivo"}</p>
      </div> 
      }

      {/* Assicuate course table */}
    <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
        <tr>
        <Th>Nome</Th>
        <Th>Inizio</Th>
        <Th>Fine</Th>
        <Th>Ruolo</Th>
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
        {assCourses.length === 0 ? (
        <tr>
        <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">
        Nessun utente trovato.
        </td>
        </tr>
        ) : (
        associatedCourse.map((ass, idx) => (
        <tr key={idx}>
        <Td>{ass.name}</Td>
        <Td>{ass.startyear}</Td>
        <Td>{ass.endyear}</Td>
        <Td>{ass.rolename}</Td>
        </tr>
        ))
        )}
        </tbody>
     </table>
    </div>
      <div className=' flex flex-row align-middle justify-center space-x-30 '>
        {deleteOn ? 
        <>
        <Button  styleType={"danger"} onClick={handleDelete}>Conferma</Button>
        <Button styleType={"standard"} onClick={()=>setDeleteOn(false)}>Annulla</Button>
        </>
        :<>
        <Button styleType={"danger"} onClick={()=>setDeleteOn(true)}>Elimina</Button>
         <Button styleType={"standard"} onClick={()=>navigate(`/addEditCourse/${id}`)}>Modifica</Button>
        </>
        }
        {isError?.error&& <p>{isError.message}</p>}
       
      </div>
    </div>
  );
}

function Th({ children }) {
return (
<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
{children}
</th>
);
}


function Td({ children }) {
return <td className="px-4 py-3 text-sm text-gray-800">{children}</td>;
}