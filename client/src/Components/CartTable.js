import React from 'react'
import Cart from './Cart'

function CartTable({ cart, products, SubmitHandler, RemoveHandler }) {
    return (
        <div id='cart'>
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
                    {(typeof cart !== 'undefined' && Object.entries(cart).length > 0) ? (
                        <Cart products={products} cart={cart} removeHandler={RemoveHandler} />
                    ) : ( 
                        <tr>
                            <td className='text-center' colSpan={5}>Your Cart is Currently Empty</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="btn btn-outline-success w-100" onClick={e => SubmitHandler()} id="submitOrderBtn">Submit Order</div>
        </div>
    )
}

export default CartTable