import { createReadStream } from "fs";
import { LotesModel, BoletosModel, LotesConsultModel } from "../models/index";
import csvParser from "csv-parser";

async function processCSV(filePath: string): Promise<void> {
  const results: any[] = [];

  return new Promise<void>((resolve, reject) => {
    createReadStream(filePath)
      .pipe(csvParser({ separator: "," }))
      .on("data", (data: any) => results.push(data))
      .on("end", async () => {
        try {
          const promises = results.map(async (row) => {
            const { nome, unidade, valor, linha_digitavel } = row;

            const lotesConsultRecord = await LotesConsultModel.findOne({
              where: { nome_lote: '00' + unidade },
            });

            if (!lotesConsultRecord) {
              console.error(
                `No matching lotesConsult record found for unidade: ${unidade}`
              );
              return;
            }

            let lotes = await LotesModel.findOne({
              where: { id: lotesConsultRecord.id },
            });

            if (!lotes) {
              lotes = await LotesModel.create({
                id: lotesConsultRecord.id,
                nome,
                ativo: true,
                criado_em: new Date(),
              });
            }

            await BoletosModel.create({
              nome_sacado: nome,
              id_lote: lotesConsultRecord.id,
              valor: parseFloat(valor),
              linha_digitavel,
              ativo: true,
              criado_em: new Date(),
            });
          });

          await Promise.all(promises);

          console.log("CSV file processed successfully.");
          resolve();
        } catch (error) {
          console.error("Error processing CSV file:", error);
          reject(error);
        }
      });
  });
}

export { processCSV };
