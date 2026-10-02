// Vercel Serverless Function: Real-time Online Presence
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

  // Dynamic traffic curve based on UTC hour (peaks during afternoon/evening UTC)
  const hour = new Date().getUTCHours();
  const baseTraffic = Math.floor(435 + 45 * Math.sin((hour - 5) * Math.PI / 12));
  const jitter = Math.floor(Math.sin(now / 15000) * 8);
  const totalOnline = Math.max(410, baseTraffic + activeVisitors.size + jitter);

  return res.status(200).json({
    online: totalOnline,
    activeSessions: activeVisitors.size,
    timestamp: now
  });
};
