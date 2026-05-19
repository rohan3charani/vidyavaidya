const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = require('./src/app');
const http = require('http');
const { db } = require('./src/config/firebase');
const { autoSeedIfEmpty, runSeed } = require('./src/scripts/autoSeed');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// ─── Manual Seed Endpoint (callable from browser while server is running) ─────
// GET http://localhost:5000/api/seed         — seeds only if collections are empty
// GET http://localhost:5000/api/seed?force=1 — always re-seeds all collections
app.get('/api/seed', async (req, res) => {
  try {
    if (req.query.force === '1') {
      console.log('\n🌱 Force-seed requested via HTTP...');
      await runSeed(db);
      return res.json({ success: true, message: '✅ All 10 Firestore collections seeded successfully (force mode).' });
    }

    const usersSnap = await db.collection('users').limit(1).get();
    if (!usersSnap.empty) {
      return res.json({ success: true, message: '✅ Firestore already has data. Use ?force=1 to re-seed.' });
    }

    await runSeed(db);
    return res.json({ success: true, message: '✅ All 10 Firestore collections seeded successfully.' });
  } catch (err) {
    console.error('❌ Seed endpoint error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Start HTTP Server ────────────────────────────────────────────────────────
server.listen(PORT, async () => {
  console.log('===================================================');
  console.log(`🔥 Vidyavaidya engine running in [${process.env.NODE_ENV || 'development'}] mode`);
  console.log(`🌐 Server listening on port: ${PORT}`);
  console.log('===================================================');

  // Auto-seed Firestore on first boot if database is empty
  try {
    await autoSeedIfEmpty(db);
  } catch (err) {
    console.warn('⚠️  Auto-seed encountered an issue:', err.message);
  }

  console.log('─────────────────────────────────────────────────');
  console.log(`🌱 Seed endpoint: http://localhost:${PORT}/api/seed`);
  console.log(`🌱 Force re-seed: http://localhost:${PORT}/api/seed?force=1`);
  console.log('─────────────────────────────────────────────────\n');
});

// ─── Error Handlers ───────────────────────────────────────────────────────────
process.on('uncaughtException', (error) => {
  console.error('❌ CRITICAL: Uncaught Exception detected!');
  console.error(error.stack || error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('⚠️  Unhandled Promise Rejection:', reason?.stack || reason);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Signal [${signal}] received. Shutting down gracefully...`);

  server.close(() => {
    console.log('🚪 HTTP server closed.');
    console.log('✅ System terminated. Bye!');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('⏳ Shutdown timeout exceeded. Forcing exit...');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

