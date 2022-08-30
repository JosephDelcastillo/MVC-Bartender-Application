import React from 'react'
import MenuItem from './MenuItem'

function Menu({ products, addHandler }) {
    return (
        products.map(product => {
            return <MenuItem key={product.id} product={product} AddHandler={addHandler} />
        })
    )
}

export default Menu