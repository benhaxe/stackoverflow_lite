import express from 'express';

const PORT = process.env.PORT || 3000;

const app = express();
require('dotenv').config();
require('./config/express')(app);

const server = app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});

export { server, app };
