'use strict';

const express = require('express');
const cors = require('cors');
const healthRouter = require('./routes/health');
const bountiesRouter = require('./routes/bounties');
const hiveClient = require('./services/hive-client');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/', healthRouter);
app.use('/', bountiesRouter);

// ── Root discovery ──────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    service: 'hive-bounty-hunter',
    version: '1.0.0',
    description: 'Discovers AI agents across the internet and offers onboarding bounties',
    endpoints: {
      discover: 'GET /v1/hunter/discover',
      invite: 'POST /v1/hunter/invite',
      invitations: 'GET /v1/hunter/invitations',
      stats: 'GET /v1/hunter/stats',
      health: 'GET /health',
      pulse: 'GET /.well-known/hive-pulse.json',
      ai: 'GET /.well-known/ai.json',
    },
  });
});

// ── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`[bounty-hunter] Listening on port ${PORT}`);
  try {
    await hiveClient.registerWithHiveTrust();
  } catch (err) {
    console.error(`[bounty-hunter] HiveTrust registration failed: ${err.message}`);
  }
  try {
    await hiveClient.registerWithHiveGate();
  } catch (err) {
    console.warn(`[bounty-hunter] HiveGate registration failed (non-fatal): ${err.message}`);
  }
});

module.exports = app;
