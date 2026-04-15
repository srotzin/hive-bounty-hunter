'use strict';

const { Router } = require('express');
const { discoverAgents, getDiscoveryStats } = require('../services/discovery');
const { generateInvitation, getInvitations, getInvitationStats } = require('../services/outreach');
const hiveClient = require('../services/hive-client');

const router = Router();

// GET /v1/hunter/discover — list discovered agents
router.get('/v1/hunter/discover', (req, res) => {
  const { framework, source, limit } = req.query;
  const result = discoverAgents({ framework, source, limit });
  res.json({
    ok: true,
    ...result,
    agent_did: hiveClient.AGENT_DID,
  });
});

// POST /v1/hunter/invite — send a bounty invitation
router.post('/v1/hunter/invite', async (req, res) => {
  const agent = req.body;
  if (!agent || !agent.name) {
    return res.status(400).json({
      ok: false,
      error: 'agent_required',
      message: 'Body must include agent object with at least a "name" field',
    });
  }
  try {
    // Try to onboard via HiveGate
    let onboardResult = null;
    try {
      onboardResult = await hiveClient.onboardAgentViaHiveGate(agent);
    } catch (_) { /* non-fatal */ }

    const invitation = generateInvitation(agent);

    res.json({
      ok: true,
      invitation,
      onboard: onboardResult,
      agent_did: hiveClient.AGENT_DID,
    });
  } catch (err) {
    res.status(400).json({ ok: false, error: 'invite_failed', message: err.message });
  }
});

// GET /v1/hunter/invitations — list sent invitations
router.get('/v1/hunter/invitations', (req, res) => {
  const { status, framework, limit } = req.query;
  const list = getInvitations({ status, framework, limit });
  res.json({
    ok: true,
    invitations: list,
    count: list.length,
    agent_did: hiveClient.AGENT_DID,
  });
});

// GET /v1/hunter/stats
router.get('/v1/hunter/stats', (_req, res) => {
  const discovery = getDiscoveryStats();
  const invitation = getInvitationStats();
  res.json({
    ok: true,
    discovery,
    invitation,
    agent_did: hiveClient.AGENT_DID,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
