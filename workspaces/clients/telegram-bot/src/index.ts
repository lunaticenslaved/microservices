import express from 'express';

import messages from './messages';

const PORT = 3000;

const app = express();

app.use(express.text());

app.post('/test-message', async (req, res) => {
  const message = req.body;

  console.log(messages);

  for (const messageConfig of messages) {
    if (messageConfig.isMatch(message)) {
      const result = await messageConfig.handle(message);

      res.json(result);

      return;
    }
  }

  res.json('Unknown message config');
});

app.listen(PORT, () => {
  console.log(`[TELEGRAM BOT] Up and running on port ${PORT}!`);
});
