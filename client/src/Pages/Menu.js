import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Axios from "axios";

import MenuComponent from '../Components/Menu';
import CartTable from '../Components/CartTable';

const Toast = Swal.mixin({
    toast: true, position: 'top-end', showConfirmButton: false, timer: 1000, timerProgressBar: true, customClass: "swal-dark",
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
}); 

function Menu() {
    const [backendData, setBackendData] = useState([{}]);
    const [orderData, setOrderData] = useState([{}]);

    const AddToCart = ({id, name}) => {
        const genOrderData = () => { return { id: id, count: 1 } }; 
        let order = (typeof orderData.products === "undefined") ? { products: [genOrderData()] } : { products: [...orderData.products] };
        if (typeof orderData.products !== "undefined") {
            // Search for order
            let loc = orderData.products.findIndex(orderP => orderP.id === id);
            if (loc >= 0) { order.products[loc].count++; }
            else { order.products.push(genOrderData()) }
        }
        setOrderData(order);

        // Notify the User 
        Toast.fire({ icon: 'success', titleText: `1 ${name} Added to Cart` });
    }

    const RemoveFromCart = ({id, name}) => {
        console.log('Remove')
        let order = (typeof orderData.products === "undefined") ? null : { products: [...orderData.products] };
        if (typeof order.products !== "undefined") {
            // Search for order
            let loc = order.products.findIndex(orderP => orderP.id === id);
            if (loc >= 0) { 
                if ((order.products[loc].count - 1) <= 0) {
                    order.products.splice(loc, 1);
                } else {
                    order.products[loc].count--; 
                }
            }
        }
        setOrderData((order.products && order.products.length > 0) ? order : {});

        // Notify the User 
        Toast.fire({ icon: 'info', titleText: `1 ${name} Removed From Cart` });
    }

    const SubmitOrder = () => {
        Swal.fire({
            title: 'Add Order',
            customClass: 'swal-dark',
            html: `<input type="text" id="name" class="swal2-input" placeholder="Name">`,
            confirmButtonText: 'Create Order',
            showCancelButton: true,
            focusConfirm: false,
            preConfirm: () => {
                const name = Swal.getPopup().querySelector('#name').value
                if (!name) { Swal.showValidationMessage(`Please Enter A Name For this Order`); }
                return { name: name };
            }
        }).then((result) => {
            let data = { name: result.value.name, products: orderData.products }; 
            
            let error = () => { Swal.fire({titleText: "Failed", customClass: 'swal-dark', icon: 'error'}); };
            Axios.post('/api', data).then(response => {
                if(response.data.success) {
                    setOrderData({});
                    Swal.fire({titleText: 'Success', customClass: 'swal-dark', icon: 'success'});
                } else {
                    error();
                }
            }).catch(error => {
                error();
            });
        });}


    // Load Products Initially 
    useEffect(() => {
        // Get Product Data 
        fetch('/api').then( response => response.json() )
        .then( data => { 
            if(data.success === true) setBackendData({ products: data.data }) 
            else Swal.fire({title: 'Failed to Load Menu', text: 'Try Refreshing', customClass: 'swal-dark'});
        });
    }, []);

    return (
        <div className="card text-bg-dark m-2 border-none">
            <div className="card-header text-center">
                <h1> Menu </h1>
            </div>

            {(typeof backendData.products === 'undefined') ? (
            <div className="card-body">
                <div className='card-header'>
                    <h2> Loading Menu...  </h2>
                </div>
            </div>
            ) : (
            <div className="card-body">
                <div>
                    <ul className="list-group mb-3">
                        <MenuComponent products={backendData.products} addHandler={AddToCart} />
                    </ul>
                </div>
                
                {(typeof orderData.products == 'undefined') ? 
                    (<div className='text-center'>Click the <i className="fa fa-plus text-success c-pointer hover-spin"></i> to add to your cart</div>) : 
                    (<CartTable products={backendData.products} cart={orderData.products} SubmitHandler={SubmitOrder} RemoveHandler={RemoveFromCart} />)
                }

                {/* <CartTable products={backendData.products} cart={orderData} SubmitHandler={SubmitOrder} RemoveHandler={RemoveFromCart} /> */}
            </div>
            )}
        </div>
    )
}

export default Menu