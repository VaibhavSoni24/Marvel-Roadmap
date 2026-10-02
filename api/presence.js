// Vercel Serverless Function: Real-time True Online Presence
const activeVisitors = new Map();

module.exports = function handler(req, res) {
  // CORS & Cache headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const now = Date.now();

  // Identify visitor by IP or header
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : (req.socket?.remoteAddress || 'visitor');
  const userAgent = req.headers['user-agent'] || 'agent';
  const visitorId = `${ip}-${userAgent.slice(0, 32)}`;

  // Purge expired sessions (inactive > 45 seconds)
  for (const [id, timestamp] of activeVisitors.entries()) {
    if (now - timestamp > 45000) {
      activeVisitors.delete(id);
    }
  }

  // Register active heartbeat
  activeVisitors.set(visitorId, now);

  // Exact true active unique visitor sessions
  const trueCount = Math.max(1, activeVisitors.size);

  return res.status(200).json({
    online: trueCount,
    activeSessions: activeVisitors.size,
    timestamp: now
  });
};
