import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';



const ProfessionalDashboard = () => {

  const navigate = useNavigate()


  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
    return;
  }

  navigate("/login");
};


  return (
    <div>
        <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default ProfessionalDashboard
