import express from 'express';
import { connectMongo } from './server/db';
import { registerApi } from './server/register-api';

(async () => {
  const app = express();
  registerApi(app);
  await connectMongo();

  const port = Number(process.env['API_PORT'] ?? 3000);
  app.listen(port, () => {
    console.log(`REST API at http://localhost:${port} (MongoDB: ${process.env['MONGODB_URI'] ?? 'mongodb://127.0.0.1:27017/wdd430'})`);
  });
})();
