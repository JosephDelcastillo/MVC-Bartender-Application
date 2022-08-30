const { Reply } = require('../helpers/Helpers');
const { v4 } = require('uuid');
const mysql = require('mysql2');
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "bartender",
});

// **** Load Data ****
function loadMenuItems (sendFunc) {
    db.query('SELECT * FROM drinks', function (err, results) {
        sendFunc((err) ? new Reply({data: err}) : new Reply({data: results, success: true}));
    })
}

function getOrders (sendFunc) {
    const sql = `SELECT orders.*, COALESCE(SUM(order_products.count), 0) as count FROM bartender.orders 
        LEFT JOIN bartender.order_products ON orders.id = order_products.order_id GROUP BY orders.id ORDER BY orders.complete ASC, orders.id ASC`;
    db.query(sql, function (err, results) {
        sendFunc((err) ? new Reply({data: err}) : new Reply({data: results, success: true}));
    })
}

function getOrder (id, sendFunc) {
    const sql = `SELECT order_products.id as opID, order_products.count, drinks.* FROM bartender.order_products 
        LEFT JOIN bartender.drinks ON drinks.id = order_products.product_id 
        WHERE order_products.order_id = ?`;
    db.query(sql, [id], function (err, results) {
        sendFunc((err) ? new Reply({data: err}) : new Reply({data: results, success: true}));
    })
}

// **** Update Data **** 
function uploadOrder ({ name, products }, sendFunc) {
    const sql_insert_order = 'INSERT INTO orders (name) VALUES (?)';
    db.query(sql_insert_order, [name], (err, result) => {
        if(result) {
            const sql_get_id = 'SELECT id FROM orders WHERE name = ? ORDER BY id DESC LIMIT 1';
            db.query(sql_get_id, [name], (error, idResult) => {
                if(idResult) {
                    const order_id = idResult[0].id;
                    const sql_product = 'INSERT INTO order_products (product_id, order_id, count) VALUES (?, ?, ?)';
                    let worked = true;
                    products.forEach(({id, count}) => {
                        db.query(sql_product, [id, order_id, count], (errorInfo, results) => {
                            if(errorInfo) worked = false;
                        })
                    });
                    
                    if(worked) {
                        sendFunc( new Reply({data: {id: order_id}, success: true, point: 'Final Query'}) )
                    } else {
                        sendFunc( new Reply({data: error, point: 'Final Query'}) )
                    }
                } else {
                    sendFunc( new Reply({data: error, point: 'Order ID Query'}) )
                }
            }) 
        } else {
            sendFunc( new Reply({data: err, point: 'Initial Query'}) )
        }
    })
}

function updateOrder (id, state, sendFunc) {
    db.query('UPDATE orders SET orders.complete = ? WHERE orders.id = ?', [state, id], (err, results) => {
        sendFunc((err) ? new Reply({data: err}) : new Reply({data: results, success: true}));
    })
}

// *** Authorization ***
function attemptLogin ({username, password}, sendFunc) {
    db.query('SELECT id FROM users WHERE username = ? AND password = ? ', [username, password], function (err, results) {
        if(err) {
            sendFunc( new Reply({data: err}) );
        } else if(results) {
            if (results.length === 0) sendFunc( new Reply({data: 0, point: 'Authentication'}) );
            else {
                const token = v4();
                const sql_add_session = "INSERT INTO `sessions` (`user_id`, `key`) VALUES (?, ?)";
                db.query(sql_add_session, [results[0].id, token], (err, results) => {
                    if (err) {
                        sendFunc( new Reply({data: err, point: 'Session Query'}) );
                    } else {
                        sendFunc( new Reply({data: token, success: true}) );
                    } 
                })
            }
        } else {
            sendFunc( new Reply({data: {err: err, results: results}}) );
        }
    })
}


/**
 * Run Authorization 
 * @param {string} token Authorization Token
 * @param {Function} sendFunc To Return Data
 * @param {Function} successAction Action to do if authorized
 */
function runAuthorization (token, sendFunc, successAction) {
    db.query("SELECT * FROM bartender.sessions WHERE sessions.key LIKE ? ", [token], function (err, results) {
        if(err) {
            sendFunc( new Reply({data: err, point: 'Authorization Query'}) )
        } else if(results) {
            if(results === 0) sendFunc( new Reply({data: token, point: 'Authorization'}) );
            else successAction(sendFunc)
        } else {
            sendFunc( new Reply({data: {err: err, results: results}, point: 'Authorization Query'}) )
        }
    })
}

/**
 * Export Functions For Public Use Here 
 */
module.exports = {
    loadMenuItems,
    uploadOrder,
    attemptLogin,
    getOrders,
    getOrder,
    updateOrder,
    runAuthorization
};