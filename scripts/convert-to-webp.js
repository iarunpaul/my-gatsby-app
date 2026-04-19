/**
 * Converts all exam images in static/exam-images/ to WebP using sharp,
 * then rewrites the JSON and manifest so all paths use .webp.
 *
 * Usage:
 *   node scripts/convert-to-webp.js
 *
 * Env options:
 *   QUALITY=82        WebP quality 1–100 (default 82 — good balance)
 *   KEEP_ORIGINALS=1  Don't delete source .png/.jpg after conversion
 *   CONCURRENCY=4     Parallel conversions (default 4)
 */

const fs   = require('fs')
const path = require('path')
const sharp = require('sharp')

const ROOT      = path.join(__dirname, '..')
const IMG_DIR   = path.join(ROOT, 'static/exam-images')
const JSON_PATH = path.join(ROOT, 'src/data/AZ-204_Final_Processed_Questions.json')
const MANIFEST  = path.join(IMG_DIR, 'manifest.json')

const QUALITY        = parseInt(process.env.QUALITY        || '82',  10)
const KEEP_ORIGINALS = process.env.KEEP_ORIGINALS === '1'
const CONCURRENCY    = parseInt(process.env.CONCURRENCY    || '4',   10)

const CONVERTABLE = new Set(['.png', '.jpg', '.jpeg', '.gif'])

// ── Concurrency pool ────────────────────────────────────────────────────────
async function pool(tasks, limit) {
  let i = 0
  async function worker() { while (i < tasks.length) await tasks[i++]() }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker))
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  // Collect convertable images (skip manifest.json and already-webp files)
  const files = fs.readdirSync(IMG_DIR).filter(f => {
    const ext = path.extname(f).toLowerCase()
    return CONVERTABLE.has(ext)
  })

  if (files.length === 0) {
    console.log('No convertable images found — already all WebP?')
    return
  }

  console.log(`Found ${files.length} images to convert (quality=${QUALITY}, concurrency=${CONCURRENCY})\n`)

  let converted = 0, skipped = 0, failed = 0
  let savedBytes = 0
  const failures = []

  const tasks = files.map(filename => async () => {
    const srcPath  = path.join(IMG_DIR, filename)
    const webpName = filename.replace(/\.(png|jpg|jpeg|gif)$/i, '.webp')
    const destPath = path.join(IMG_DIR, webpName)

    // Skip if WebP already exists and is newer than source
    if (fs.existsSync(destPath)) {
      const srcMtime  = fs.statSync(srcPath).mtimeMs
      const destMtime = fs.statSync(destPath).mtimeMs
      if (destMtime >= srcMtime) { skipped++; return }
    }

    try {
      const srcSize = fs.statSync(srcPath).size
      await sharp(srcPath)
        .webp({ quality: QUALITY, effort: 4 })
        .toFile(destPath)
      const destSize = fs.statSync(destPath).size
      savedBytes += srcSize - destSize

      converted++
      if (converted % 50 === 0) {
        const savedMB = (savedBytes / 1024 / 1024).toFixed(1)
        process.stdout.write(`  … ${converted} converted  (saved ${savedMB} MB so far)\n`)
      }

      if (!KEEP_ORIGINALS) fs.unlinkSync(srcPath)
    } catch (e) {
      failed++
      failures.push({ filename, error: e.message })
      process.stderr.write(`  FAIL [${filename}] ${e.message}\n`)
    }
  })

  await pool(tasks, CONCURRENCY)

  const savedMB   = (savedBytes / 1024 / 1024).toFixed(2)
  const savedPct  = files.length > 0
    ? Math.round((savedBytes / files.reduce((sum, f) => sum + fs.statSync(
        // source gone if !KEEP_ORIGINALS, so use dest size as fallback
        fs.existsSync(path.join(IMG_DIR, f)) ? path.join(IMG_DIR, f) : path.join(IMG_DIR, f.replace(/\.(png|jpg|jpeg|gif)$/i, '.webp'))
      ).size, 0)) * 100)
    : 0

  console.log(`\nconverted=${converted}  skipped=${skipped}  failed=${failed}`)
  console.log(`Space saved: ${savedMB} MB`)

  if (failures.length) {
    fs.writeFileSync(path.join(__dirname, 'webp-failures.json'), JSON.stringify(failures, null, 2))
    console.log('Failure log → scripts/webp-failures.json')
  }

  // ── Rewrite JSON paths ──────────────────────────────────────────────────
  const swapExt = p => p.replace(/\.(png|jpg|jpeg|gif)$/i, '.webp')

  const questions = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'))
  const updated = questions.map(q => ({
    ...q,
    question_images: (q.question_images || []).map(swapExt),
    answer_images:   (q.answer_images   || []).map(swapExt),
  }))
  fs.writeFileSync(JSON_PATH, JSON.stringify(updated, null, 2))
  console.log('JSON updated → src/data/AZ-204_Final_Processed_Questions.json')

  // ── Rewrite manifest ────────────────────────────────────────────────────
  if (fs.existsSync(MANIFEST)) {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
    const updatedManifest = manifest.map(entry => ({
      ...entry,
      filename:   swapExt(entry.filename),
      gatsbyPath: swapExt(entry.gatsbyPath),
    }))
    fs.writeFileSync(MANIFEST, JSON.stringify(updatedManifest, null, 2))
    console.log('Manifest updated → static/exam-images/manifest.json')
  }

  console.log('\nDone. Reload the dev server to see the lighter images.')
}

main().catch(e => { console.error(e); process.exit(1) })
