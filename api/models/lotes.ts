import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";

class LotesModel extends Model { }

LotesModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "lotes",
  }
);

export { LotesModel };
