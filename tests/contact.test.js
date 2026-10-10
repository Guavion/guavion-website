import test from 'node:test'
import assert from 'node:assert/strict'
import { handleContact } from '../server/contact.js'
const env = { RESEND_API_KEY:'test-key', CONTACT_FROM:'Website <website@example.com>', CONTACT_TO:'private@example.com' }
const data = { name:'Researcher', email:'researcher@example.org', company:'Lab', interest:'Application pilot', message:'We would like to explore a semiconductor materials workflow.', website:'' }
const input = (overrides = {}) => ({ method:'POST', origin:'https://example.com', allowedOrigin:'https://example.com', contentType:'application/json', rawBody:JSON.stringify(data), ip:crypto.randomUUID(), ...overrides })
test('sends only to configured private recipient and sets reply-to', async () => {
 let sent
 const response = await handleContact(input({ rawBody:JSON.stringify({...data,to:'attacker@example.org'}) }), env, async (url, options) => { assert.equal(url,'https://api.resend.com/emails'); sent=JSON.parse(options.body); return new Response(JSON.stringify({id:'mail-test'}),{status:200}) })
 assert.equal(response.status,200); assert.equal(response.body.ok,true); assert.deepEqual(sent.to,['private@example.com']); assert.equal(sent.reply_to,data.email); assert.equal(JSON.stringify(response).includes('private@example.com'),false)
})
test('missing configuration never reports success or invokes delivery', async () => { let called=false; const r=await handleContact(input(),{},async()=>{called=true}); assert.equal(r.status,503); assert.equal(called,false) })
test('rejects cross-origin requests and invalid payloads before delivery', async () => {
 const noSend=async()=>{throw new Error('Must not send')}
 for (const [overrides,status] of [[{origin:'https://evil.example'},403],[{method:'GET'},405],[{rawBody:'broken'},400],[{rawBody:'x'.repeat(16001)},413],[{contentType:'text/plain'},415],[{rawBody:JSON.stringify({...data,email:'bad\r\nBcc:x@y.z'})},400],[{rawBody:JSON.stringify({...data,message:'short'})},400],[{rawBody:JSON.stringify({...data,website:'spam'})},400]]) assert.equal((await handleContact(input(overrides),env,noSend)).status,status)
})
test('provider rejection or network failure does not report success', async () => {
 assert.equal((await handleContact(input(),env,async()=>new Response('{}',{status:401}))).status,502)
 assert.equal((await handleContact(input(),env,async()=>{throw new Error('timeout')})).status,502)
 assert.equal((await handleContact(input(),env,async()=>new Response('{}',{status:200}))).status,502)
})
test('limits repeated mail requests in the process', async () => {
 const request=input({ip:'rate-test'}); let count=0
 const send=async()=>{count++; return new Response('{"id":"ok"}',{status:200})}
 for(let i=0;i<5;i++) assert.equal((await handleContact(request,env,send)).status,200)
 assert.equal((await handleContact(request,env,send)).status,429); assert.equal(count,5)
})
