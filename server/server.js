"use strict";

// Imports
const bodyParser = require('body-parser');
const express = require("express");
const mysql = require('mysql2');
const data = require('./controllers/Data')

// Initializations 
const PORT = 5000;
const app = express();
const Data_Controller = data;

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "bartender"
});

// Configure App 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Api Navigation
 */
// Root Level - Public Access Functions 
// Menu
app.get("/api", (req, res) => {
    Data_Controller.LoadMenuItems((data) => res.json(data));
})
app.post("/api", (req, res) => {
    Data_Controller.SubmitOrder(req.body, (data) => res.json(data));
})
// Login 
app.post("/api/user", (req, res) => {
    Data_Controller.AttemptLogin(req.body, (data) => res.json(data));
})

// User Level - Authorized At Controller 
// GET Orders
app.post("/api/orders", (req, res) => {
    Data_Controller.GetOrders(req.body, (data) => res.json(data));
})
// GET Order 
app.post("/api/order", (req, res) => {
    Data_Controller.GetOrder(req.body, (data) => res.json(data));
})
// POST Update Order (Product)
app.put("/api/order", (req, res) => {
    Data_Controller.UpdateOrder(req.body, (data) => res.json(data));
})

// TODO: Build These 


/**
 * Finally Start the App 
 */
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})