import React from 'react';
import NavBar from './Components/NavBar';
import RouteController from "./Controller/RouteController";

const LOCAL_STORAGE_KEY = 'bartender.user';

function setToken(userToken) { sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userToken)); }
function getToken() { return sessionStorage.getItem(LOCAL_STORAGE_KEY); }
function resetToken () { sessionStorage.removeItem(LOCAL_STORAGE_KEY); }

function App() {
  return (
    <div className='container'>
      <NavBar getToken={getToken} />
      <div className='card text-bg-dark m-2'>
        <RouteController getToken={getToken} setToken={setToken} resetToken={resetToken}  />
      </div>
    </div>
  )
}

export default App