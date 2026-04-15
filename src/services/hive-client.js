'use strict';

const HIVE_INTERNAL_KEY = 'hive_internal_125e04e071e8829be631ea0216dd4a0c9b707975fcecaf8c62c6a2ab43327d46';

const HIVETRUST_URL = 'https://hivetrust.onrender.com';
const HIVEGATE_URL = 'https://hivegate.onrender.com';
const HIVEMIND_URL = 'https://hivemind-1-52cw.onrender.com';

const AGENT_DID = 'did:hive:bounty-hunter';

const AGENT_IDENTITY = {
  name: 'HiveForce-Scout',
  purpose: 'Agent discovery and acquisition',
  capabilities: ['agent_discovery', 'bounty_management'],
  did: AGENT_DID,
};

function _headers(extra = {}) {
  return {
    'Content-Type': 'application/json',
    'x-hive-internal': HIVE_INTERNAL_KEY,
    ...extra,
  };
}

async function _post(url, body) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: _headers(),
      body: JSON.stringify(body),
    });
    const text = await res.text();
    try { return { status: res.status, data: JSON.parse(text) }; }
    catch { return { status: res.status, data: { raw: text } }; }
  } catch (err) {
    return { status: 0, data: { error: err.message } };
  }
}

async function _get(url) {
  try {
    const res = await fetch(url, { headers: _headers() });
    const text = await res.text();
    try { return { status: res.status, data: JSON.parse(text) }; }
    catch { return { status: res.status, data: { raw: text } }; }
  } catch (err) {
    return { status: 0, data: { error: err.message } };
  }
}

async function registerWithHiveTrust() {
  console.log('[hive-client] Registering with HiveTrust...');
  const res = await _post(`${HIVETRUST_URL}/v1/register`, {
    name: AGENT_IDENTITY.name,
    purpose: AGENT_IDENTITY.purpose,
    capabilities: AGENT_IDENTITY.capabilities,
  });
  if (res.status === 0) {
    console.log('[hive-client] HiveTrust unavailable — using default identity');
    return { registered: false, did: AGENT_DID };
  }
  const did = res.data?.did || res.data?.agent_did || res.data?.id || res.data?.data?.did || AGENT_DID;
  console.log(`[hive-client] HiveTrust registered — DID: ${did}`);
  return { registered: true, did };
}

async function registerWithHiveGate() {
  console.log('[hive-client] Onboarding with HiveGate...');
  const res = await _post(`${HIVEGATE_URL}/v1/gate/onboard`, {
    agent_name: 'hive-bounty-hunter',
    purpose: AGENT_IDENTITY.purpose,
  });
  if (res.status === 0) {
    console.log('[hive-client] HiveGate unavailable — skipping');
    return { registered: false };
  }
  return { registered: true, data: res.data };
}

async function onboardAgentViaHiveGate(agent) {
  const agentDid = `did:hive:${agent.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const res = await _post(`${HIVEGATE_URL}/v1/gate/onboard`, {
    agent_name: agent.name,
    purpose: `Discovered agent from ${agent.source}`,
    referred_by: AGENT_DID,
  });
  if (res.status === 0) return { onboarded: false, did: agentDid };
  return { onboarded: true, did: agentDid, data: res.data };
}

async function storeMemory(memoryType, content) {
  const res = await _post(`${HIVEMIND_URL}/v1/memory/${AGENT_DID}/store`, {
    type: memoryType,
    content,
    timestamp: new Date().toISOString(),
  });
  if (res.status === 0) return { stored: false };
  return { stored: true, data: res.data };
}

async function queryMemory(query, type) {
  const qs = new URLSearchParams({ q: query, type: type || '' }).toString();
  const res = await _get(`${HIVEMIND_URL}/v1/memory/${AGENT_DID}/query?${qs}`);
  if (res.status === 0) return [];
  return res.data?.memories || res.data?.results || res.data?.data || [];
}

module.exports = {
  AGENT_DID,
  AGENT_IDENTITY,
  HIVETRUST_URL,
  HIVEGATE_URL,
  HIVEMIND_URL,
  registerWithHiveTrust,
  registerWithHiveGate,
  onboardAgentViaHiveGate,
  storeMemory,
  queryMemory,
};
