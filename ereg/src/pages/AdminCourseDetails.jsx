//dettagli del singolo corso dell' amminstratore 
//qui ci saranno anche i bottono che permettono di modificare e cancellare 
//oltre ai bottoni che permettono di tornare alla rispettiva pagina
//cioè course page
import { useLocation } from 'react-router-dom';
import { fetchHelper } from "../utilities";
import { useState,useEffect,useContext } from "react"
import { useNavigate } from 'react-router-dom';
import { EregContext } from "../contexts/EregContext";

export default function AdminCourseDetails(){
  const [courseData,setCourseData]=useState(null);
  const [isError,setIsError]=useState({});
  const location = useLocation();
     const {token}=useContext(EregContext)
   const navigate = useNavigate();
  const { id } = location.state || {};
  useEffect(() => {
    async function fetchData() {
      const data = await fetchHelper('GET',`/getcourse/${id}`,token,"none");
      console.log(data)
       if(data.error) setIsError({error:true,message:"unexpected load error"})
      setCourseData(data);
    }
    if(id) fetchData();
  }, [id]);

  if(isError?.error)navigate("/errorpage")
  if(!courseData)return(<p>No data found</p>)
  
    const course = courseData?.courseData?.[0] || null;
const users = courseData?.courseUsers || [];
return (
  <div className="p-6 max-w-5xl mx-auto space-y-6">
  {/* Course details */}
  <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
  <h1 className="text-2xl font-semibold text-gray-900 mb-2">
  {course?.name || "Corso"}
  </h1>
  <p className="text-gray-700">Durata: {course?.lenght} anni</p>
  <p className="text-gray-700">Inizio: {course?.startyear}</p>
  <p className="text-gray-700">Fine: {course?.endyear}</p>
  <p className="text-gray-700">Stato: {course?.status === 1 ? "Attivo" : "Disattivo"}</p>
  </div>


  {/* Users table */}
  <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
  <table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-gray-50">
  <tr>
  <Th>Nome</Th>
  <Th>Cognome</Th>
  <Th>Email</Th>
  <Th>Ruolo</Th>
  </tr>
  </thead>
  <tbody className="divide-y divide-gray-100 bg-white">
  {users.length === 0 ? (
  <tr>
  <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">
  Nessun utente trovato.
  </td>
  </tr>
  ) : (
  users.map((u, idx) => (
  <tr key={idx}>
  <Td>{u.firstname}</Td>
  <Td>{u.lastname}</Td>
  <Td>{u.email}</Td>
  <Td>{u.rolename}</Td>
  </tr>
  ))
  )}
  </tbody>
  </table>
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