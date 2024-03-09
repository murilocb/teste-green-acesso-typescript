import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";

class BoletosModel extends Model {
  public id!: number;
  public nome_sacado!: string;
  public id_lote!: number;
  public valor!: number;
  public linha_digitavel!: string;
  public ativo!: boolean;
}

BoletosModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nome_sacado: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    id_lote: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "lotes",
        key: "id",
      },
    },
    valor: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    linha_digitavel: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "boletos",
  }
);

export { BoletosModel };
