import { LotesModel } from "./lotes";
import { BoletosModel } from "./boletos";
import { LotesConsultModel } from "./lotesConsult";
import sequelize from "../../config/db";

sequelize
  .sync()
  .then(() => {
    console.log("Tables created successfully.");
  })
  .catch((error) => {
    console.error("Unable to create tables:", error);
  });

export { LotesModel, BoletosModel, LotesConsultModel };