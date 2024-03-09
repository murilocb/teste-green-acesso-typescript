import { PDFDocument } from "pdf-lib";
import { BoletosModel } from "../models/boletos";
import { Op } from "sequelize";
import { promises as fs } from "fs";
import { PDFExtract } from 'pdf.js-extract';
const pdfExtract = new PDFExtract();

async function extractPages(pdfPath: string, outputDirectory: string): Promise<void> {
  try {
    const data = await pdfExtract.extract(pdfPath, {});
    const pages = data.pages;
    const pdfDoc = await PDFDocument.load(await fs.readFile(pdfPath));

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const lines = page.content;

      for (let j = 0; j < lines.length; j++) {
        const line = lines[j].str;
        const words = line.split(" ");
        const desiredWord = words[3];

        const boleto = await BoletosModel.findOne({
          where: {
            nome_sacado: {
              [Op.like]: `%${desiredWord}%`,
            },
          },
        });

        if (boleto) {
          const extractedPdfDoc = await PDFDocument.create();
          const [copiedPage] = await extractedPdfDoc.copyPages(pdfDoc, [i]);
          extractedPdfDoc.addPage(copiedPage);

          const extractedPdfBytes = await extractedPdfDoc.save();
          const outputPath = `${outputDirectory}/${boleto.id}.pdf`;
          await fs.writeFile(outputPath, extractedPdfBytes);
        }
      }
    }

    console.log("PDF pages extracted and saved successfully.");
  } catch (error) {
    console.error("Error extracting and saving PDF pages:", error);
    throw error;
  }
}

export { extractPages };
