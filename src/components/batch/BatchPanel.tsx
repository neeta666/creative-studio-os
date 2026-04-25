import { useState, useRef } from 'react'
import type { BatchTopic, BatchStatus } from '@/types/batch'
import type { Variant } from '@/api/generateService'
import TopicRow from './TopicRow'
import { generateVariants } from '@/api/generateService'
import usePersonaStore from '@/store/usePersonaStore'

const MAX_TOPICS = 10

// ── Shared button styles ──────────────────────────────────────────────────

const btnPrimary = `
  px-4 py-[7px] rounded-sm text-[13px] font-medium
  bg-accent text-white hover:opacity-90 transition-opacity
  disabled:opacity-40 disabled:cursor-not-allowed
`
const btnOutline = `
  px-4 py-[7px] rounded-sm text-[13px] font-medium
  border border-[#2a2a2e] text-text-secondary
  hover:text-text-primary hover:border-[#3a3a3e] transition-colors
`
const btnGhost = `
  px-4 py-[7px] rounded-sm text-[13px] font-medium
  text-text-muted hover:text-text-secondary transition-colors
`

// ── Mode switch ───────────────────────────────────────────────────────────

type Mode = 'single' | 'batch'

function ModeSwitch({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="flex gap-1 p-1 bg-bg-elevated rounded-md w-fit">
      {(['single', 'batch'] as Mode[]).map(m => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={[
            'px-4 py-[6px] rounded-sm text-[12px] font-medium transition-colors duration-150',
            mode === m
              ? 'bg-bg-hover text-text-primary'
              : 'text-text-muted hover:text-text-secondary',
          ].join(' ')}
        >
          {m === 'single' ? 'Single Post' : 'Batch Generation'}
        </button>
      ))}
    </div>
  )
}

// ── Single result card ────────────────────────────────────────────────────

function SingleResult({ result }: { result: Variant }) {
  return (
    <div className="bg-bg-elevated border border-[#2a2a2e] rounded-sm p-4 flex flex-col gap-3">
      <span className="text-[13px] font-semibold text-text-primary leading-snug">
        {result.title}
      </span>
      <p className="text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap">
        {result.content}
      </p>
      <span className="text-[11px] text-text-muted">
        {result.word_count} words
      </span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────

export default function BatchPanel({
  onResult,
  onGenerating,
}: {
  onResult?:    (v: Variant | null) => void
  onGenerating?: () => void
}) {
  const persona = usePersonaStore(state => state.getActivePersona())

  // ── Mode ─────────────────────────────────────────────────────────────────

  const [mode, setMode] = useState<Mode>('single')

  function handleModeChange(m: Mode) {
    setMode(m)
    onResult?.(null)
    // Reset single state
    setSingleInput('')
    setSingleResult(null)
    setSingleLoading(false)
    setSingleError('')
    // Reset batch state
    setInput('')
    setTopics([])
    setBatchStatus('idle')
    cancelRef.current = false
  }

  // ── Single post state ─────────────────────────────────────────────────────

  const [singleInput,   setSingleInput]   = useState('')
  const [singleResult,  setSingleResult]  = useState<Variant | null>(null)
  const [singleLoading, setSingleLoading] = useState(false)
  const [singleError,   setSingleError]   = useState('')

  async function handleSingleGenerate() {
    const topic = singleInput.trim()
    if (!topic) return

    setSingleLoading(true)
    setSingleResult(null)
    setSingleError('')
    onGenerating?.()

    try {
      const variants = await generateVariants({
        topic,
        persona: persona?.label ?? 'Default',
      })
      setSingleResult(variants[0])
      onResult?.(variants[0])
    } catch (err) {
      setSingleError(
        err instanceof Error ? err.message : 'Generation failed. Please try again.'
      )
    } finally {
      setSingleLoading(false)
    }
  }

  function handleSingleClear() {
    setSingleInput('')
    setSingleResult(null)
    setSingleError('')
    onResult?.(null)
  }

  // ── Batch state ───────────────────────────────────────────────────────────

  const [input,       setInput]       = useState('')
  const [topics,      setTopics]      = useState<BatchTopic[]>([])
  const [batchStatus, setBatchStatus] = useState<BatchStatus>('idle')

  const cancelRef = useRef(false)

  const allLines     = input.split('\n').map(l => l.trim()).filter(Boolean)
  const overLimit    = allLines.length > MAX_TOPICS
  const lines        = allLines.slice(0, MAX_TOPICS)   // still used by handleStart
  const topicCount   = allLines.length                 // reflects actual typed count
  const completed  = topics.filter(t => t.status === 'completed').length
  const failed     = topics.filter(t => t.status === 'failed').length
  const isDone     = batchStatus === 'done' || batchStatus === 'cancelled'
  const isRunning  = batchStatus === 'running'
  const inProgress = topics.filter(t => t.status === 'processing').length

  function handleStart() {
    if (topicCount === 0) return

    const initialTopics: BatchTopic[] = lines.map((text, i) => ({
      id:     `topic_${i}`,
      text,
      status: 'pending',
    }))

    cancelRef.current = false
    setTopics(initialTopics)
    setBatchStatus('running')
    processNext(initialTopics, 0)
  }

  async function processNext(topicList: BatchTopic[], idx: number) {
    if (cancelRef.current || idx >= topicList.length) {
      setBatchStatus(cancelRef.current ? 'cancelled' : 'done')
      return
    }

    setTopics(prev =>
      prev.map((t, i) => i === idx ? { ...t, status: 'processing' } : t)
    )

    try {
      const variants = await generateVariants({
        topic:   topicList[idx].text,
        persona: persona?.label ?? 'Default',
      })

      if (cancelRef.current) {
        setBatchStatus('cancelled')
        return
      }

      setTopics(prev =>
        prev.map((t, i) =>
          i === idx
            ? { ...t, status: 'completed', result: variants[0] }
            : t
        )
      )
      onResult?.(variants[0])
    } catch {
      setTopics(prev =>
        prev.map((t, i) =>
          i === idx ? { ...t, status: 'failed' } : t
        )
      )
    }

    processNext(topicList, idx + 1)
  }

  function handleCancel() {
    cancelRef.current = true
  }

  function handleClear() {
    cancelRef.current = true
    setInput('')
    setTopics([])
    setBatchStatus('idle')
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5">

      {/* Mode switch */}
      <ModeSwitch mode={mode} onChange={handleModeChange} />

      {/* ── SINGLE POST MODE ─────────────────────────────────────────────── */}
      {mode === 'single' && (
        <div className="flex flex-col gap-4">

          <div className="bg-bg-surface border border-[#1f1f23] rounded-lg p-5">

            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted block mb-3">
              Topic
            </span>

            <input
              type="text"
              value={singleInput}
              onChange={e => setSingleInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !singleLoading && handleSingleGenerate()}
              disabled={singleLoading}
              placeholder="Enter a topic to generate a post…"
              className="
                w-full bg-bg-elevated border border-[#2a2a2e] rounded-sm
                px-[14px] py-[10px] text-[13px] text-text-primary font-body
                placeholder:text-text-muted outline-none
                focus:border-accent transition-colors duration-150
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            />

            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleSingleGenerate}
                disabled={singleLoading || !singleInput.trim()}
                className={btnPrimary}
              >
                {singleLoading ? 'Generating…' : 'Generate'}
              </button>

              {(singleResult || singleInput) && !singleLoading && (
                <button onClick={handleSingleClear} className={btnGhost}>
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Loading */}
          {singleLoading && (
            <div className="bg-bg-surface border border-[#1f1f23] rounded-lg p-5 flex items-center gap-3">
              <span className="w-[6px] h-[6px] rounded-full bg-accent animate-pulse flex-shrink-0" />
              <span className="text-[13px] text-text-muted">Generating your post…</span>
            </div>
          )}

          {/* Error */}
          {singleError && (
            <div className="bg-bg-surface border border-red-500/30 rounded-lg p-4">
              <span className="text-[12px] text-red-400">{singleError}</span>
            </div>
          )}

          {/* Result — mobile/tablet fallback only. Desktop shows in RightPanel. */}
          {singleResult && !singleLoading && (
            <div className="lg:hidden bg-bg-surface border border-[#1f1f23] rounded-lg p-5 flex flex-col gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                Generated Post
              </span>
              <SingleResult result={singleResult} />
            </div>
          )}

        </div>
      )}

      {/* ── BATCH MODE ───────────────────────────────────────────────────── */}
      {mode === 'batch' && (
        <div className="flex flex-col gap-5">

          {/* Input section */}
          <div className="bg-bg-surface border border-[#1f1f23] rounded-lg p-5">

            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                Topics
              </span>
              <span className={`text-[11px] font-medium ${overLimit ? 'text-red-400' : topicCount >= MAX_TOPICS ? 'text-accent' : 'text-text-muted'}`}>
                {topicCount} / {MAX_TOPICS}
              </span>
            </div>

            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isRunning}
              placeholder={`Enter up to ${MAX_TOPICS} topics, one per line…\n\nExample:\nUDEN AI placement feature\nNew batch generation update\nCareer tips for freshers`}
              rows={8}
              className="
                w-full bg-bg-elevated border border-[#2a2a2e] rounded-sm
                px-[14px] py-[10px] text-[13px] text-text-primary font-body
                placeholder:text-text-muted resize-none outline-none
                focus:border-accent transition-colors duration-150
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            />

            {overLimit && (
              <p className="text-[12px] text-red-400 mt-2">
                Maximum {MAX_TOPICS} topics allowed. Remove {topicCount - MAX_TOPICS} topic{topicCount - MAX_TOPICS > 1 ? 's' : ''} to continue.
              </p>
            )}

            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleStart}
                disabled={isRunning || topicCount === 0 || overLimit}
                className={btnPrimary}
              >
                Start Batch
              </button>

              {isRunning && (
                <button onClick={handleCancel} className={btnOutline}>
                  Cancel
                </button>
              )}

              {(topics.length > 0 || input) && !isRunning && (
                <button onClick={handleClear} className={btnGhost}>
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Progress section */}
          {topics.length > 0 && (
            <div className="bg-bg-surface border border-[#1f1f23] rounded-lg p-5">

              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                  Progress
                </span>
                <div className="flex items-center gap-3">
                  {isRunning && inProgress > 0 && (
                    <span className="text-[11px] text-text-muted">Generating…</span>
                  )}
                  <span className="text-[13px] font-semibold text-text-primary">
                    {completed + failed} / {topics.length}
                  </span>
                </div>
              </div>

              <div className="h-[3px] bg-bg-elevated rounded-full mb-5 overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-300"
                  style={{ width: `${topics.length > 0 ? ((completed + failed) / topics.length) * 100 : 0}%` }}
                />
              </div>

              <div>
                {topics.map((topic, i) => (
                  <TopicRow key={topic.id} topic={topic} index={i} />
                ))}
              </div>

              {isDone && (
                <div className="mt-4 pt-4 border-t border-[#1f1f23] flex items-center gap-4">
                  <span className="text-[12px] text-text-muted">
                    {batchStatus === 'cancelled' ? 'Batch cancelled.' : 'Batch complete.'}
                  </span>
                  <span className="text-[12px] text-[#1d9e75] font-medium">
                    {completed} completed
                  </span>
                  {failed > 0 && (
                    <span className="text-[12px] text-red-400 font-medium">
                      {failed} failed
                    </span>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      )}
      
    </div>
  )
}


