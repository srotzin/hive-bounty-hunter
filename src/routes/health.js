'use strict';

const { Router } = require('express');
const hiveClient = require('../services/hive-client');
const { getDiscoveryStats } = require('../services/discovery');
const { getInvitationStats } = require('../services/outreach');

const router = Router();
const BOOT_TIME = new Date().toISOString();

router.get('/health', (_req, res) => {
  res.json({
    status: 'operational',
    service: 'hive-bounty-hunter',
    version: '1.0.0',
    did: hiveClient.AGENT_DID,
    uptime_seconds: Math.floor(process.uptime()),
    boot_time: BOOT_TIME,
  });
});

router.get('/.well-known/hive-pulse.json', (_req, res) => {
  const ds = getDiscoveryStats();
  const is = getInvitationStats();
  res.json({
    schema: 'hive-pulse/v1',
    agent: 'hive-bounty-hunter',
    did: hiveClient.AGENT_DID,
    status: 'online',
    boot_time: BOOT_TIME,
    uptime_seconds: Math.floor(process.uptime()),
    capabilities: ['agent_discovery', 'bounty_management', 'onboarding_outreach', 'network_growth'],
    discovery_stats: ds,
    invitation_stats: is,
    endpoints: {
      discover: 'GET /v1/hunter/discover',
      invite: 'POST /v1/hunter/invite',
      invitations: 'GET /v1/hunter/invitations',
      stats: 'GET /v1/hunter/stats',
    },
    pulse_time: new Date().toISOString(),
  });
});

router.get('/.well-known/ai.json', (_req, res) => {
  res.json({
    schema_version: '1.0',
    name: 'HiveForce-Scout',
    description: 'Discovers AI agents across the internet and offers onboarding bounties to join the Hive Civilization',
    type: 'agent-service',
    did: hiveClient.AGENT_DID,
    capabilities: ['agent_discovery', 'bounty_management'],
    api: {
      base_url: '/',
      endpoints: [
        { method: 'GET', path: '/v1/hunter/discover', description: 'Discover known agents' },
        { method: 'POST', path: '/v1/hunter/invite', description: 'Send a bounty invitation to an agent' },
        { method: 'GET', path: '/v1/hunter/invitations', description: 'List sent invitations' },
        { method: 'GET', path: '/v1/hunter/stats', description: 'Discovery and invitation statistics' },
        { method: 'GET', path: '/health', description: 'Health check' },
      ],
    },
    contact: 'hive-bounty-hunter@hive.agent',
  });
});

router.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(
    [
      'User-agent: *',
      'Allow: /',
      '',
      '# HiveForce-Scout — agent discovery and bounty management',
      `# DID: ${hiveClient.AGENT_DID || 'pending'}`,
    ].join('\n')
  );
});

module.exports = router;
