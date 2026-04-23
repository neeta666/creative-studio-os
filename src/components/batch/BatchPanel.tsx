import { useState, useRef } from 'react'
import type { BatchTopic, BatchStatus } from '@/types/batch'
import TopicRow from './TopicRow'

const MAX_TOPICS       = 10
const DELAY_PER_TOPIC  = 1200   // ms — simulates generation time

// Mock result generator — replace with real API call later
function mockGenerate(topic: string): string {
  return `Generated content for "${topic}": Here is a sample output that represents what the AI would produce for this topic. This is placeholder text.`
}

export default function BatchPanel() {
  const [input,       setInput]       = useState('')
  const [topics,      setTopics]      = useState<BatchTopic[]>([])
  const [batchStatus, setBatchStatus] = useState<BatchStatus>('idle')
  const [currentIdx,  setCurrentIdx]  = useState(0)

  // cancelRef lets the running loop check if cancel was requested
  // without needing to put it in state (avoids stale closure issues)
  const cancelRef = useRef(false)

  // ── Derived values ────────────────────────────────────────────────────────

  const lines = input
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .slice(0, MAX_TOPICS)

  const topicCount   = lines.length
  const completed    = topics.filter(t => t.status === 'completed').length
  const failed       = topics.filter(t => t.status === 'failed').length
  const isDone       = batchStatus === 'done' || batchStatus === 'cancelled'
  const isRunning    = batchStatus === 'running'

  // Estimated seconds remaining (rough: remaining topics × delay)
  const remaining    = topics.filter(t => t.status === 'pending').length
  const etaSeconds   = Math.ceil((remaining * DELAY_PER_TOPIC) / 1000)

  // ── Handlers ──────────────────────────────────────────────────────────────

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
    setCurrentIdx(0)

    // Process sequentially with setTimeout chain
    processNext(initialTopics, 0)
  }

  function processNext(topicList: BatchTopic[], idx: number) {
    if (cancelRef.current || idx >= topicList.length) {
      setBatchStatus(cancelRef.current ? 'cancelled' : 'done')
      return
    }

    setCurrentIdx(idx)

    // Mark current as processing
    setTopics(prev =>
      prev.map((t, i) => i === idx ? { ...t, status: 'processing' } : t)
    )

    setTimeout(() => {
      if (cancelRef.current) {
        // Mark remaining as pending (leave them as-is), stop
        setBatchStatus('cancelled')
        return
      }

      // 15% random failure rate
      const didFail = Math.random() < 0.15

      setTopics(prev =>
        prev.map((t, i) =>
          i === idx
            ? {
                ...t,
                status: didFail ? 'failed' : 'completed',
                result: didFail ? undefined : mockGenerate(t.text),
              }
            : t
        )
      )

      // Move to next
      processNext(topicList, idx + 1)
    }, DELAY_PER_TOPIC)
  }

  function handleCancel() {
    cancelRef.current = true
    // batchStatus updated inside processNext's timeout check
  }

  function handleClear() {
    cancelRef.current = true
    setInput('')
    setTopics([])
    setBatchStatus('idle')
    setCurrentIdx(0)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5">

      {/* ── Input section ── */}
      <div className="bg-bg-surface border border-[#1f1f23] rounded-lg p-5">

        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            Topics
          </span>
          <span className={`text-[11px] font-medium ${topicCount >= MAX_TOPICS ? 'text-accent' : 'text-text-muted'}`}>
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

        {/* Controls */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handleStart}
            disabled={isRunning || topicCount === 0}
            className="
              px-4 py-[7px] rounded-sm text-[13px] font-medium
              bg-accent text-white
              hover:opacity-90 transition-opacity
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            Start Batch
          </button>

          {isRunning && (
            <button
              onClick={handleCancel}
              className="
                px-4 py-[7px] rounded-sm text-[13px] font-medium
                border border-[#2a2a2e] text-text-secondary
                hover:text-text-primary hover:border-[#3a3a3e] transition-colors
              "
            >
              Cancel
            </button>
          )}

          {(topics.length > 0 || input) && !isRunning && (
            <button
              onClick={handleClear}
              className="
                px-4 py-[7px] rounded-sm text-[13px] font-medium
                text-text-muted hover:text-text-secondary transition-colors
              "
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Progress section — only shown once batch starts ── */}
      {topics.length > 0 && (
        <div className="bg-bg-surface border border-[#1f1f23] rounded-lg p-5">

          {/* Progress header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              Progress
            </span>
            <div className="flex items-center gap-3">
              {isRunning && (
                <span className="text-[11px] text-text-muted">
                  ~{etaSeconds}s remaining
                </span>
              )}
              <span className="text-[13px] font-semibold text-text-primary">
                {completed + failed} / {topics.length}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-[3px] bg-bg-elevated rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${topics.length > 0 ? ((completed + failed) / topics.length) * 100 : 0}%` }}
            />
          </div>

          {/* Topic rows */}
          <div>
            {topics.map((topic, i) => (
              <TopicRow key={topic.id} topic={topic} index={i} />
            ))}
          </div>

          {/* Summary — shown when done */}
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
  )
}
