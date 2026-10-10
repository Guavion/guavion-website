import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { contactMiddleware } from './contact.js'
try { process.loadEnvFile('.env.local') } catch (error) { if (error.code !== 'ENOENT') throw error }
const root = resolve('dist'), port = Number(process.env.PORT || 4173)
const origin = process.env.CONTACT_ORIGIN || `http://127.0.0.1:${port}`
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.png':'image/png', '.webp':'image/webp', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.mp4':'video/mp4' }
createServer(async (req, res) => {
 const pathname = new URL(req.url, origin).pathname
 if (pathname === '/api/contact') return contactMiddleware(req, res, process.env, origin)
 if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405, { Allow:'GET, HEAD' }); return res.end() }
 try {
  const file = resolve(root, '.' + decodeURIComponent(pathname === '/' ? '/index.html' : pathname))
  if (!file.startsWith(root + sep) || !(await stat(file)).isFile()) throw new Error('Not found')
  const body = await readFile(file)
  res.writeHead(200, { 'Content-Type':types[extname(file)] || 'application/octet-stream', 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'strict-origin-when-cross-origin', 'Cache-Control': extname(file) === '.html' ? 'no-cache' : 'public, max-age=3600' })
  res.end(req.method === 'HEAD' ? undefined : body)
 } catch { res.writeHead(404); res.end('Not found') }
}).listen(port, '127.0.0.1', () => console.log(`Guavion production preview: http://127.0.0.1:${port}`))
