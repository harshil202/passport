module.exports = (sequlize, Sequelize) => {
  const User = sequlize.define("user", {
    userName: {
      tpye: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  })

  return User
}