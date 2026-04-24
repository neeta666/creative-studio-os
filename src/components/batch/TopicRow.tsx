import { useState } from 'react'
import type { BatchTopic } from '@/types/batch'

interface TopicRowProps {
  topic: BatchTopic
  index: number
}

// Status dot + label config
const STATUS_CONFIG = {
  pending: {
    dot:   'bg-[#2a2a2e]',
    label: 'Pending',
    text:  'text-text-muted',
  },
  processing: {
    dot:   'bg-accent animate-pulse',
    label: 'Processing…',
    text:  'text-accent',
  },
  completed: {
    dot:   'bg-[#1d9e75]',
    label: 'Done',
    text:  'text-[#1d9e75]',
  },
  failed: {
    dot:   'bg-red-500',
    label: 'Failed',
    text:  'text-red-400',
  },
}

export default function TopicRow({ topic, index }: TopicRowProps) {
  const [expanded, setExpanded] = useState(false)
  const cfg = STATUS_CONFIG[topic.status]

  return (
    <div className="flex flex-col py-3 border-b border-[#1f1f23] last:border-0 gap-2">

      {/* Top row: index + topic text + status */}
      <div className="flex items-start gap-3">

        {/* Index */}
        <span className="text-[11px] text-text-muted w-5 flex-shrink-0 pt-[2px] text-right">
          {index + 1}
        </span>

        {/* Topic text */}
        <span className="flex-1 min-w-0 text-[13px] text-text-primary truncate">
          {topic.text}
        </span>

        {/* Status badge */}
        <div className="flex items-center gap-[6px] flex-shrink-0">
          <span className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${cfg.dot}`} />
          <span className={`text-[11px] font-medium ${cfg.text}`}>{cfg.label}</span>
        </div>

      </div>

      {/* Result — only shown when completed */}
      {topic.result && (
        <div className="ml-8 flex flex-col gap-2">

          {/* Preview: title + first line of content */}
          {!expanded && (
            <div className="flex flex-col gap-[2px]">
              <span className="text-[12px] font-semibold text-text-primary truncate">
                {topic.result.title}
              </span>
              <span className="text-[12px] text-text-secondary line-clamp-1">
                {topic.result.content}
              </span>
            </div>
          )}

          {/* Full response */}
          {expanded && (
            <div className="bg-bg-elevated border border-[#2a2a2e] rounded-sm p-4 flex flex-col gap-3">
              <span className="text-[13px] font-semibold text-text-primary leading-snug">
                {topic.result.title}
              </span>
              <p className="text-[12px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                {topic.result.content}
              </p>
              <span className="text-[11px] text-text-muted">
                {topic.result.word_count} words
              </span>
            </div>
          )}

          {/* Toggle button */}
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="self-start text-[11px] font-medium text-accent
                       hover:opacity-80 transition-opacity"
          >
            {expanded ? 'Hide response' : 'View full response'}
          </button>

        </div>
      )}

    </div>
  )
}