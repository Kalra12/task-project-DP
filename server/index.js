require('dotenv').config()
const express = require('express')
const router = express.Router()
const routes = require("./routes")
const connectDB = require('./connection')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
connectDB()

app.use(cors())
app.use(routes)
app.listen(process.env.PORT, () => {
    console.log(`Server is working on port ${process.env.PORT}`)
})