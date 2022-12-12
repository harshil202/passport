const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const passport = require('passport')
const logger = require('morgan')

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())
app.use(passport.initialize())

app.listen(3000, () =>{
  console.log("Server is running on port 3000")
})