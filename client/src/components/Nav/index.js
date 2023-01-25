import React, { useState } from 'react';
import Auth from '../../utils/auth';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../App.css';

const Navigation = () => {

  //Get the page path
  let location = useLocation();
  let currentPage = location.pathname

  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  if (Auth.loggedIn()) {

    return (
      <section>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-1">
          <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarcontent" aria-controls="navbarcontent" aria-expanded={!isNavCollapsed ? true : false} aria-label="Toggle navigation" onClick={handleNavCollapse}>
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarcontent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link to="/" className={currentPage === '/' ? 'nav-link pt-0 pb-0 active' : 'nav-link pt-0 pb-0'} name="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link to="/users" className={currentPage === '/users' ? 'nav-link pt-0 pb-0 active' : 'nav-link pt-0 pb-0'} name="/usertable">User Table</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </section >
    );
  } else {
    return (
      <section>
      </section>
    )
  }
}

export default Navigation;
