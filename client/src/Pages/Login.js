import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

async function loginUser(credentials) {
  return fetch('/api/user', 
  { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) }
  ).then(data => data.json())
}

export default function Login({ getToken, setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  
  if(getToken()) {
    return (
      <Navigate to="/dashboard" />
    )
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      username, password
    });
    if(token.success) {
      setToken(token.data);
      window.location.pathname = "dashboard";
    } else {
      Swal.fire({title: "Login Failed", icon: 'error', customClass: 'swal-dark'})
    }
  }

  return(
    <div className="card text-bg-dark m-2 border-none">
      <div className="card-header text-center">
        <h1>Log In</h1>
      </div>
      <div className="card-body text-center">
        <form onSubmit={handleSubmit}>
          <div className="mb-3 col-4 mx-auto">
            <label className="form-label">Username</label>
            <input className="form-control" autoComplete="off" type="text" onChange={e => setUserName(e.target.value)} />
          </div>
          <div className="mb-3 col-4 mx-auto">
            <label className="form-label">Password</label>
            <input className="form-control" autoComplete="off" type="password" onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <button className="btn btn-outline-primary col-3" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};