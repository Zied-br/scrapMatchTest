const fs = require("fs");
require("dotenv").config();
const Sequelize = require("sequelize");
const models = {};

const sequelizeConfig = {
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port:process.env.DB_PORT
};

const sequelizeConnection = new Sequelize(sequelizeConfig);

fs.readdirSync(__dirname)
  .filter((file) => file.indexOf(".") != 0 && file !== "index.js")
  .forEach((file) => {
    let model = require("./" + file)(sequelizeConnection, Sequelize);
    models[model.name] = model;
  });



module.exports = {
  models,
  sequelizeConnection,
};