import { readFiles } from './app.js'
import cron from 'node-cron'
import './libs/database.js'
import { connectDB } from './libs/database.js';


async function main() {
  // await connectDB();
  readFiles()
  // await cron.schedule('*/10 * * * * *', async () => {
    
  // })
}

main()