import React from 'react'

function MenuItem ({product, AddHandler}) {
    const { id, name, description, price } = product;
    return (
        <li className="list-group-item list-group-item-dark list-group-item-action" key={id} id={`${id}ProductItem`}>
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{id}. {name}</h5>
                <small>${price}ea</small>
            </div>
            <div className="mb-1 ps-5">
                <div className="d-flex w-100 justify-content-between">
                    <div>{description}</div>
                <small className='pe-3'> 
                    <i onClick={e => AddHandler({id, name})} className='fa fa-plus text-success hover-spin'></i> 
                </small>
                </div>
            </div>
        </li>
    )
}

export default MenuItem