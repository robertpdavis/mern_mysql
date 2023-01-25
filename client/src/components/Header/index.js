import { Link, useNavigate } from 'react-router-dom';
import '../../App.css'
import Auth from '../../utils/auth';
import { Person } from 'react-bootstrap-icons';


const Header = () => {

  let navigate = useNavigate();

  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
    navigate("login");
  };

  const profile = (event) => {
    event.preventDefault();
    navigate("profile");
  };

  return (
    <header className="container align-center">
      <div className="row">
        <Link to="/" className="nolink"><h3 className="d-inline">MERN Stack App</h3></Link>
        {Auth.loggedIn() ? (
          <>
            <div className="d-inline">
              <h6 className="d-inline">Welcome {Auth.getProfile().data.firstname}!</h6>
              <div className="d-inline float-end">
                <button className="btn" onClick={profile} title="My Profile"><Person size={30} /></button>
                <button className="d-inline btn btn-sm btn-secondary mb-1" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
          </>
        ) :
          <>
            <h6> MERN stack with MySQL support, GraphQL & Appollo server for API management & JWT for auth token.</h6>
          </>
        }
      </div>
    </header >
  );
};

export default Header;
