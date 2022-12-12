module.exports = {
  HOST: "localhost",
  USER:"root",
  PASSWORD: "",
  DB: "hhh",
  dialect: "mysql",
  pool: {
    max: 5, // MAx number of connectino in pool
    min: 0, // Min number of connection in pool
    acquire: 30000,
    idle: 10000
  }
}