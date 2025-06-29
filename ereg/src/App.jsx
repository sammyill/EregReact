//Dependencias
import { useContext } from 'react'
import { faqs } from "./staticdatas/faqdataset";  
import { privacyPolicy } from "./staticdatas/policydataset"; 
import {termsOfService} from "./staticdatas/termservice"
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { EregContext,EregContextProvider } from './contexts/EregContext';
//components
import Footer from "./components/Footer"
import Header from "./components/Header"
//Pages
import ErrorPage from "./Static pages/ErrorPage"
import Home from "./pages/Home"
import Courses from './pages/Courses';
import DevPage from './pages/DevPage';
import Login from './pages/Login';
import UsefulLinks from './Static pages/UsefulLinks'
import Students from './pages/Students';
import Professors from './pages/Professors';
import Calendar from './pages/Calendar';
import UserAccount from './pages/UserAccount';
import AdmincoursesPage from './pages/AdminCoursesPage';
import AdminCourseDetails from './pages/AdminCourseDetails';

import './App.css'

function AppRoutes() {
  const { isLoggedIn } = useContext(EregContext);
  console.log(isLoggedIn)

  return (
    <>
    
      {!isLoggedIn ?(<Routes>
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
      </Routes>):
      (<>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admincoursedetail" element={<AdminCourseDetails />} />
         <Route path="/admincoursespage" element={<AdmincoursesPage />} />
        <Route path="/devpage" element={<DevPage />} />
        <Route path="/account" element={<UserAccount />} />
        <Route path="courses" element={<Courses />} />
        <Route path="/students" element={<Students />} />
        <Route path="/professors" element={<Professors />} />
         <Route path="/calendar" element={<Calendar />} />
        <Route path="/faq" element={<UsefulLinks content={faqs} title="Frequently Asked Questions"/>} />
        <Route path="/privacy" element={ <UsefulLinks content={privacyPolicy} title="Privacy Policy"/>} />
        <Route path="/terms" element={<UsefulLinks content={termsOfService} title="Terms of Service"/>} />
        <Route path="/login" element={<Navigate to="/" replace />} /> 
        <Route path="/errorpage" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer/>
      </>)
      }
    </>
  );
}

function App() {
  return (
    <>
    <EregContextProvider>
      <AppRoutes />
    </EregContextProvider>
    </>
  )
}

export default App


/*
ELEMENTI BADE DA CREARE PER IL SITO DEL REGISTRO
Bottoni FATTO
Usercard FATTO
LessonCard FATTO
ModuleDescription  FATTO

ELEMENTI GENERALI PER TUTTO IL SITO
Navbar come Header   FATTO
Footer con le informazioni di base FATTO

IMPORTARE DATABASE E METTERE IL SERVER SU MACCHINA LOCALE

PAGINE SINGOLE
Pagina del loginfulLinks FATTA 
Pagina degli studenti
Pagina dei professri 
RIGUARDO LE PAGINE STUDENTI E PROFESSORI,solo l'amministratore può aggiungere studenti e professori
e dato che stai facendo il front end coordinatori e professori questa funzionalità non è disponibile
Pagina del singolo partecipante
Pagina del calendario
Pagina delle singole lezioni
Pagina Home FATTA
Pagina del singolo modulo

modificare la chiamata di tutti i moduli del backed,restituise sempre tutti i moduli
ma solo quelli attivi a tutti(eliminare la posibilità di poter disattivare i moduli)
verrà aggiunta in futuro da parte del moderatore

modificare il backend per la chiamata ricevi partecipanti,splittarla in due chiamate,
una per tutti gli studenti,una per tutti i professori.



*/

/*

<Navigate to="/login" replace state={{ from: 'protected', message: 'Please log in first' }} />

import { useLocation } from 'react-router-dom';

function Login() {
  const location = useLocation();
  const { from, message } = location.state || {};

  return (
    <div>
      {message && <p>{message}</p>}
     
    </div>
  );
}
*/