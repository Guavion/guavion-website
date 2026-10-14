import './style.css'
const nav = document.querySelector('#navigation'), menu = document.querySelector('.menu-toggle')
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation') }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation') })
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu))
document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus() } })
matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) closeMenu() })
const applications = {
cfd: { label: 'CFD & ENGINEERING', title: 'Explore the flow.\nExpand the design space.', description: 'Qengine brings Guavion’s workflow approach to computational fluid dynamics, connecting natural-language mesh generation with a proprietary simulation engine.', points: ['Natural-language geometry and meshing', 'Efficient simulation on existing hardware', 'Structured results for engineering decisions'], objective: '“Generate a mesh and compare these flow conditions.”', output: 'Simulation-ready mesh · flow analysis · design comparison', cta: 'Discuss a CFD workflow' },
materials: { label: 'MATERIALS CHEMISTRY', title: 'Better materials.\nFewer disconnected steps.', description: 'Define a target material property. Bring simulation and AI together to explore candidates, compare results, and preserve the reasoning behind each decision.', points: ['Customer-defined materials objectives', 'Simulation and AI execution', 'Ranked recommendations with provenance'], objective: '“Design a better silicon carbide material.”', output: 'Candidate comparison · validated outputs · traceable decisions', cta: 'Discuss a materials pilot' },
molecules: { label: 'MOLECULAR DISCOVERY', title: 'Explore molecules.\nUnderstand the possibilities.', description: 'Connect structure retrieval, molecular visualization, and multi-step scientific tasks. Explore ChopChopMol today, with protein and free-energy perturbation applications in Guavion’s roadmap.', points: ['PubChem and PDB structure retrieval', 'ML potentials and AI-assisted tasks', 'Protein and drug-design application roadmap'], objective: '“Prepare this molecule and compare its conformations.”', output: 'Prepared structures · simulation outputs · reusable analysis', cta: 'Discuss molecular workflows' },
energy: { label: 'COMPUTATIONAL CHEMISTRY', title: 'One scientific question.\nMultiple ways to answer.', description: 'Ground-state energy estimation illustrates Guavion’s vision: define the scientific objective once, then use and validate the computational implementation that fits.', points: ['Scientific inputs and constraints', 'Classical implementations today', 'Hybrid and quantum paths on the roadmap'], objective: '“Estimate the ground-state energy of this system.”', output: 'Energy estimates · method comparison · validation record', cta: 'Discuss energy estimation' }
}
function setupTabs(selector, onSelect) {
 const tabs = [...document.querySelectorAll(selector)]
 function select(tab, focus = false) { tabs.forEach(t => { t.setAttribute('aria-selected', String(t === tab)); t.tabIndex = t === tab ? 0 : -1 }); onSelect(tab); if (focus) tab.focus() }
 tabs.forEach((tab, index) => { tab.addEventListener('click', () => select(tab)); tab.addEventListener('keydown', e => {
 const vertical = tab.parentElement.getAttribute('aria-orientation') === 'vertical'; let target
 if (e.key === (vertical ? 'ArrowDown' : 'ArrowRight')) target = tabs[(index + 1) % tabs.length]
 if (e.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) target = tabs[(index - 1 + tabs.length) % tabs.length]
 if (e.key === 'Home') target = tabs[0]; if (e.key === 'End') target = tabs.at(-1)
 if (target) { e.preventDefault(); select(target, true) }
 }) }); return select
}
setupTabs('[data-application]', tab => {
 const item = applications[tab.dataset.application]
 document.querySelector('#application-panel').setAttribute('aria-labelledby', tab.id)
 document.querySelector('#application-label').textContent = item.label
 const title = document.querySelector('#application-title'); title.replaceChildren()
 item.title.split('\n').forEach((line, i) => { if(i) title.append(document.createElement('br')); title.append(document.createTextNode(line)) })
 document.querySelector('#application-description').textContent = item.description
 document.querySelector('#application-points').replaceChildren(...item.points.map(text => { const li = document.createElement('li'); li.textContent = text; return li }))
 document.querySelector('#objective-text').textContent = item.objective; document.querySelector('#objective-output').textContent = item.output
 document.querySelector('.application-copy .text-link').textContent = item.cta
})
const steps = [
 ['A question is the starting point.', 'Describe your scientific objective, the inputs you have, and the constraints that matter. The workflow begins with what you want to discover.', 'SCIENTIFIC INTENT', '“Compare candidate materials against a target property.”'],
 ['A plan you can understand.', 'AI reasoning translates the objective into scientific steps. Validated workflows bring together methods, software environments, inputs, and checks before execution.', 'WORKFLOW GENERATION', 'Prepare inputs · choose methods · validate constraints · review the plan'],
 ['The right tools, working together.', 'Run the workflow across scientific software and available compute. Guavion’s platform vision connects execution to the original objective as infrastructure evolves.', 'SIMULATION + ORCHESTRATION', 'Scientific software · CPU · GPU · HPC · cloud'],
 ['An answer with a history.', 'Bring results back into context. Preserve the parameters, inputs, and execution record so teams can compare outcomes, reproduce work, and build on what they learn.', 'RESULTS + AUDIT', 'Structured results · validation · provenance · reusable workflow']
]
let currentStep = 0
const selectStep = setupTabs('[data-step]', tab => {
 currentStep = Number(tab.dataset.step); const step = steps[currentStep]
 document.querySelector('#workflow-panel').setAttribute('aria-labelledby', tab.id)
 document.querySelector('#workflow-title').textContent = step[0]; document.querySelector('#workflow-description').textContent = step[1]
 document.querySelector('#workflow-label').textContent = step[2]; document.querySelector('#workflow-example').textContent = step[3]
 document.querySelector('.workflow-symbol').textContent = String(currentStep + 1).padStart(2, '0')
 document.querySelector('#step-count').textContent = `${String(currentStep + 1).padStart(2, '0')} — 04`
})
document.querySelector('.next-step').addEventListener('click', () => selectStep(document.querySelector(`[data-step="${(currentStep + 1) % steps.length}"]`)))
document.querySelectorAll('[data-interest]').forEach(a => a.addEventListener('click', () => { document.querySelector('#interest').value = a.dataset.interest }))
document.querySelector('#year').textContent = new Date().getFullYear()
const form = document.querySelector('#contact-form'), status = document.querySelector('#form-status')
form.addEventListener('submit', async e => {
 e.preventDefault(); if (!form.reportValidity()) return
 const button = form.querySelector('button[type="submit"]'); if(button.disabled) return
 button.disabled = true; button.textContent = 'Sending…'; status.hidden = false; status.classList.remove('success'); status.textContent = 'Sending your enquiry securely…'
 try {
 const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))), signal: AbortSignal.timeout(15000) })
 const result = await response.json()
 if (!response.ok || !result.ok) throw new Error(result.message || 'We couldn’t send your enquiry. Please try again later.')
 status.textContent = 'Thank you. Your enquiry has been sent to the Guavion team.'; status.classList.add('success'); form.reset()
 } catch(error) { status.textContent = error.name === 'TimeoutError' ? 'The request timed out. Your details are still here; please try again.' : (error.message && !error.message.includes('JSON') && !error.message.includes('fetch') ? error.message : 'We couldn’t reach the enquiry service. Your details are still here; please try again later.')
 } finally { button.disabled = false; button.textContent = 'Send enquiry' }
})

// Respect reduced motion and data saving; pause media when it leaves view.
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)')
const videos = [...document.querySelectorAll('.motion-video')]
let motionPaused = motionPreference.matches || Boolean(navigator.connection?.saveData)
const visibleVideos = new Set()
function refreshMotion() {
 videos.forEach(video => {
  if (motionPaused || document.hidden || !visibleVideos.has(video)) { video.pause(); return }
  if (!video.getAttribute('src')) video.src = video.dataset.src
  video.play().catch(() => { /* Poster remains visible if autoplay is unavailable. */ })
 })
}
const videoObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if(entry.isIntersecting) visibleVideos.add(entry.target); else visibleVideos.delete(entry.target) }); refreshMotion() }, {threshold:.1})
videos.forEach(video => videoObserver.observe(video))
motionPreference.addEventListener('change', e => { motionPaused = e.matches; refreshMotion() })
document.addEventListener('visibilitychange', refreshMotion)
refreshMotion()
