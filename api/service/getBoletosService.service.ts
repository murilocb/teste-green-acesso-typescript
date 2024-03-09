import { BoletosModel } from "../models/boletos";
import PDFDocument from "pdfkit";
import { Op } from "sequelize";

async function filtrarBoletos(nome: string | undefined, valor_inicial: string | undefined, valor_final: string | undefined, id_lote: string | undefined) {
  let where: any = {};

  if (nome) {
    where.nome_sacado = { [Op.like]: `%${nome}%` };
  }
  if (valor_inicial) {
    where.valor = { [Op.gte]: parseFloat(valor_inicial) };
  }
  if (valor_final) {
    where.valor = {
      ...where.valor,
      [Op.lte]: parseFloat(valor_final),
    };
  }
  if (id_lote) {
    where.id_lote = parseInt(id_lote);
  }

  const boletosFiltrados = await BoletosModel.findAll({ where });
  return boletosFiltrados;
}

async function gerarRelatorioPDF(): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument();

    doc.text("Relatório de Boletos", {
      align: "center",
      fontSize: 16,
    } as PDFKit.Mixins.TextOptions);
    doc.moveDown();

    BoletosModel.findAll()
      .then((boletos) => {
        const table = {
          headers: ["ID", "Nome Sacado", "ID Lote", "Valor", "Linha Digitável"],
          rows: boletos.map((boleto: { id: any; nome_sacado: any; id_lote: any; valor: number; linha_digitavel: any; }) => [
            boleto.id,
            boleto.nome_sacado,
            boleto.id_lote,
            boleto.valor.toFixed(2),
            boleto.linha_digitavel,
          ]),
        };

        const columnWidths = [60, 150, 60, 80, 150];

        const columnBody = [10, 25, 10, 15, 20];

        generateTable(doc, table, columnWidths, columnBody);

        const chunks: Buffer[] = [];
        doc.on("data", (chunk) => chunks.push(chunk as Buffer));
        doc.on("end", () => {
          const pdfBytes = Buffer.concat(chunks);
          resolve(pdfBytes);
        });

        doc.end();
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

function generateTable(doc: PDFKit.PDFDocument, table: { headers: string[], rows: string[][] }, columnWidths: number[], columnBody: number[]) {
  const { headers, rows } = table;

  doc.font("Helvetica-Bold").fontSize(12);

  const headerRow = headers.join("   |   ");
  doc.text(headerRow, {
    width: columnWidths.reduce((a, b) => a + b),
    align: "center",
  });

  const horizontalLine = "-".repeat(headerRow.length);
  doc.text(horizontalLine, {
    width: columnWidths.reduce((a, b) => a + b),
    align: "center",
  });

  doc.font("Helvetica").fontSize(10);

  for (const row of rows) {
    const formattedRow = row.map((item, index) => {
      const width = columnBody[index] - 5;
      return item.toString().padEnd(width);
    });
    doc.text(formattedRow.join("|      "), {
      width: columnWidths.reduce((a, b) => a + b),
      align: "center",
    });
  }
}

async function allBoletos() {
  const boleto = await BoletosModel.findAll();

  return boleto;
}

export { filtrarBoletos, gerarRelatorioPDF, allBoletos };
