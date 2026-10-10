import { defineConfig, loadEnv } from 'vite'
import { contactMiddleware } from './server/contact.js'
export default defineConfig(({ mode }) => {
 const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
 return {
  root: '.', publicDir: 'public', build: { outDir: 'dist', emptyOutDir: true, sourcemap: false },
  plugins: [{ name: 'private-contact-form', configureServer(server) {
   server.middlewares.use('/api/contact', (req, res) => contactMiddleware(req, res, env, env.CONTACT_ORIGIN || 'http://127.0.0.1:5173'))
  } }]
 }
})
