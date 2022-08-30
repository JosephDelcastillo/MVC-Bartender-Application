/**
 * Data Controller
 * 
 * Manages Database Data
 */
const { Reply } = require('../helpers/Helpers');
const Data_model = require('../models/Data')

/* Public Functions  */
// Get Menu
function LoadMenuItems (sendFunc) { Data_model.loadMenuItems(sendFunc); }
// Submit Order
function SubmitOrder (data, sendFunc) {
    if( !(data.name && data.products) ) sendFunc(new Reply({data: data, point: 'Missing Input'}))
    if( typeof data.name !== 'string' || !Array.isArray(data.products) ) sendFunc(new Reply({data: data, point: 'Input Type'}))
    Data_model.uploadOrder(data, sendFunc);
}
// Attempt Login
function AttemptLogin (data, sendFunc) {
    Data_model.attemptLogin(data, sendFunc);
}

// User Access Required 
// Get all Orders
function GetOrders (data, sendFunc) {
    AuthorizeUser (data.key, sendFunc, Data_model.getOrders)
}

// Get Order Products
function GetOrder (data, sendFunc) {
    AuthorizeUser (data.key, sendFunc, (sender) => { Data_model.getOrder(data.id, sender) })
}

// Update Order Completion Status 
function UpdateOrder (data, sendFunc) {
    AuthorizeUser (data.key, sendFunc, (sender) => { Data_model.updateOrder(data.id, data.state, sender) })
}


/**
 * Authorize User 
 * @param {String} key Authorization Key
 * @returns {Reply} Authentication Reply 
 */
function AuthorizeUser (key, sendFunc, successAction) {
    Data_model.runAuthorization(key.replace(/[^0-9a-zA-z\-]/g,''), sendFunc, successAction);
}

module.exports = { 
    LoadMenuItems,
    SubmitOrder,
    AttemptLogin,
    GetOrders,
    GetOrder,
    UpdateOrder
};