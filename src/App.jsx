import { useEffect, useMemo, useState } from 'react'
import {
  METHODS, TOPICS, STAGES, EFFORTS, EVIDENCE, KINDS, QUICK_ENTRIES, TOOLKINDS,
  topicById, stageLabel, effortById, evidenceById, kindById,
} from './data.js'
import Icon, { TOOL_ICON } from './Icon.jsx'
import StylePreview from './StylePreview.jsx'

/* ---------------- tiny hash router ---------------- */
function useRoute() {
  const [hash, setHash] = useState(() => window.location.hash || '#/')
  useEffect(() => {
    const on = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return hash
}
const go = (to) => { window.location.hash = to }

/* apply a topic accent via CSS vars */
function accentVars(topic) {
  return { '--accent': topic.color, '--accent-wash': topic.wash }
}

/* ---------------- search / filter engine ---------------- */
function methodText(m) {
  const t = topicById(m.topic)
  return [
    m.title, m.summary, m.why, t.label,
    ...(m.situations || []),
    ...(m.steps || []), ...(m.say || []), ...(m.dontSay || []),
  ].join(' ').toLowerCase()
}
function scoreMethod(m, q) {
  if (!q) return 1
  const words = q.toLowerCase().split(/\s+/).filter(Boolean)
  const hay = methodText(m)
  const sit = (m.situations || []).join(' ').toLowerCase()
  const title = m.title.toLowerCase()
  let s = 0
  for (const w of words) {
    if (!hay.includes(w)) continue
    s += 1
    if (sit.includes(w)) s += 2
    if (title.includes(w)) s += 1.5
  }
  return s
}

/* ======================================================= */
export default function App() {
  const route = useRoute()
  useEffect(() => { window.scrollTo(0, 0) }, [route])

  // The design lab is a fully self-contained alternate skin — render it without the live chrome.
  if (route.startsWith('#/lab')) return <StylePreview />

  let view = <Browse />
  const m = route.match(/^#\/method\/(.+)$/)
  if (m) {
    const method = METHODS.find(x => x.slug === decodeURIComponent(m[1]))
    view = method ? <Detail method={method} /> : <Browse />
  } else if (route.startsWith('#/about')) {
    view = <About />
  }

  return (
    <div className="shell">
      <Header />
      {view}
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => go('#/')} aria-label="What Works — home">
        <span className="mark">What <em>Works</em></span>
        <span className="by">The Holding Co</span>
      </button>
      <nav>
        <button className="navlink" onClick={() => go('#/')}>Methods</button>
        <button className="navlink" onClick={() => go('#/about')}>About</button>
      </nav>
    </header>
  )
}

/* ---------------- Browse (home) ---------------- */
function Browse() {
  const [query, setQuery] = useState('')
  const [kinds, setKinds] = useState(() => new Set())
  const [topics, setTopics] = useState(() => new Set())
  const [stages, setStages] = useState(() => new Set())
  const [efforts, setEfforts] = useState(() => new Set())
  const [evidences, setEvidences] = useState(() => new Set())
  const [sort, setSort] = useState('relevance')
  const [showFilters, setShowFilters] = useState(false)

  const toggle = (setter) => (val) => setter(prev => {
    const next = new Set(prev)
    next.has(val) ? next.delete(val) : next.add(val)
    return next
  })
  const reset = () => { setKinds(new Set()); setTopics(new Set()); setStages(new Set()); setEfforts(new Set()); setEvidences(new Set()); setQuery('') }
  const activeCount = kinds.size + topics.size + stages.size + efforts.size + evidences.size

  const results = useMemo(() => {
    let list = METHODS
      .map(m => ({ m, score: scoreMethod(m, query) }))
      .filter(({ m, score }) => {
        if (query && score <= 0) return false
        if (kinds.size && !kinds.has(m.kind)) return false
        if (topics.size && !topics.has(m.topic)) return false
        if (stages.size && !m.stages.some(s => stages.has(s))) return false
        if (efforts.size && !efforts.has(m.effort)) return false
        if (evidences.size && !evidences.has(m.evidence)) return false
        return true
      })
    if (sort === 'relevance' && query) list.sort((a, b) => b.score - a.score)
    else if (sort === 'number') list.sort((a, b) => a.m.n - b.m.n)
    else list.sort((a, b) => a.m.n - b.m.n)
    return list.map(x => x.m)
  }, [query, kinds, topics, stages, efforts, evidences, sort])

  const kindCounts = useMemo(() => {
    const c = {}
    for (const m of METHODS) {
      if (query && scoreMethod(m, query) <= 0) continue
      if (topics.size && !topics.has(m.topic)) continue
      if (stages.size && !m.stages.some(s => stages.has(s))) continue
      if (efforts.size && !efforts.has(m.effort)) continue
      if (evidences.size && !evidences.has(m.evidence)) continue
      c[m.kind] = (c[m.kind] || 0) + 1
    }
    return c
  }, [query, topics, stages, efforts, evidences])

  // counts per topic for the rail (respecting current query but not topic filter)
  const topicCounts = useMemo(() => {
    const c = {}
    for (const m of METHODS) {
      if (query && scoreMethod(m, query) <= 0) continue
      if (kinds.size && !kinds.has(m.kind)) continue
      if (stages.size && !m.stages.some(s => stages.has(s))) continue
      if (efforts.size && !efforts.has(m.effort)) continue
      if (evidences.size && !evidences.has(m.evidence)) continue
      c[m.topic] = (c[m.topic] || 0) + 1
    }
    return c
  }, [query, kinds, stages, efforts, evidences])

  return (
    <>
      <section className="hero">
        <div className="eyebrow">For dementia caregivers</div>
        <h1>Strategies for caring for someone with <em>dementia</em>.</h1>
        <p className="lede">Search what’s happening, or browse by what’s hardest right now.</p>

        <div className="searchwrap">
          <div className="searchbox">
            <Icon name="search" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="What’s happening? e.g. “won’t shower”, “asks to go home”, “up all night”"
              aria-label="Search methods"
            />
            {query
              ? <button className="clearbtn" onClick={() => setQuery('')} aria-label="Clear search"><Icon name="x" /></button>
              : <span className="go" aria-hidden="true">Search</span>}
          </div>
        </div>

        <div className="quickrow">
          <span className="ql">Hardest right now</span>
          {QUICK_ENTRIES.map(q => (
            <button
              key={q.label}
              className={`chip ${query === q.q ? 'active' : ''}`}
              onClick={() => setQuery(query === q.q ? '' : q.q)}
            >
              <Icon name={q.icon} />{q.label}
            </button>
          ))}
        </div>
      </section>

      <div className="browse">
        <aside className={`rail ${showFilters ? '' : 'collapsed'}`}>
          <FilterGroup title="I’m looking for">
            {KINDS.map(k => (
              <button key={k.id} className={`filteritem ${kinds.has(k.id) ? 'on' : ''}`} onClick={() => toggle(setKinds)(k.id)} title={k.note}>
                <span className="dot" />{k.label}
                <span className="cnt">{kindCounts[k.id] || 0}</span>
              </button>
            ))}
          </FilterGroup>

          <FilterGroup title="Topic">
            {TOPICS.map(t => (
              <button key={t.id} className={`filteritem ${topics.has(t.id) ? 'on' : ''}`} onClick={() => toggle(setTopics)(t.id)}>
                <span className="swatch" style={{ background: t.color }} />
                {t.label}
                <span className="cnt">{topicCounts[t.id] || 0}</span>
              </button>
            ))}
          </FilterGroup>

          <FilterGroup title="Stage">
            {STAGES.map(s => (
              <button key={s.id} className={`filteritem ${stages.has(s.id) ? 'on' : ''}`} onClick={() => toggle(setStages)(s.id)}>
                <span className="dot" />{s.label} stage
              </button>
            ))}
          </FilterGroup>

          <FilterGroup title="Effort">
            {EFFORTS.map(e => (
              <button key={e.id} className={`filteritem ${efforts.has(e.id) ? 'on' : ''}`} onClick={() => toggle(setEfforts)(e.id)} title={e.note}>
                <span className="dot" />{e.label}
              </button>
            ))}
          </FilterGroup>

          <FilterGroup title="Evidence">
            {EVIDENCE.map(e => (
              <button key={e.id} className={`filteritem ${evidences.has(e.id) ? 'on' : ''}`} onClick={() => toggle(setEvidences)(e.id)} title={e.note}>
                <span className="dot" />{e.label}
              </button>
            ))}
          </FilterGroup>

          {activeCount > 0 && <button className="resetbtn" onClick={reset}>Clear all filters</button>}
        </aside>

        <div className="results">
          <div className="resulthead">
            <span className="count">
              <b>{results.length}</b> method{results.length === 1 ? '' : 's'}
              {query && <> for “{query}”</>}
              {activeCount > 0 && <> · {activeCount} filter{activeCount === 1 ? '' : 's'}</>}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="sortsel" style={{ display: 'none' }} />
              <button className="sortsel" onClick={() => setShowFilters(v => !v)} aria-expanded={showFilters}>
                {showFilters ? 'Hide filters' : `Filters${activeCount ? ` (${activeCount})` : ''}`}
              </button>
              <select className="sortsel" value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort">
                <option value="relevance">{query ? 'Most relevant' : 'In order'}</option>
                <option value="number">By number</option>
              </select>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="emptyresult">
              <h3>No method matches that yet.</h3>
              <p>Try a plainer word for what’s happening — “bath”, “night”, “angry”, “won’t eat” — or clear your filters.</p>
              <button className="chip" onClick={reset} style={{ marginTop: 10 }}>Clear search & filters</button>
            </div>
          ) : (
            <div className="grid">
              {results.map(m => <Card key={m.slug} method={m} />)}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function FilterGroup({ title, children }) {
  return (
    <div className="filtergroup">
      <h4>{title}</h4>
      {children}
    </div>
  )
}

/* ---------------- Method card ---------------- */
function Card({ method: m }) {
  const t = topicById(m.topic)
  return (
    <button className="card" style={accentVars(t)} onClick={() => go('#/method/' + m.slug)}>
      <div className="toptag">
        <span className="tag"><span className="swatch" style={{ background: t.color }} />{t.label}</span>
        <span className="num">№ {String(m.n).padStart(2, '0')}</span>
      </div>
      <h3>{m.title}</h3>
      <p className="sum">{m.summary}</p>
      {m.situations?.[0] && (
        <div className="when"><span className="lbl">When</span><span>{m.situations[0]}</span></div>
      )}
      {m.tool && (
        <div className="toolhint">
          <Icon name={TOOL_ICON[m.tool.kind]} />{TOOLKINDS[m.tool.kind].label}
        </div>
      )}
    </button>
  )
}

/* ---------------- Detail ---------------- */
function Detail({ method: m }) {
  const t = topicById(m.topic)
  const ev = evidenceById(m.evidence)
  const ef = effortById(m.effort)
  const related = (m.related || []).map(s => METHODS.find(x => x.slug === s)).filter(Boolean).filter(x => x.slug !== m.slug)
  const tool = m.tool && TOOLKINDS[m.tool.kind]

  return (
    <article className="detail center-col" style={accentVars(t)}>
      <button className="backlink" onClick={() => go('#/')}><Icon name="arrowLeft" />All methods</button>

      <header className="detail-head">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <span className="tag"><span className="swatch" style={{ background: t.color }} />{t.label}</span>
          <span className="toptag-right">
            <span className={`kindtag kind-${m.kind}`}>{kindById(m.kind).one}</span>
            <span className="num">№ {String(m.n).padStart(2, '0')}</span>
          </span>
        </div>
        <h1>{m.title}</h1>
        <p className="sum">{m.summary}</p>
        <div className="badges">
          <span className={`badge evi-${m.evidence}`}><Icon name={m.evidence === 'research' ? 'flask' : m.evidence === 'clinical' ? 'badge' : 'heart'} />{ev.label}</span>
          <span className="badge"><Icon name="clock" />{ef.label} · {ef.note}</span>
          <span className="badge"><Icon name="layers" />{m.stages.map(stageLabel).join(' · ')} stage</span>
        </div>
      </header>

      {m.situations?.length > 0 && (
        <div className="usewhen">
          <h4>Use this when</h4>
          <ul>{m.situations.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
      )}

      <section className="section">
        <h2><Icon name="spark" />Why it works</h2>
        <p className="why">{m.why}</p>
      </section>

      <section className="section">
        <h2><Icon name="check" />How to do it</h2>
        <ol className="steps">{m.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
      </section>

      {(m.say?.length || m.dontSay?.length) ? (
        <section className="section">
          <h2><Icon name="message" />Example scripts</h2>
          <p className="section-note">Words to borrow, not a script to read out. Adapt them to your own voice and the moment.</p>
          <div className="saygrid">
            {m.say?.length > 0 && (
              <div className="saybox say">
                <h5><Icon name="check" />Try saying</h5>
                <ul>{m.say.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            )}
            {m.dontSay?.length > 0 && (
              <div className="saybox dont">
                <h5><Icon name="x" />Avoid — it backfires</h5>
                <ul>{m.dontSay.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            )}
          </div>
          {m.tool?.kind === 'practice' && (
            <p className="section-note" style={{ marginTop: 12 }}>
              <Icon name="message" /> Soon you’ll be able to <strong>practice this conversation</strong> out loud and get gentle feedback.
            </p>
          )}
        </section>
      ) : null}

      {m.watchOut?.length > 0 && (
        <section className="section">
          <div className="watchbox">
            <h5><Icon name="alert" />Watch out for</h5>
            <ul>{m.watchOut.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
        </section>
      )}

      {tool && (
        <section className="section">
          <h2><Icon name="zap" />A tool to help you use this</h2>
          <div className="toolcard">
            <span className="ic"><Icon name={TOOL_ICON[m.tool.kind]} /></span>
            <div>
              <div className="tt">{tool.label}</div>
              <div className="ts">{tool.verb}</div>
            </div>
            <span className="soon">Coming soon</span>
          </div>
        </section>
      )}

      <section className="section">
        <h2><Icon name="list" />Where this comes from</h2>
        <ul className="srclist">
          {m.sources.map((s, i) => (
            <li key={i}><a href={s.url} target="_blank" rel="noopener noreferrer"><Icon name="external" />{s.label}</a></li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section className="section">
          <h2><Icon name="arrowRight" />{m.kind === 'scenario' ? 'The practices behind this moment' : 'Pairs well with'}</h2>
          <div className="relgrid">
            {related.map(r => {
              const rt = topicById(r.topic)
              const rk = kindById(r.kind)
              return (
                <button key={r.slug} className="relcard" style={accentVars(rt)} onClick={() => go('#/method/' + r.slug)}>
                  <span className="tag"><span className="swatch" style={{ background: rt.color }} />{rt.short} · {rk.one}</span>
                  <h4>{r.title}</h4>
                </button>
              )
            })}
          </div>
        </section>
      )}
    </article>
  )
}

/* ---------------- About ---------------- */
function About() {
  return (
    <article className="prose center-col" style={{ paddingTop: 14 }}>
      <button className="backlink" onClick={() => go('#/')}><Icon name="arrowLeft" />All methods</button>
      <h1>About What Works</h1>
      <p className="lede">
        A calm, searchable field guide of specific things to try when you’re caring for someone with dementia —
        each one concrete, evidence-informed, and written for a real, tired day.
      </p>

      <h2>Why methods, not articles</h2>
      <p>
        Most dementia advice is written as long articles you have to read in full and translate into action — usually
        the last thing a stressed caregiver has time for. We’ve broken the guidance into <strong>methods</strong>: one
        specific thing you can do, with the situation it’s for, the steps, what to say, what to watch out for, and the
        evidence behind it. You arrive with a problem (“she won’t bathe”), and leave with something to try in the next ten minutes.
      </p>

      <h2>How methods are labeled</h2>
      <p>Every method carries an honest evidence label, because not all advice is equally proven:</p>
      <ul>
        <li><strong>Research-backed</strong> — supported by controlled or peer-reviewed studies.</li>
        <li><strong>Clinical guidance</strong> — recommended by major dementia organizations (Alzheimer’s Association, NIA, Alzheimer’s Society, NHS, Family Caregiver Alliance).</li>
        <li><strong>Caregiver-tested</strong> — practice wisdom that families widely report works, where formal evidence is thinner.</li>
      </ul>
      <p>
        Methods also tell you the <strong>stage</strong> they fit (early, middle, late), the <strong>effort</strong> involved
        (use it in the moment, set it up once, or build it into a habit), and link to their original sources so you can read deeper.
      </p>

      <h2>The tools, coming next</h2>
      <p>
        Several methods hint at a tool we’re building to help you actually use them — a place to <em>practice</em> a hard
        conversation with an AI coach and get gentle feedback, short <em>how-to videos</em> for home changes, one-page
        <em> printables</em> for the fridge or the care team, gentle <em>reminders</em>, and reminiscence <em>playlists</em>.
        Those are marked “Coming soon.”
      </p>

      <div className="disclaimer">
        <strong>This is caregiving support, not medical advice.</strong> Methods here are general approaches gathered from
        reputable dementia organizations and research. They don’t replace guidance from your loved one’s doctor, pharmacist,
        or care team — especially for medications, swallowing problems, sleep medication, and any sudden change in behavior or
        health (which can signal a treatable medical cause). If you or your loved one is in crisis, contact your local emergency
        services. In the US, the Alzheimer’s Association 24/7 Helpline is 800-272-3900, and the 988 Suicide & Crisis Lifeline is reachable by call or text.
      </div>
    </article>
  )
}

function Footer() {
  return (
    <footer className="foot">
      <span>What Works · a project of The Holding Co · {METHODS.length} methods</span>
      <span>Sourced from the Alzheimer’s Association, NIA, Alzheimer’s Society (UK), NHS, Family Caregiver Alliance, Dementia UK & peer-reviewed research. · <a href="#/lab" onClick={(e) => { e.preventDefault(); go('#/lab') }}>Design lab ↗</a></span>
    </footer>
  )
}
