import React from 'react';
import { Routes, Route } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import NotFoud from "../Pages/NotFound";
// import Register from '../Pages/Register';
import Login from '../Pages/Login';
import Logout from '../Pages/Logout';
import Menu from '../Pages/Menu';

export default class RouteController extends React.Component {
    render() {
        return (
            <div className='container'>
            <Routes>
                <Route path="/" element={<Menu />} />
                {/* <Route path="/register" element={<Register />} /> */}
                {(this.props.getToken())?(<>
                    <Route path="/logout" element={<Logout resetToken={this.props.resetToken} />} />
                    <Route path="/dashboard" element={<Dashboard getToken={this.props.getToken} />} />
                </>):(<></>)}
                <Route path="/login" element={<Login getToken={this.props.getToken} setToken={this.props.setToken} />} />
                <Route path="*" element={<NotFoud />} />
            </Routes>
            </div>
        );
    }
}