// Vercel serverless entry for the private enquiry form. Reuses the same
// validated handler as the Node server; secrets come only from Vercel env vars.
import { handleContact } from '../server/contact.js'

export default async function handler(req, res) {
 const rawBody = typeof req.body === 'string' ? req.body : req.body === undefined || req.body === null ? '' : JSON.stringify(req.body)
 const ip = req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown'
 const result = await handleContact({
  method: req.method, origin: req.headers.origin, allowedOrigin: process.env.CONTACT_ORIGIN,
  contentType: req.headers['content-type'], rawBody, ip
 }, process.env)
 res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Content-Type-Options', 'nosniff')
 if (result.status === 405) res.setHeader('Allow', 'POST')
 res.status(result.status).end(JSON.stringify(result.body))
}
