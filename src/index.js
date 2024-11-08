import { readFiles } from './app.js'
import cron from 'node-cron'
import './libs/database.js'
import { connectDB } from './libs/database.js';


async function main() {
  await connectDB();
  cron.schedule('0 5 * * *', async () => {
    readFiles()
  })
}

main()