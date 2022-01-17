import nc from 'next-connect';
import rateLimit from 'express-rate-limit'
import requestIp from 'request-ip'
import { serialize } from 'cookie';

const app = nc();
const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (req, res, /*next*/) {
    return res.status(429).json({
      success: false,
      message: 'Too many login attempts.  Please try again later.'
    })
  },
  keyGenerator: function (req, res) {
    return requestIp.getClientIp(req);
  }
})

app.use(limiter)
app.post((req, res) => {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION) {
    res.status(500).json({
      success: false,
      message: "Missing Environment variables ADMIN_SESSION and ADMIN_PASSWORD"
    })
  } else {
    if (req.body.password === process.env.ADMIN_PASSWORD) {
      res.setHeader('Set-Cookie', serialize('admin_session', process.env.ADMIN_SESSION, { path: '/', maxAge: 1000 * 30 * 60 }));
      res.json({ success: true })
    } else {
      res.status(401).json({
        success: false,
        message: "Incorrect Password"
      })
    }
  }
})

export default app;