import { METHODS, TOPICS, topicById, stageLabel, effortById, evidenceById, kindById } from './data.js'
import './style-lab.css'

const go = (to) => { window.location.hash = to }

// A representative spread across topics + both kinds
const SHOWCASE = [
  'i-want-to-go-home', 'warm-the-bathroom', 'failure-free-activity',
  'calm-the-evening', 'add-contrast', 'hold-both-and',
]
const SAMPLE = 'false-accusation'

function accent(topic) { return { '--l-accent': topic.color } }

export default function StylePreview() {
  const cards = SHOWCASE.map(s => METHODS.find(m => m.slug === s)).filter(Boolean)
  const m = METHODS.find(x => x.slug === SAMPLE)
  const t = topicById(m.topic)

  return (
    <div className="lab">
      <div className="lab-wrap">
        <div className="lab-top">
          <span className="wm">The Holding Co</span>
          <span className="kick">Design Lab · Direction B</span>
          <a href="#/" onClick={(e) => { e.preventDefault(); go('#/') }}>← back to the live site</a>
        </div>

        <div className="lab-note">
          <b>What this is —</b>
          <span>an alternate visual direction for the same content. The live site is unchanged. Nothing here is wired into it.</span>
        </div>

        <header className="lab-hero">
          <div className="eyebrow">Dementia caregiving · field manual</div>
          <h1>Specific things to try, when you have <span className="u" style={accent(t)}>no time to read</span>.</h1>
          <p className="lede">
            A flatter, more editorial take: a porcelain page, a grotesque display face, monospaced
            catalog labels, hairline rules, and color used as a single precise signal per method.
          </p>
          <div className="meta-row">
            <span>Bricolage Grotesque</span>
            <span>IBM Plex Mono</span>
            <span>Porcelain #F3F1E9</span>
            <span>Flat · hairline · squared</span>
            <span>39 methods · 6 topics</span>
          </div>
        </header>

        <section className="lab-sec">
          <div className="h">
            <span className="n">01</span>
            <h2>The method, as a card</h2>
            <span className="meta">Hover to see the signal</span>
          </div>
          <div className="lab-grid">
            {cards.map(c => {
              const ct = topicById(c.topic)
              const ev = evidenceById(c.evidence)
              const ef = effortById(c.effort)
              const k = kindById(c.kind)
              return (
                <button key={c.slug} className="lab-card" style={accent(ct)} onClick={() => go('#/method/' + c.slug)}>
                  <div className="meta">
                    <span className="kindtopic"><span className="sq" />{ct.short}</span>
                    <span className="num">{String(c.n).padStart(2, '0')}</span>
                  </div>
                  <h3>{c.title}</h3>
                  <p className="sum">{c.summary}</p>
                  {c.situations?.[0] && (
                    <div className="when"><b>When — </b>{c.situations[0]}</div>
                  )}
                  <div className="foot">
                    <span className={`kt ${c.kind}`}>{k.one}</span>
                    <span>/ {ev.label}</span>
                    <span>/ {ef.label}</span>
                    <span>/ {c.stages.map(stageLabel).join('·')}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section className="lab-sec">
          <div className="h">
            <span className="n">02</span>
            <h2>Topic palette</h2>
            <span className="meta">One signal colour per topic</span>
          </div>
          <div className="lab-pal">
            {TOPICS.map(tp => (
              <div className="sw" key={tp.id}>
                <div className="chip" style={{ background: tp.color }} />
                <div className="lab-l">{tp.short}<br />{tp.color}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="lab-sec">
          <div className="h">
            <span className="n">03</span>
            <h2>The method, in full</h2>
            <span className="meta">Sample detail page</span>
          </div>
          <article className="lab-detail" style={accent(t)}>
            <div className="dh">
              <div className="ey">
                <span className="sq" /> {t.label}
                <span className={`kt ${m.kind}`}>{kindById(m.kind).one}</span>
                <span style={{ marginLeft: 'auto' }}>№ {String(m.n).padStart(2, '0')}</span>
              </div>
              <h2>{m.title}</h2>
              <p className="sum">{m.summary}</p>
            </div>
            <div className="db">
              <div className="blk">
                <h4>Use this when</h4>
                <ul className="when-list">{m.situations.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
              <div className="blk">
                <h4>Why it works</h4>
                <p className="why">{m.why}</p>
              </div>
              <div className="blk">
                <h4>How to do it</h4>
                <ol className="lsteps">{m.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
              </div>
              {(m.say || m.dontSay) && (
                <div className="blk">
                  <h4>Example scripts</h4>
                  <div className="scripts">
                    <div className="col try">
                      <h5>↳ Try saying</h5>
                      <ul>{m.say.map((s, i) => <li key={i}>{s}</li>)}</ul>
                    </div>
                    <div className="col avoid">
                      <h5>✕ Avoid — it backfires</h5>
                      <ul>{m.dontSay.map((s, i) => <li key={i}>{s}</li>)}</ul>
                    </div>
                  </div>
                </div>
              )}
              <div className="blk">
                <h4>Where this comes from</h4>
                <ul className="srcs">{m.sources.map((s, i) => (
                  <li key={i}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label} ↗</a></li>
                ))}</ul>
              </div>
            </div>
          </article>
        </section>

        <div className="lab-foot">
          <span>The Holding Co — Design Lab</span>
          <span>Alternate direction · not the live site</span>
        </div>
      </div>
    </div>
  )
}
