import React from 'react'
import CartItem from './CartItem'

function Cart({ products, cart, removeHandler }) {
    return (
        cart.map(({id, count}) => {
            if(id > 0) {
                return <CartItem key={id} product={products.find(prod => Number(prod.id) === Number(id))} count={count} deletionHandler={removeHandler} />
            } else {
                return null
            }
        })
    )
}

export default Cart