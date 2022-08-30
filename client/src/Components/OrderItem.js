import React from 'react';
import { v4 } from 'uuid';

function OrderItem({order, token, getter, updater}) {
    const {id, name, count, complete} = order;
    const key = id + 'OrderItem';
    const comp = (trueCase, falseCase) => (complete === 1) ? trueCase : falseCase;
    return (
        <li className={`list-group-item list-group-item-action list-group-item-${comp('success','dark')}`} id={key}>
            <div className="d-flex w-100 justify-content-between" onClick={e => getter(token(), id)}>
                <h5 className="mb-1">{id}. {name}</h5>
                <small>{count} Product{(count === 1)?'s':''}</small>
            </div>
            <div className="mb-1 ps-5">
                <div className="d-flex w-100 justify-content-between">
                    <div onClick={e => getter(token(), id)}>{comp('','Not')} Complete</div>
                    <div className='pe-3'> 
                        <i onClick={e => updater(token(), id, comp(0, 1))} title="Mark Complete" className={`fa fa-circle-${comp('minus','check')} text-${comp('danger','success')} c-pointer me-2`}></i> 
                        <i onClick={e => getter(token(), id)} className='fa fa-info-circle text-info c-pointer'></i> 
                    </div>
                </div>
            </div>
        </li>
    )
}

export default OrderItem