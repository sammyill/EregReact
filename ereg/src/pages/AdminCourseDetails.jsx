//dettagli del singolo corso dell' amminstratore 
//qui ci saranno anche i bottono che permettono di modificare e cancellare 
//oltre ai bottoni che permettono di tornare alla rispettiva pagina
//cioè course page
import { useLocation } from 'react-router-dom';
export default function AdminCourseDetails(){
    const location = useLocation();
  const { id } = location.state || {};

  return <div>ID from state: {id}</div>;

}