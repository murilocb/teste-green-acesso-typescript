import express from 'express';
import routes from './api/routes/index';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
