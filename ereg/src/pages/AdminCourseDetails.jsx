//dettagli del singolo corso dell' amminstratore 
//qui ci saranno anche i bottono che permettono di modificare e cancellare 
//oltre ai bottoni che permettono di tornare alla rispettiva pagina
//cioè course page
import { useLocation } from 'react-router-dom';
import { fetchHelper,fullName } from "../utilities";
import { useState,useEffect,useContext } from "react"
import { useNavigate } from 'react-router-dom';
import { EregContext } from "../contexts/EregContext";
import Button from '../components/Button';
const roleValues = [
  { idvalue: 1, labelvalue: "Studente" },
  { idvalue: 2, labelvalue: "Professore" },
  { idvalue: 3, labelvalue: "Coordinatore" },
  { idvalue: 4, labelvalue: "Super Admin" },
];
export default function AdminCourseDetails(){
  const [courseData,setCourseData]=useState(null);
  const [isError,setIsError]=useState({});
  const [deleteOn,setDeleteOn]=useState(false)
  const location = useLocation();
  const [editRole,setEditRole]=useState(false);
  const [choosenNewRole,setChoosenNewRole]=useState(null);
  const [reload,setReload]=useState(0);
  const [allUsers,setAllUsers]=useState(null);
  const [addAuser,setAddAUser]=useState(false);
  const [seletedUserToAAd,setSelectedUserToAdd]=useState({idUser:false,isRole:false})

 // const [userRole,setUserRole]=useState({id:false,us})
  const {token}=useContext(EregContext)
  const navigate = useNavigate();
  const { id } = location.state || {};
  useEffect(() => {
    async function fetchData() {
      const data = await fetchHelper('GET',`/getcourse/${id}`,token,"none");
      const allUsers=await  fetchHelper('GET',`/getallusers`,token,"none");
      if(data.error || allUsers.error) setIsError({error:true,message:"unexpected load error"})
      console.log("ALL THE USERES",allUsers);
      setCourseData(data);
      setAllUsers(allUsers.users);
    }
    if(id) fetchData();
  }, [id,reload]);

  const handleDelete=async ()=>{
    const data = await fetchHelper('DELETE',`/deletecourse/${id}`,token,"none");
    if(data.error) setIsError({error:true,message:"Errore cancellazione"})
    else {
      navigate("/admincoursespage")
    }
  }

  const resetAddUser = () => {
  setSelectedUserToAdd({ idUser: false, isRole: false });
  setAddAUser(false);
};


const onChangeNewUser = (e) => {
  setSelectedUserToAdd((prev) => ({ ...prev, idUser: e.target.value }));
};

const onChangeNewRole = (e) => {
  setSelectedUserToAdd((prev) => ({ ...prev, isRole: e.target.value }));
};

const handleAcceptAdd = async () => {

    if (!seletedUserToAAd.idUser || !seletedUserToAAd.isRole) return;
    const payload = {
      idcourse: Number(id),
      iduser: Number(seletedUserToAAd.idUser),
      idrole: Number(seletedUserToAAd.isRole),
    };

    console.log("payload",payload)
    const res = await fetchHelper("POST", `/connectuser`, token, payload);
    if (res?.error) {
      setIsError({ error: true, message: "Errore collegamento utente" });
      return;
    }
    // success -> refresh and reset mini-form
    setReload((prev) => prev + 1);
    resetAddUser();
};

  const handleUnlink=async (idUser)=>{
    const response=await  fetchHelper('DELETE',`/unlinkuser/${idUser}/${id}`,token,"none")
    console.log("response of unlink",response)
    setReload((prev)=>prev+1)
  }

  const handleChangeRole=async()=>{

    console.log("userid",choosenNewRole.userId);
    console.log("roleId",choosenNewRole.roleId);
    console.log("courseId",id);
    const data = await fetchHelper('PATCH',`/changeuserrole/${choosenNewRole.userId}/${choosenNewRole.roleId}/${id}`,token,"none");
    console.log("Data",data)
    setEditRole(false);
    setReload((prev)=>prev+1)
  }
  if(isError?.error)navigate("/errorpage")
  if(!courseData || !allUsers)return(<p>No data found</p>)
  
  const course = courseData?.courseData?.[0] || null;
  const users = courseData?.courseUsers || [];

  console.log("users",users)
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

      <div className="bg-white rounded-2xl shadow p-4 border border-gray-200">
  {addAuser ? (
    // Simple "Add user" button (opens the mini-form)
    <Button styleType={"standard"} onClick={() => setAddAUser(true)}>
      Aggiungi utente
    </Button>
  ) : (
    <div className="flex flex-col gap-3">
      {/* User select */}
      <div>
        <label htmlFor="newUser" className="block text-sm font-medium text-gray-700 mb-1">
          Utente
        </label>
        <select
          id="newUser"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          value={seletedUserToAAd.idUser || ""}
          onChange={onChangeNewUser}
        >
          <option value="" disabled>Seleziona utente</option>
          {(allUsers ?? []).map((u) => (
            <option key={u.id} value={u.id} className="text-black">
              {fullName(u.firstname, u.lastname)}
            </option>
          ))}
        </select>
      </div>

      {/* Role select */}
      <div>
          <label htmlFor="newRole" className="block text-sm font-medium text-gray-700 mb-1">
            Ruolo
          </label>
          <select
            id="newRole"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            value={seletedUserToAAd.isRole || ""}
            onChange={onChangeNewRole}
          >
            <option value="" disabled>Seleziona ruolo</option>
            {roleValues.map((r) => (
              <option key={r.idvalue} value={r.idvalue} className="text-black">
                {r.labelvalue}
              </option>
            ))}
          </select>
        </div>

        {/* Actions: Reject/Accept */}
        <div className="flex gap-3">
          {/* Reject: reset to false */}
          <Button styleType={"standard"} onClick={resetAddUser}>
            Annulla
          </Button>

          {/* Accept: calls POST /connectuser */}
          <Button
            styleType={"danger"}
            onClick={handleAcceptAdd}
            disabled={!seletedUserToAAd.idUser || !seletedUserToAAd.isRole}
            title={!seletedUserToAAd.idUser || !seletedUserToAAd.isRole ? "Seleziona utente e ruolo" : ""}
          >
            Aggiungi
          </Button>
        </div>
      </div>
    )}
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
        <Td>
        {editRole ?  
        <>
        <div className='flex flex-row align-middle justify-center gap-1'>
          <select 
            className="w-full px-4 py-2 border  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            name={"userrole"}
            id={"userrole"} 
            defaultValue={u.roleid} 
            onChange={(e)=>setChoosenNewRole({userId:u.id,roleId:e.target.value})}
            required
          >          
          {roleValues.map((role)=>{
            return <option className='text-black' key={role.idvalue} value={role.idvalue} >{role.labelvalue}</option>
          })}
          </select>
          <span  
            onClick={()=>{
              setEditRole(false);
              setChoosenNewRole(null)
            }}
            className="inline-flex h-10 w-10 items-center justify-center text-2xl font-bold text-red-600 border border-red-300 rounded-md hover:bg-red-50 cursor-default select-none leading-none"
          >{"\u2718"}</span>
          <span 
            onClick={handleChangeRole}
            className="inline-flex h-10 w-10 items-center justify-center text-2xl font-bold text-green-600 border border-green-300 rounded-md hover:bg-green-50 cursor-default select-none leading-none"
          >{"\u2713"}</span>  
          </div>
        </>:
        <>
          {u.rolename} <span style={{cursor:"pointer"}} onClick={()=>{
            setEditRole(true)
            setChoosenNewRole({userId:u.id,roleId:u.roleid})
            }}>&#9999;</span>
            <span style={{cursor:"pointer",marginLeft:"5px"}} onClick={()=>{
            handleUnlink(u.id)
            }}>&#x1F517;</span>
        </>}
      </Td>
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
        <Button styleType={"standard"} onClick={()=>setDeleteOn((prev)=>!prev)}>Annulla</Button>
        </>
        :<>
        <Button styleType={"danger"} onClick={()=>setDeleteOn((prev)=>!prev)}>Elimina</Button>
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