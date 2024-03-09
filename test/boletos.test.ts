import dotenv from 'dotenv';
import app from '../app';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import FormData from 'form-data';
import { BoletosModel, LotesConsultModel, LotesModel } from '../api/models/index';
dotenv.config();

beforeAll(async () => {
  await app.listen();
  await BoletosModel.sync();
  await LotesModel.sync();
  await LotesConsultModel.sync();
});

const PORT = process.env.PORT || 3000;
const getBoletos = `http://localhost:${PORT}/boletos`;
const postBoleto = `http://localhost:${PORT}/boleto`;
const postPDF = `http://localhost:${PORT}/pdf`;

describe('Boletos API', () => {
  it('should post a boleto', async () => {
    try {
      const response = await axios.post(postBoleto, {
        file: path.join(__dirname, '..', 'boleto.csv')
      });
      expect(response.status).toBe(200);
    } catch (error) {
      fail(`Failed to post boleto: ${error}`);
    }
  });

  it('should post a pdf', async () => {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(path.join(__dirname, '..', 'boletosPages.pdf')));

      const response = await axios.post(postPDF, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      expect(response.status).toBe(200);
    } catch (error) {
      fail(`Failed to post pdf: ${error}`);
    }
  });

  it('should get all boletos', async () => {
    try {
      const response = await axios.get(getBoletos);
      expect(response.status).toBe(200);
    } catch (error) {
      fail(`Failed to get all boletos: ${error}`);
    }
  });

  describe('Filtered Boletos', () => {
    it('should get all boletos with name filter', async () => {
      // Teste para obter todos os boletos com filtro de nome
      try {
        const response = await axios.get(`${getBoletos}?nome=Teste`);
        expect(response.status).toBe(200);
      } catch (error) {
        fail(`Failed to get filtered boletos by name: ${error}`);
      }
    });
  });

  it('should get all boletos with report', async () => {
    try {
      const response = await axios.get(`${getBoletos}?relatorio=true`);
      expect(response.status).toBe(200);
    } catch (error) {
      fail(`Failed to get all boletos with report: ${error}`);
    }
  });
});
