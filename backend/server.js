require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const SUBGRAPH_URL = process.env.SUBGRAPH_URL;

app.get('/api/lottery-history', async (req, res) => {
  const queryBody = {
    query: `
      {
        ticketPurchaseds(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
          player
          numbers
          blockNumber
          blockTimestamp
          transactionHash
        }
        drawInitiateds(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
          timestamp
          blockNumber
          blockTimestamp
          transactionHash
        }
        winningNumbersDrawns(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
          numbers
          blockNumber
          blockTimestamp
          transactionHash
        }
        prizePaids(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
          player
          amount
          matchCount
          blockNumber
          blockTimestamp
          transactionHash
        }
        drawCompletes(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
          prizePoolRemaining
          blockNumber
          blockTimestamp
          transactionHash
        }
      }
    `
  };

  try {
    const response = await axios.post(SUBGRAPH_URL, queryBody);

    if (response.data.errors) {
      console.error("GraphQL Errors:", response.data.errors);
      return res.status(400).json({ errors: response.data.errors });
    }

    const data = response.data.data;

    res.json({
      tickets:        data.ticketPurchaseds,
      drawsInitiated: data.drawInitiateds,    // was: draws
      winners:        data.winningNumbersDrawns,
      prizes:         data.prizePaids,
      drawsComplete:  data.drawCompletes,     // was: history
    });
  } catch (error) {
    console.error("Network/Server Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, '0.0.0.0',() => {
  console.log(`🚀 Server running: http://localhost:${PORT}`);
});