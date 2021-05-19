require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require("express-fileupload");

//set up db, SQL query builder
const { production } = require('./knexfile')
const { development } = require('./knexfile')
const { test } = require('./knexfile')

let environment
if (process.env.NODE_ENV === 'test') {
    environment = test
} else if (process.env.NODE_ENV === 'production') {
    environment = production
} else {
    environment = development
}

const knex = require('knex')(environment)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_DOMAIN,
    credentials: true
}))
app.use(fileUpload());

//set up routers
const routerApi = require('./routers/routerApi')(express, knex);
const routerUsers = require('./routers/routerUsers')(express, knex);

app.use('/users', routerUsers);
app.use('/api', routerApi);


module.exports = app