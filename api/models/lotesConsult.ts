import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";
import { LotesModel } from "./lotes";
import { BoletosModel } from "./boletos";

class LotesConsultModel extends Model {
  nome_lote!: string;
  id!: number;
}

LotesConsultModel.init(
  {
    nome_lote: {
      type: DataTypes.STRING(100),
      allowNull: true,
      primaryKey: true,
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "lotes_consults",
  }
);

LotesModel.hasMany(BoletosModel, { foreignKey: "id_lote" });
BoletosModel.belongsTo(LotesModel, { foreignKey: "id_lote" });

export { LotesConsultModel };
