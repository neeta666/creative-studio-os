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
  const cfg = STATUS_CONFIG[topic.status]

  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#1f1f23] last:border-0">

      {/* Index */}
      <span className="text-[11px] text-text-muted w-5 flex-shrink-0 pt-[2px] text-right">
        {index + 1}
      </span>

      {/* Topic text + result */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="text-[13px] text-text-primary truncate">{topic.text}</span>
        {topic.result && (
  <div className="text-[12px] text-text-secondary leading-snug">
    <p className="font-medium text-text-primary">
      {topic.result.title}
    </p>
    <p className="line-clamp-2">
      {topic.result.content}
    </p>
    <span className="text-[10px] text-text-muted">
      {topic.result.word_count} words
    </span>
  </div>
)}
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-[6px] flex-shrink-0">
        <span className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${cfg.dot}`} />
        <span className={`text-[11px] font-medium ${cfg.text}`}>{cfg.label}</span>
      </div>

    </div>
  )
}
