import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

// ===== API Routes =====

// Get records by date range
app.get('/api/records', async (c) => {
  const db = c.env.DB
  const startDate = c.req.query('start') || '2020-01-01'
  const endDate = c.req.query('end') || '2099-12-31'
  const limit = parseInt(c.req.query('limit') || '50')
  const offset = parseInt(c.req.query('offset') || '0')

  const records = await db.prepare(
    `SELECT r.*, GROUP_CONCAT(p.id || '::' || p.file_name || '::' || COALESCE(p.thumbnail_data,''), '|||') as photo_list
     FROM records r
     LEFT JOIN photos p ON r.id = p.record_id
     WHERE r.record_date BETWEEN ? AND ?
     GROUP BY r.id
     ORDER BY r.record_date DESC
     LIMIT ? OFFSET ?`
  ).bind(startDate, endDate, limit, offset).all()

  const result = records.results.map((r: any) => ({
    ...r,
    photos: r.photo_list ? r.photo_list.split('|||').map((p: string) => {
      const [id, fileName, thumbnail] = p.split('::')
      return { id, fileName, thumbnail }
    }) : []
  }))

  return c.json({ records: result })
})

// Get single record
app.get('/api/records/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')

  const record = await db.prepare('SELECT * FROM records WHERE id = ?').bind(id).first()
  if (!record) return c.json({ error: 'Not found' }, 404)

  const photos = await db.prepare('SELECT * FROM photos WHERE record_id = ? ORDER BY sort_order').bind(id).all()

  return c.json({ record, photos: photos.results })
})

// Create record
app.post('/api/records', async (c) => {
  const db = c.env.DB
  const body = await c.req.json()
  const id = 'rec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6)
  const now = new Date().toISOString()

  await db.prepare(
    `INSERT INTO records (id, record_date, title, content, location, mood, weather, tags, is_draft, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, body.record_date, body.title || null, body.content || '',
    body.location || null, body.mood || null, body.weather || null,
    JSON.stringify(body.tags || []), body.is_draft ? 1 : 0, now, now
  ).run()

  return c.json({ id, success: true })
})

// Update record
app.put('/api/records/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  const body = await c.req.json()
  const now = new Date().toISOString()

  await db.prepare(
    `UPDATE records SET title = ?, content = ?, location = ?, mood = ?, weather = ?, tags = ?, updated_at = ?
     WHERE id = ?`
  ).bind(
    body.title || null, body.content || '', body.location || null,
    body.mood || null, body.weather || null, JSON.stringify(body.tags || []), now, id
  ).run()

  return c.json({ success: true })
})

// Delete record
app.delete('/api/records/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')

  await db.prepare('DELETE FROM photos WHERE record_id = ?').bind(id).run()
  await db.prepare('DELETE FROM records WHERE id = ?').bind(id).run()

  return c.json({ success: true })
})

// Upload photo for a record
app.post('/api/records/:recordId/photos', async (c) => {
  const db = c.env.DB
  const recordId = c.req.param('recordId')

  // Check photo count
  const countResult = await db.prepare('SELECT COUNT(*) as cnt FROM photos WHERE record_id = ?').bind(recordId).first()
  if (countResult && (countResult as any).cnt >= 3) {
    return c.json({ error: '每个日期最多只能选择 3 张照片，请重新选择' }, 400)
  }

  const body = await c.req.json()
  const id = 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6)

  await db.prepare(
    `INSERT INTO photos (id, record_id, file_name, mime_type, thumbnail_data, medium_data, original_data, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, recordId, body.file_name || 'photo.jpg', body.mime_type || 'image/jpeg',
    body.thumbnail || null, body.medium || null, body.original || null,
    body.sort_order || 0
  ).run()

  return c.json({ id, success: true })
})

// Get all photos for gallery
app.get('/api/gallery', async (c) => {
  const db = c.env.DB
  const limit = parseInt(c.req.query('limit') || '100')
  const offset = parseInt(c.req.query('offset') || '0')

  const photos = await db.prepare(
    `SELECT p.id, p.file_name, p.thumbnail_data, p.record_id, r.record_date, r.location
     FROM photos p
     JOIN records r ON p.record_id = r.id
     ORDER BY r.record_date DESC, p.sort_order
     LIMIT ? OFFSET ?`
  ).bind(limit, offset).all()

  const total = await db.prepare('SELECT COUNT(*) as cnt FROM photos').first()

  return c.json({ photos: photos.results, total: (total as any)?.cnt || 0 })
})

// Get random record for recall
app.get('/api/recall/random', async (c) => {
  const db = c.env.DB

  const record = await db.prepare(
    `SELECT r.*, GROUP_CONCAT(p.id || '::' || p.file_name || '::' || COALESCE(p.thumbnail_data,'') || '::' || COALESCE(p.medium_data,''), '|||') as photo_list
     FROM records r
     LEFT JOIN photos p ON r.id = p.record_id
     GROUP BY r.id
     ORDER BY RANDOM()
     LIMIT 1`
  ).all()

  if (record.results.length === 0) {
    return c.json({ record: null })
  }

  const r: any = record.results[0]
  return c.json({
    record: {
      ...r,
      photos: r.photo_list ? r.photo_list.split('|||').map((p: string) => {
        const [id, fileName, thumbnail, medium] = p.split('::')
        return { id, fileName, thumbnail, medium }
      }) : []
    }
  })
})

// Get albums
app.get('/api/albums', async (c) => {
  const db = c.env.DB

  // Auto-generate monthly albums from records
  const monthlyAlbums = await db.prepare(
    `SELECT strftime('%Y-%m', record_date) as month,
            MIN(record_date) as start_date,
            MAX(record_date) as end_date,
            COUNT(*) as item_count
     FROM records
     GROUP BY strftime('%Y-%m', record_date)
     ORDER BY month DESC`
  ).all()

  return c.json({ albums: monthlyAlbums.results })
})

// Get dates with records (for calendar)
app.get('/api/calendar', async (c) => {
  const db = c.env.DB
  const year = c.req.query('year') || new Date().getFullYear().toString()
  const month = c.req.query('month')

  let query = `SELECT record_date, COUNT(*) as record_count FROM records WHERE strftime('%Y', record_date) = ?`
  const params: any[] = [year]

  if (month) {
    query += ` AND strftime('%m', record_date) = ?`
    params.push(month.padStart(2, '0'))
  }

  query += ` GROUP BY record_date`

  const stmt = db.prepare(query)
  const result = await stmt.bind(...params).all()

  return c.json({ dates: result.results })
})

// Get stats for profile
app.get('/api/stats', async (c) => {
  const db = c.env.DB

  const totalRecords = await db.prepare('SELECT COUNT(*) as cnt FROM records').first()
  const totalPhotos = await db.prepare('SELECT COUNT(*) as cnt FROM photos').first()
  const firstRecord = await db.prepare('SELECT record_date FROM records ORDER BY record_date ASC LIMIT 1').first()

  let daysSinceFirst = 0
  if (firstRecord) {
    const first = new Date((firstRecord as any).record_date)
    daysSinceFirst = Math.floor((Date.now() - first.getTime()) / (1000 * 60 * 60 * 24))
  }

  // Count complete weeks
  const weeks = await db.prepare(
    `SELECT strftime('%Y-%W', record_date) as week, COUNT(DISTINCT record_date) as days
     FROM records GROUP BY week HAVING days >= 7`
  ).all()

  return c.json({
    totalRecords: (totalRecords as any)?.cnt || 0,
    totalPhotos: (totalPhotos as any)?.cnt || 0,
    completeWeeks: weeks.results.length,
    daysSinceFirst
  })
})

export default app
