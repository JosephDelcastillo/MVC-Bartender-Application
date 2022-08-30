import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import OrderItem from '../Components/OrderItem';

/**
 * Dashboard Page 
 * @param {Function} param0 Get Logged In Token
 * @returns {React.Component}
 */
function Dashboard({ getToken }) {
    const [ backendData, setBackendData ] = useState({})

    function getOrder (token, id) {
        fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({key: token, id: id}) })
        .then( response => response.json())
        .then( data => { 
            if(data.success === true) {
                // Build View
                const genProduct = ({id, name, count}) => 
                `<li class='list-group-item list-group-item-action list-group-item-dark'>
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${id}. ${name}</h5>
                        <small>${count} Order${(count === 1)?'s':''}</small>
                    </div>
                </li>`;

                let html = '<ul class="list-group mb-3">';
                data.data.forEach(product => html += genProduct(product))
                html += '</ul>';
                
                Swal.fire({ title: `Order ${id}`, html: html, customClass: 'swal-dark' })
            } else {
                Swal.fire({title: 'Failed to Get Order', icon: 'error', customClass: 'swal-dark'})
            }
        });
    }

    function updateOrder (token, id, state) {
        fetch('/api/order', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({key: token, id: id, state: state}) })
        .then( response => response.json() )
        .then( data => (data.success === true) ? loadBackendData() : Swal.fire({title: 'Failed to Update Order', icon: 'error', customClass: 'swal-dark'}) );
    }

    function loadBackendData() {
        fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({key: getToken()}) })
        .then( response => response.json())
        .then( data => { (data.success === true) ? setBackendData(data.data) : Swal.fire({title: 'Failed to Get Orders Data', icon: 'error', customClass: 'swal-dark'})});
    }

    useEffect(() => {
        // Get Orders Data 
        loadBackendData();
    }, [])

    return (
        <div className="card text-bg-dark m-2 border-none">
            <div className="card-header text-center">
                <h1>Dashboard</h1>
            </div>
            <div className="card-body text-center">
                {(!Array.isArray(backendData)) ? (
                    <h2>Loading... </h2>
                ):(
                    <ul className="list-group mb-3">
                    {backendData.map(order => {
                        return <OrderItem key={order.id} order={order} token={getToken} getter={getOrder} updater={updateOrder} />
                    })}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default Dashboard