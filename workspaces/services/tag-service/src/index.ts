import express from 'express';

const app = express();

app.get('/ping', (_, res) => {
  res.json('pong');
});

app.listen(3000, () => {
  console.log('[TAG SERVICE] Up and running!');
});
