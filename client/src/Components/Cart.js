import React from 'react'
import CartItem from './CartItem'

function Cart({ products, cart, removeHandler }) {
    return (
        Object.keys(cart).map(cur_key => {
            if(cur_key > 0) {
                return <CartItem key={cur_key} product={products.find(prod => Number(prod.id) === Number(cur_key))} count={cart[cur_key]} deletionHandler={removeHandler} />
            } else {
                return null
            }
        })
    )
}

export default Cart