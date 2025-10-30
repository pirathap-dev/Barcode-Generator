// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import dotenv from 'dotenv';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import rateLimit from 'express-rate-limit';
// import { loadUsersFromEnv } from './users.js';
// import { authRequired } from './auth.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 8080;

// const users = loadUsersFromEnv();

// const corsOrigins = (process.env.CORS_ORIGINS || '')
//     .split(',')
//     .map(s => s.trim())
//     .filter(Boolean);

// app.use(cors({ origin: corsOrigins.length ? corsOrigins : true }));
// app.use(helmet());
// app.use(express.json());

// const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

// app.get('/health', (_, res) => res.json({ ok: true }));

// app.post('/auth/login', loginLimiter, async (req, res) => {
//     const { username, password } = req.body || {};
//     if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

//     const rec = users.get(username);
//     if (!rec) return res.status(401).json({ error: 'Invalid username or password' });

//     const ok = await bcrypt.compare(password, rec.hash);
//     if (!ok) return res.status(401).json({ error: 'Invalid username or password' });

//     const token = jwt.sign({ sub: username }, process.env.JWT_SECRET, { expiresIn: '12h' });
//     res.json({ token, user: { username } });
// });

// app.get('/me', authRequired, (req, res) => {
//     res.json({ user: { username: req.user.sub } });
// });

// app.listen(PORT, () => {
//     console.log(`API listening on http://localhost:${PORT}`);
// });



import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
import { loadUsersFromEnv } from './users.js';
import { authRequired } from './auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const users = loadUsersFromEnv();

const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const corsConfig = {
  origin: corsOrigins.length ? corsOrigins : true, // add explicit origin(s) in env!
  credentials: false, // set true only if you use cookies for auth
  optionsSuccessStatus: 200,
};

app.use(cors(corsConfig));
app.options('*', cors(corsConfig));          // <-- respond to preflight globally

app.use(helmet());
app.use(express.json());

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

app.get('/health', (_, res) => res.json({ ok: true }));

app.post('/auth/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

  const rec = users.get(username);
  if (!rec) return res.status(401).json({ error: 'Invalid username or password' });

  const ok = await bcrypt.compare(password, rec.hash);
  if (!ok) return res.status(401).json({ error: 'Invalid username or password' });

  const token = jwt.sign({ sub: username }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, user: { username } });
});

app.get('/me', authRequired, (req, res) => {
  res.json({ user: { username: req.user.sub } });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
