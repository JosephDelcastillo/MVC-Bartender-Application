import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Axios from "axios";
import $ from 'jquery';

import MenuComponent from '../Components/Menu';
import CartTable from '../Components/CartTable';

const LOCAL_STORAGE_KEY = 'bartender.orderData';

const Toast = Swal.mixin({
    toast: true, position: 'top-end', showConfirmButton: false, timer: 1000, timerProgressBar: true, customClass: "swal-dark",
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
})

function Menu() {
    const [backendData, setBackendData] = useState([{}]);
    const [orderData, setOrderData] = useState({});

    const UpdateCart = (newList) => {
        if(newList) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList));
        } else {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orderData));
        }

        // Show Or Hide Cart
        if(orderData && Object.entries(orderData).length > 0) $('#cart').show()
        else $('#cart').hide()
    }

    const AddToCart = ({id, name}) => {
        // Setup Data 
        let newList = orderData;
        // Add or Increment
        newList[id] = (typeof newList[id] === 'undefined') ? 1 : newList[id] + 1;
        // Set New Data
        setOrderData(newList);

        // Update Cart Storage and Visual
        UpdateCart();

        // Notify the User 
        Toast.fire({ icon: 'success', titleText: `1 ${name} Added to Cart` }).then(() => { window.location.reload() });
    }

    const RemoveFromCart = ({id, name}) => {
        // Setup Data 
        let newList = orderData;
        // Remove or Decrement
        if(newList[id] > 1) {
            newList[id]--;
        } else {
            delete newList[id];
        }
        // Set New Data
        setOrderData(newList);

        // Update Front-End Visuals
        UpdateCart(newList);

        // Notify the User 
        Toast.fire({ icon: 'success', titleText: `1 ${name} Removed From Cart` }).then(() => { window.location.reload() });
    }

    // Submit Cart 
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
            let arr = [];
            Object.entries(orderData).map((e) => { return arr.push({id: e[0], count: e[1]}) })
            let data = { name: result.value.name, products: arr }; 
            
            let error = () => { Swal.fire({titleText: "Failed", customClass: 'swal-dark', icon: 'error'}); };
            Axios.post('/api', data).then(response => {
                if(response.data.success) {
                    UpdateCart({});
                    Swal.fire({titleText: 'Success', customClass: 'swal-dark', icon: 'success'}).then(() => {
                        window.location.reload()
                    });
                } else {
                    error();
                }
            }).catch(error => {
                error();
            });
        });
    }

    // Load Products Initially 
    useEffect(() => {
        // Get Order Data
        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        if(typeof local !== "undefined") {
            try {
                const newOrderData = JSON.parse(local);
                if(newOrderData) setOrderData(newOrderData);
            } catch (e) {
                Swal.fire({ title: "Error Getting Data", icon: 'error', customClass: 'swal-dark' })
            }
        }

        // Get Product Data 
        fetch('/api').then( response => response.json()
        ).then( data => { 
            if(data.success === true) setBackendData({ products: data.data }) 
            else Swal.fire({title: 'Failed to Load Menu', text: 'Try Refreshing', customClass: 'swal-dark'});
        });
    }, []);

    // Generate Page 
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

                <CartTable products={backendData.products} cart={orderData} SubmitHandler={SubmitOrder} RemoveHandler={RemoveFromCart} />
                {/* <div id='cart'>
                    <div className='card-header'>
                        <h3> Cart </h3>
                    </div>
                    <table className="table table-dark table-striped table-hover mb-3">
                        <thead>
                            <tr>
                                <th scope='col'>Name</th>
                                <th scope='col' className='text-center'>Price</th>
                                <th scope='col' className='text-center'>Quantity</th>
                                <th scope='col' className='text-center'>SubTotal</th>
                                <th scope='col' className='text-center'>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof orderData !== 'undefined' && Object.entries(orderData).length > 0) ? (
                                <Cart products={backendData.products} cart={orderData} removeHandler={RemoveFromCart} />
                            ) : ( 
                                <tr>
                                    <td className='text-center' colSpan={5}>Your Cart is Currently Empty {Object.entries(orderData).length}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="btn btn-outline-success w-100" onClick={e => SubmitOrder()} id="submitOrderBtn">Submit Order</div>
                </div> */}
            </div>
            )}
        </div>
    )
}

export default Menu