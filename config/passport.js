const jwtSecret = require("./jwt_config")
const bcrypt = require('bcrypt')

const BCRYPT_SALT_ROUND = 12

const passport = require("passport"),
localStrategy = require("passport-local"),
db = require("../model/db_in"),
user = db.users,
JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use(
  'register',
  new localStrategy({
    userNameField: "userName",
    emailField: "email",
    passwordField: "password",
    session: false
  },
  (userName, email, password, done) =>{
    try{
      user.findOne({
        where: {
          userName: userName
        },
      }).then(user =>{
        if(user != null){
          console.log("Username is already taken")
          return done(null, false, {message: "Username is exist"})
        }else{
          bcrypt.hash(password, BCRYPT_SALT_ROUND).then(hashedPassword =>{
            user.create({
              userName,
              password: hashedPassword,
              email
            }).then(user =>{
              console.log("User Created")
              return done(null, user)
            })
          })
        }
      })
    }catch(err){
      done(err)
    }
  }
  )
)

passport.use(
  'login',
  new localStrategy({
    userNameField: "userName",
    passwordFiled: "password",
    session: fasle
  },
  (userName, password, done) =>{
    try{
      user.findOne({
        where:{
          userName: userName
        }
      }).then(user =>{
        if(user === null){
          return done(null, false, {message: 'bad response'})
        }else{
          bcrypt.compare(password, user.password).then(res =>{
            if(res != true){
              console.log("Password does not match")
              return done(null, false, {message: "password does not match"})
            }else{
              console.log("Found & authenticated")
              return done(null, user)
            }
          })
        }
      })
    }catch(err){
      done(null, err)
    }
  }
  )
)



