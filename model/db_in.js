//DB creation
const databaseConfig = require("../config/db_config")
const Sequelize = require('sequelize')

const sequelizeInstance = new Sequelize(databaseConfig.DB, databaseConfig.USER, databaseConfig.PASSWORD, {
  host: databaseConfig.HOST,
  DIALECT: databaseConfig.dialect,
  operatorsAliases: false,

  pool:{
    max:databaseConfig.pool.max,
    min:databaseConfig.pool.min,
    acquire:databaseConfig.pool.acquire,
    idle:databaseConfig.pool.idle
  }
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelizeInstance

db.users = require("./user_data")(sequelizeInstance, Sequelize)

module.exports = db