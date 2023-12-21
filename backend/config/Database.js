const Sequelize = require("sequelize");

const db = new Sequelize('db_perpus','root','',{
    host: "localhost",
    dialect: "mysql"
});

module.exports = db;