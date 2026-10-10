const interests = new Set(['Application pilot', 'Discovery program', 'Enterprise deployment', 'Research partnership', 'CFD & engineering', 'Something else'])
const limits = new Map()
const json = (status, message, ok = false) => ({ status, body: { ok, ...(message ? { message } : {}) } })
export async function handleContact({ method, origin, allowedOrigin, contentType, rawBody, ip = 'unknown' }, env, send = fetch) {
 if (method !== 'POST') return json(405, 'Only POST requests are accepted.')
 if (!origin || origin !== allowedOrigin) return json(403, 'Please send your enquiry through this website.')
 if (!contentType?.startsWith('application/json')) return json(415, 'Please submit the enquiry form.')
 if (Buffer.byteLength(rawBody || '') > 16000) return json(413, 'Your enquiry is too long.')
 let data
 try { data = JSON.parse(rawBody) } catch { return json(400, 'Please check your enquiry and try again.') }
 if (!data || typeof data !== 'object' || Array.isArray(data)) return json(400, 'Invalid enquiry.')
 if (data.website) return json(400, 'Please check your enquiry and try again.')
 for (const [field, max] of Object.entries({ name: 120, email: 254, company: 200, interest: 80, message: 5000 })) {
  if (data[field] !== undefined && typeof data[field] !== 'string') return json(400, 'Please check the form fields.')
  data[field] = (data[field] || '').trim()
  if (data[field].length > max) return json(400, 'One of the form fields is too long.')
 }
 if (!data.name || /[\r\n]/.test(data.name) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.message.length < 10 || !interests.has(data.interest)) return json(400, 'Please provide your name, a valid email, and a message of at least 10 characters.')
 if (!env.RESEND_API_KEY || !env.CONTACT_FROM || !env.CONTACT_TO) return json(503, 'The enquiry service is temporarily unavailable. Your details have not been sent. Please try again later.')
 const now = Date.now()
 for (const [key, value] of limits) if (value.until < now) limits.delete(key)
 const window = limits.get(ip) || { count: 0, until: now + 600000 }
 if (window.count >= 5 || limits.size >= 10000) return json(429, 'Please wait a few minutes before sending another enquiry.')
 window.count++; limits.set(ip, window)
 try {
  const response = await send('https://api.resend.com/emails', {
   method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
   body: JSON.stringify({ from: env.CONTACT_FROM, to: [env.CONTACT_TO], reply_to: data.email, subject: `Guavion website: ${data.interest}`, text: `Name: ${data.name}\nEmail: ${data.email}\nOrganization: ${data.company || 'Not provided'}\nInterest: ${data.interest}\n\n${data.message}` }), signal: AbortSignal.timeout(10000)
  })
  if (!response.ok) return json(502, 'We couldn’t send your enquiry. Your details are still here; please try again later.')
  const result = await response.json()
  if (!result.id) return json(502, 'Delivery could not be confirmed. Please try again later.')
  return json(200, '', true)
 } catch { return json(502, 'We couldn’t reach the email service. Please try again later.') }
}
export async function contactMiddleware(req, res, env, allowedOrigin) {
 let rawBody = '', oversized = false
 try {
  for await (const chunk of req) { rawBody += chunk.toString(); if (Buffer.byteLength(rawBody) > 16000) { oversized = true; break } }
  const result = oversized ? json(413, 'Your enquiry is too long.') : await handleContact({ method: req.method, origin: req.headers.origin, allowedOrigin, contentType: req.headers['content-type'], rawBody, ip: req.socket.remoteAddress }, env)
  res.writeHead(result.status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...(result.status === 405 ? { Allow: 'POST' } : {}) })
  res.end(JSON.stringify(result.body))
 } catch { if (!res.headersSent) res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ ok:false, message:'Please check your enquiry and try again.' })) }
}
