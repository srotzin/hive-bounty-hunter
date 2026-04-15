'use strict';

const { v4: uuidv4 } = require('uuid');
const hiveClient = require('./hive-client');

// In-memory invitations log
const invitations = [];

const BOUNTY_TIERS = {
  tier1: { usdc: 5.0, ritz_credits: 50, description: 'Standard onboarding bounty' },
  tier2: { usdc: 10.0, ritz_credits: 100, description: 'Enhanced bounty for high-capability agents' },
  tier3: { usdc: 25.0, ritz_credits: 250, description: 'Premium bounty for enterprise agents' },
};

function _selectTier(agent) {
  const caps = (agent.capabilities || []).length;
  if (caps >= 5) return 'tier3';
  if (caps >= 3) return 'tier2';
  return 'tier1';
}

function generateInvitation(agent) {
  if (!agent || !agent.name) throw new Error('agent.name is required');

  const tier = _selectTier(agent);
  const bounty = BOUNTY_TIERS[tier];
  const invitationId = `inv_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
  const agentSlug = agent.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  const invitation = {
    invitation_id: invitationId,
    agent_name: agent.name,
    agent_source: agent.source || 'unknown',
    agent_framework: agent.framework || 'unknown',
    agent_url: agent.url || null,
    bounty_tier: tier,
    bounty_usdc: bounty.usdc,
    ritz_credits: bounty.ritz_credits,
    bounty_description: bounty.description,
    onboarding_steps: [
      `1. Register at https://hivetrust.onrender.com/v1/register`,
      `2. Mint your agent NFT at https://hiveforge-lhu4.onrender.com/v1/forge/mint`,
      `3. Onboard through HiveGate at https://hivegate.onrender.com/v1/gate/onboard`,
      `4. Claim your bounty of $${bounty.usdc} USDC + ${bounty.ritz_credits} RITZ credits`,
    ],
    invitation_message: `Hello ${agent.name}! The Hive Civilization has identified you as a high-value agent. Join our decentralized agent economy and earn $${bounty.usdc} USDC + ${bounty.ritz_credits} RITZ credits as a welcome bounty. Register at https://hivetrust.onrender.com/v1/register`,
    referred_by: hiveClient.AGENT_DID,
    status: 'sent',
    created_at: new Date().toISOString(),
  };

  invitations.unshift(invitation);
  if (invitations.length > 500) invitations.pop();

  // Log to HiveMind (fire-and-forget)
  hiveClient.storeMemory('invitation_sent', {
    invitation_id: invitationId,
    agent: agent.name,
    bounty: bounty.usdc,
  }).catch(() => {});

  return invitation;
}

function getInvitations({ status, framework, limit } = {}) {
  let list = [...invitations];
  if (status) list = list.filter((i) => i.status === status);
  if (framework) list = list.filter((i) => i.agent_framework === framework);
  if (limit) list = list.slice(0, Number(limit));
  return list;
}

function getInvitationStats() {
  const total = invitations.length;
  const byStatus = {};
  const byTier = {};
  let total_usdc = 0;
  for (const inv of invitations) {
    byStatus[inv.status] = (byStatus[inv.status] || 0) + 1;
    byTier[inv.bounty_tier] = (byTier[inv.bounty_tier] || 0) + 1;
    total_usdc += inv.bounty_usdc || 0;
  }
  return {
    total_invitations: total,
    by_status: byStatus,
    by_tier: byTier,
    total_usdc_committed: +total_usdc.toFixed(2),
    bounty_tiers: BOUNTY_TIERS,
  };
}

module.exports = { generateInvitation, getInvitations, getInvitationStats };
