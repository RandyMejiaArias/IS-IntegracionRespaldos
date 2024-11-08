import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import Result from './models/register.js';

export const readFiles = () => {
  const directoryPath = join(__dirname, '../../cajitaSA/files');
  
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }

    files.forEach(function(file){
      const filePath = join(directoryPath, file);
      processCSVFile(filePath);
    });
  })
}

const processCSVFile = (filePath) => {

  const results = [];
  const resultsWithErrors = [];

  try {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',' }))
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        for (const result of results) {
          if(!result.fecha || !result.mesReporte || !result.añoReporte || !result.tipoRegistro || !result.monto) {
            resultsWithErrors.push(result);
            continue;
          }

          const object = {
            fecha: result.fecha,
            mesReporte: result.mesReporte,
            añoReporte: result.añoReporte,
            tipoRegistro: result.tipoRegistro,
            monto: result.monto,
          }

          const resultFound = await Result.findOne({ fecha: object.fecha, mesReporte: object.mesReporte, añoReporte: object.añoReporte, tipoRegistro: object.tipoRegistro, monto: object.monto });

          if (!resultFound) {
            const newResult = new Result(object);
            await newResult.save();
            console.log('Result saved');
          }
        }

        if (resultsWithErrors.length > 0) {
          console.log('Some results have errors');
          const csvWriter = createObjectCsvWriter({
            path: `./filesWithErrors/${moment(new Date()).local().format('YYYY-MM-DD')}.csv`,
            header: [
              { id: 'date', title: 'fecha' },
              { id: 'month', title: 'mesReporte' },
              { id: 'year', title: 'añoReporte' },
              { id: 'movement', title: 'tipoRegistro' },
              { id: 'amount', title: 'monto' },
            ],
          });
          for (const result of resultsWithErrors) {
            await csvWriter.writeRecords([result]);
          }
        }
      });
  } catch (error) {
    console.log(error)
  }
}