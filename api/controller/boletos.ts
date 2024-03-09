import { Request, Response } from "express";
import { promises as fs } from "fs";
import path from "path";
import { processCSV } from "../service/csvService.service";
import { filtrarBoletos, gerarRelatorioPDF, allBoletos } from '../service/getBoletosService.service';
import { extractPages } from "../service/pdfService.service";

export default {
  async get(req: Request, res: Response) {
    const { relatorio, nome, valor_inicial, valor_final, id_lote } = req.query;

    if (relatorio) {
      const relatorioPDF = await gerarRelatorioPDF();
      const fileName = 'relatorio_boletos.pdf';
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', 'application/pdf');
      res.send(relatorioPDF);
    } else if (nome || valor_inicial || valor_final || id_lote) {
      const boletosFiltrados = await filtrarBoletos(
        nome as string | undefined,
        valor_inicial as string | undefined,
        valor_final as string | undefined,
        id_lote as string | undefined
      );
      return res.json(boletosFiltrados);
    } else {
      const boletosFiltrados = await allBoletos();
      return res.json(boletosFiltrados);
    }
  },

  async postBoleto(req: Request, res: Response) {
    try {
      await processCSV(req.file
        ? req.file.path
        : req.body.file
      );

      return res.status(200).json({ message: "File uploaded and processed successfully." });
    } catch (error) {
      console.error("Error processing CSV file:", error);
      return res.status(500).json({ error: "Error processing CSV file." });
    }
  },

  async postPDF(req: Request, res: Response) {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded." });
        return;
      }

      const inputPdfPath = req.file.path;
      const outputDirectory = path.join(__dirname, "..", "..", "pdfs");
      await fs.mkdir(outputDirectory, { recursive: true });
      await fs.chmod(outputDirectory, 0o755);

      await extractPages(inputPdfPath, outputDirectory);

      return res.status(200).json({ message: "PDF pages extracted successfully." });
    } catch (error) {
      console.error("Error extracting PDF pages:", error);
      return res.status(500).json({ error: "Error extracting PDF pages." });
    }
  }
}
