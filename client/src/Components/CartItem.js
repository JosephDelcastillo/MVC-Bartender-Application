import React from 'react'

function CartItem({product, count, deletionHandler}) {
    return (
        <tr>
            <th style={{ width: '30%' }}> {product.name} </th>
            <td className="text-center"> $ {product.price} ea </td>
            <td className="text-center"> {count} </td>
            <td className="text-center"> $ {product.price * count} </td>
            <td className="text-center"><i onClick={e => deletionHandler(product)} className='fa fa-minus text-danger c-pointer hover-spin'></i></td>
        </tr>
    )
}

export default CartItem