const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const app     = express();
const PORT    = 8080;
const GALLERY = path.join(__dirname, 'gallery');

// Ensure gallery folder exists
if (!fs.existsSync(GALLERY)) fs.mkdirSync(GALLERY, { recursive: true });

// ── Content Security Policy ───────────────────────────────────────────
// Every directive is the minimum needed for the app to function:
//   script-src  'self'                      – only /public/app.js
//   style-src   'self' fonts.googleapis.com – /public/style.css + Google Fonts stylesheet
//   font-src    fonts.gstatic.com           – Google Fonts actual font files
//   img-src     'self' data: blob:          – /gallery/* PNGs served by us,
//                                             data: URIs from canvas.toDataURL(),
//                                             blob: URLs (future-safe)
//   connect-src 'self'                      – fetch() calls to /api/gallery
//   default-src 'none'                      – deny everything not listed above
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'none'",
      "script-src 'self'",
      "style-src 'self' https://fonts.googleapis.com",
      "font-src https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self'",
    ].join('; ')
  );
  next();
});

// Redirect root to main app (before static so / is handled)
app.get('/', (req, res) => res.redirect('/pixel-art-converter.html'));

// ── Static files ──────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// Serve the gallery folder as /gallery/*
app.use('/gallery', express.static(GALLERY));

// ── Multer setup ──────────────────────────────────────────────────────
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, GALLERY),
  filename: (req, file, cb) => {
    // req.body is not populated yet during multipart processing,
    // so use a timestamp-only name here and rename after upload completes.
    cb(null, `pixl_${Date.now()}.png`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Pass false (not an Error) so multer rejects cleanly without throwing
    if (file.mimetype === 'image/png') return cb(null, true);
    cb(null, false);
  },
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB max
});

// ── POST /api/gallery  – save an image ───────────────────────────────
app.post('/api/gallery', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file received or file type rejected' });
    }

    // req.body is now populated — rename to include the human-readable base name
    const rawName  = (req.body && req.body.name) ? req.body.name : '';
    const safeName = rawName
      .replace(/[^a-z0-9_\-]/gi, '_')
      .replace(/\.png$/i, '')
      .slice(0, 80); // cap length to prevent excessively long filenames

    if (safeName) {
      const ts      = Date.now();
      const newName = `${safeName}_${ts}.png`;
      const oldPath = req.file.path;
      const newPath = path.join(GALLERY, newName);
      fs.renameSync(oldPath, newPath);
      req.file.filename = newName;
      req.file.path     = newPath;
    }

    res.json({
      ok:       true,
      filename: req.file.filename,
      url:      `/gallery/${req.file.filename}`
    });
  });
});

// ── GET /api/gallery  – list saved images ────────────────────────────
app.get('/api/gallery', (req, res) => {
  try {
    const files = fs.readdirSync(GALLERY)
      .filter(f => /\.(png|jpg|jpeg|gif|webp)$/i.test(f))
      .map(f => {
        const stat = fs.statSync(path.join(GALLERY, f));
        return {
          filename: f,
          url:      `/gallery/${f}`,
          size:     stat.size,
          created:  stat.birthtimeMs || stat.mtimeMs
        };
      })
      .sort((a, b) => b.created - a.created); // newest first

    res.json(files);
  } catch (err) {
    console.error('GET /api/gallery error:', err);
    res.status(500).json({ error: 'Failed to read gallery directory' });
  }
});

// ── DELETE /api/gallery/:filename ────────────────────────────────────
app.delete('/api/gallery/:filename', (req, res) => {
  try {
    const safe = path.basename(req.params.filename); // prevent path traversal
    const full = path.join(GALLERY, safe);
    if (!fs.existsSync(full)) return res.status(404).json({ error: 'Not found' });
    fs.unlinkSync(full);
    res.json({ ok: true, deleted: safe });
  } catch (err) {
    console.error('DELETE /api/gallery error:', err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// ── Start ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  PIXL server running → http://localhost:${PORT}\n`);
});
