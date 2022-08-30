import React from 'react'
import {Link} from 'react-router-dom'

function NavBar({ getToken }) {
    return (
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark rounded-3 mx-2'>
            <div className='container-fluid ms-2'>
                <Link className='navbar-brand' to="/">Home</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                {(getToken())?(
                    <div className="navbar-nav">
                        {/* <Link className='nav-link' to="register">Register</Link> */}
                        <Link className='nav-link' to="logout">Logout</Link>
                        <Link className='nav-link' to="dashboard">Dashboard</Link>
                    </div>
                ):(
                    <div className="navbar-nav">
                        <Link className='nav-link' to="login">Login</Link>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default NavBar