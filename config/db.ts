import { Sequelize } from "sequelize";
import { seed } from "../api/seeds/lotesConsult";

const sequelize = new Sequelize("database", "username", "password", {
  dialect: "sqlite",
  storage: "./database.sqlite",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
    seed();
  })
  .catch((error: Error) => {
    console.error("Unable to connect to the database:", error);
  });

export default sequelize;
