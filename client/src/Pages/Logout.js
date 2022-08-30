import React from 'react'

function Logout({ resetToken }) {
    resetToken();
    return (
        <div className='row' onLoad={window.location.pathname = ""}>
            <div className='col-12 text-center p-5'>
                <h1> Logout </h1>
            </div>
        </div>
    )
}

export default Logout