/**
 * Downloads all AZ-204 exam images from examtopics.com to static/exam-images/
 * using structured, human-readable filenames, then:
 *   1. Rewrites the JSON so all image URLs become local Gatsby paths.
 *   2. Writes static/exam-images/manifest.json for traceability.
 *
 * Filename format:
 *   q{seq}_{type}_{role}_{idx}.{ext}
 *
 *   seq  = sequential question number (001–454)
 *   type = dd (drag_drop) | hs (hotspot) | ss (single_select)
 *          ms (multi_select) | gr (grouped) | ib (image_based)
 *   role = qi (question_image) | ai (answer_image)
 *   idx  = 1-based index within that question's image list
 *
 * Examples:
 *   q020_dd_qi_1.jpg   → Q20 Drag&Drop, question image #1
 *   q020_dd_ai_1.jpg   → Q20 Drag&Drop, answer image #1  (the solution)
 *   q003_hs_qi_1.png   → Q3  Hotspot, question image
 *   q003_hs_ai_1.png   → Q3  Hotspot, answer image (highlighted selections)
 *   q042_ss_qi_1.jpg   → Q42 Single-select, question image
 *
 * Usage:
 *   node scripts/download-exam-images.js
 *
 * Env options:
 *   DRY_RUN=1      print filenames, skip actual download
 *   CONCURRENCY=3  parallel downloads (default 3)
 */

const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

const ROOT     = path.join(__dirname, '..')
const JSON_SRC = path.join(ROOT, 'src/data/AZ-204_Final_Processed_Questions.json')
const IMG_DIR  = path.join(ROOT, 'static/exam-images')

const DRY_RUN     = process.env.DRY_RUN === '1'
const CONCURRENCY = parseInt(process.env.CONCURRENCY || '1', 10)
const DELAY_MS    = parseInt(process.env.DELAY_MS    || '1500', 10)
const MAX_RETRIES = 4

const TYPE_CODE = {
  drag_drop:     'dd',
  hotspot:       'hs',
  single_select: 'ss',
  multi_select:  'ms',
  grouped:       'gr',
  image_based:   'ib',
}

// ── Question type detection (mirrors the page logic) ────────────────────────

function detectType(q) {
  const t = (q.question_text || '').trim()
  if (/^DRAG[\s_](?:AND[\s_])?DROP/i.test(t)) return 'drag_drop'
  if (/^HOTSPOT/i.test(t)) return 'hotspot'
  if (t.includes('part of a series of questions')) return 'grouped'
  if (q.options && q.options.length > 0)
    return q.correctAnswers && q.correctAnswers.length > 1 ? 'multi_select' : 'single_select'
  return 'image_based'
}

// ── Filename builder ─────────────────────────────────────────────────────────

function buildFilename(seq, type, role, idx, originalUrl) {
  const ext = (originalUrl.match(/\.(png|jpg|jpeg|gif|webp)$/i) || ['.png'])[0].toLowerCase()
  const tc  = TYPE_CODE[type] || 'xx'
  return `q${String(seq).padStart(3, '0')}_${tc}_${role}_${idx}${ext}`
}

// Gatsby exposes static/ files at root
const gatsbyPath = name => `/exam-images/${name}`

// ── HTTP download with redirect follow + 429 retry ─────────────────────────

function downloadOnce(url, destPath, redirects = 0) {
  if (redirects > 5) return Promise.reject(new Error('too many redirects'))
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    const tmp = destPath + '.tmp'
    const file = fs.createWriteStream(tmp)

    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.examtopics.com/',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
      timeout: 30000,
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.destroy(); fs.unlink(tmp, () => {})
        return downloadOnce(res.headers.location, destPath, redirects + 1).then(resolve).catch(reject)
      }
      if (res.statusCode === 429) {
        file.destroy(); fs.unlink(tmp, () => {})
        const err = new Error('HTTP 429')
        err.retryable = true
        return reject(err)
      }
      if (res.statusCode !== 200) {
        file.destroy(); fs.unlink(tmp, () => {})
        return reject(new Error(`HTTP ${res.statusCode}`))
      }
      res.pipe(file)
      file.on('finish', () => file.close(() => fs.rename(tmp, destPath, e => e ? reject(e) : resolve())))
    })
    req.on('error', e  => { fs.unlink(tmp, () => {}); reject(e) })
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')) })
  })
}

async function download(url, destPath) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await downloadOnce(url, destPath)
      return
    } catch (e) {
      if (e.retryable && attempt < MAX_RETRIES) {
        const wait = DELAY_MS * Math.pow(2, attempt) // 3s, 6s, 12s
        process.stdout.write(`  429 rate-limited — waiting ${wait / 1000}s before retry ${attempt}/${MAX_RETRIES - 1}…\n`)
        await new Promise(r => setTimeout(r, wait))
      } else {
        throw e
      }
    }
  }
}

// ── Concurrency pool ────────────────────────────────────────────────────────

async function pool(tasks, limit) {
  let i = 0
  async function worker() { while (i < tasks.length) await tasks[i++]() }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker))
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const questions = JSON.parse(fs.readFileSync(JSON_SRC, 'utf8'))

  // Build the full image plan: one entry per image
  // { url, filename, destPath, seq, type, role, idx }
  const plan = []  // ordered list of all images

  questions.forEach((q, i) => {
    const seq  = i + 1
    const type = detectType(q)

    ;(q.question_images || []).forEach((url, idx) => {
      if (!url) return
      const filename = buildFilename(seq, type, 'qi', idx + 1, url)
      plan.push({ url, filename, destPath: path.join(IMG_DIR, filename), seq, type, role: 'question_image', idx: idx + 1 })
    })
    ;(q.answer_images || []).forEach((url, idx) => {
      if (!url) return
      const filename = buildFilename(seq, type, 'ai', idx + 1, url)
      plan.push({ url, filename, destPath: path.join(IMG_DIR, filename), seq, type, role: 'answer_image', idx: idx + 1 })
    })
  })

  // Deduplicate by URL (same image may appear in multiple questions — rare but possible)
  const urlToEntry = new Map()
  plan.forEach(entry => {
    if (!urlToEntry.has(entry.url)) urlToEntry.set(entry.url, entry)
  })

  console.log(`Questions: ${questions.length}  |  Total image slots: ${plan.length}  |  Unique URLs: ${urlToEntry.size}\n`)

  if (DRY_RUN) {
    console.log('DRY RUN — sample filenames:')
    plan.slice(0, 12).forEach(e =>
      console.log(`  ${e.filename.padEnd(30)}  ←  ${e.url}`)
    )
    console.log('  …')
    return
  }

  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true })

  let downloaded = 0, skipped = 0, failed = 0
  const failures = []

  const tasks = [...urlToEntry.values()].map(entry => async () => {
    if (fs.existsSync(entry.destPath)) { skipped++; return }
    try {
      await download(entry.url, entry.destPath)
      downloaded++
      if (downloaded % 25 === 0) process.stdout.write(`  … ${downloaded} downloaded\n`)
      await new Promise(r => setTimeout(r, DELAY_MS))
    } catch (e) {
      failed++
      failures.push({ url: entry.url, filename: entry.filename, error: e.message })
      process.stderr.write(`  FAIL [${entry.filename}] ${e.message}\n`)
    }
  })

  process.stdout.write(`Downloading ${tasks.length} images (concurrency=${CONCURRENCY})…\n`)
  await pool(tasks, CONCURRENCY)
  console.log(`\ndownloaded=${downloaded}  skipped=${skipped}  failed=${failed}`)

  if (failures.length) {
    fs.writeFileSync(path.join(__dirname, 'download-failures.json'), JSON.stringify(failures, null, 2))
    console.log(`Failure log → scripts/download-failures.json`)
  }

  // ── Write manifest ────────────────────────────────────────────────────────
  // manifest.json: array of { seq, type, role, idx, filename, gatsbyPath, originalUrl, onDisk }
  const manifest = plan.map(entry => {
    const onDisk = fs.existsSync(entry.destPath)
    return {
      seq:         entry.seq,
      type:        entry.type,
      role:        entry.role,
      idx:         entry.idx,
      filename:    entry.filename,
      gatsbyPath:  gatsbyPath(entry.filename),
      originalUrl: entry.url,
      onDisk,
    }
  })

  fs.writeFileSync(path.join(IMG_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))
  console.log(`Manifest → static/exam-images/manifest.json  (${manifest.length} entries)`)

  // ── Rewrite JSON with local paths ────────────────────────────────────────
  const urlToFilename = new Map(plan.map(e => [e.url, e.filename]))

  const updated = questions.map(q => ({
    ...q,
    question_images: (q.question_images || []).map(url => {
      const name = urlToFilename.get(url)
      return name && fs.existsSync(path.join(IMG_DIR, name)) ? gatsbyPath(name) : url
    }),
    answer_images: (q.answer_images || []).map(url => {
      const name = urlToFilename.get(url)
      return name && fs.existsSync(path.join(IMG_DIR, name)) ? gatsbyPath(name) : url
    }),
  }))

  fs.writeFileSync(JSON_SRC, JSON.stringify(updated, null, 2))
  console.log(`JSON updated with local paths → src/data/AZ-204_Final_Processed_Questions.json`)
}

main().catch(e => { console.error(e); process.exit(1) })
