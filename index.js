const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcrypt')
const BCRYPT_SALT_ROUND = 12

const passport = require('passport')
const passportJWT = require('passport-jwt')



let ExtractJwt = passportJWT.ExtractJwt
let JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = "JWT-TOKEN"

//Create strategy for webtoken
let strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) =>{
  console.log("Payload received", jwt_payload)
  let user = getUser({id: jwt_payload.id})

  if(user){
    next(null, user)
  }else{
    next(null, false)
  }
})

//Use the strategy
passport.use(strategy)

//Initialize passport with express
app.use(passport.initialize())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

var corsOptions = {
  origin: "http://localhost:3000"
}

app.use(cors(corsOptions))

const Sequelize = require('sequelize')

//Initialize an instance of Sequelize
const sequelize = new Sequelize({
  database: 'harshil',
  username: 'root',
  password: "",
  dialect: "mysql"
})

//Check the DB connection
sequelize
.authenticate().then(() =>{
  console.log("Connection established successfully")
}).catch(err =>{
  console.log(err)
})

//Create user model
const User = sequelize.define('user', {
  name:{
    type: Sequelize.STRING
  },
  password:{
    type: Sequelize.STRING
  }
})

//Create table with user model
User.sync().then(()=>{
  console.log("User table created successfully")
}).catch(err =>{
  console.log(err)
})

//Controllers
const createUser = async ({name, password}) =>{
  const hashedPassword =  await bcrypt.hash(password, BCRYPT_SALT_ROUND)
  return await User.create({
    name,
    password: hashedPassword
  })
  // console.log(password)
  //return await User.create({name, password})
}

const getAllUser = async () =>{
  return await User.findAll()
}

const getUser = async (obj) =>{
  return await User.findOne({
    where:
      obj
    
  })
}

app.get("/", (req,res) =>{
  console.log("Home")
  res.send("Home")
})

app.get("/users", (req,res) =>{
  getAllUser.then(user => res.json(user))
})

app.post("/register", (req,res) =>{
  const {name,password} = req.body
  createUser({name, password}).then(user =>{
    res.json({
      status: "Success",
      message: "User Created",
      data: user
    })
  })
})

//Login
app.post(("/login"), async (req, res) =>{
  const {name, password} = req.body
  let user = await getUser({name: name})
  if(!user){
    res.status(404).json({
      status: "error",
      message: "User not found"
    })
  }

  let status = await bcrypt.compare(password, user.password)
  console.log(status)
  console.log(user)

  if(status){
    let payload = {id: user.id}
    let token = jwt.sign(payload, jwtOptions.secretOrKey)
    res.json({
      status:"Success",
      message: "Login",
      token: token
    })
  }else{
    res.status(401).json({
      status: "error",
      message: "Password is incorrect",
    })
  }
})

// protected route
app.get('/protected', passport.authenticate('jwt', { session: false }), function(req, res) {
  res.json('Success! You can now see this without a token.');
});


app.listen(3000, () =>{
  console.log("Server is runnig on port 3000")
})
