import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import BatchPanel      from '@/components/batch/BatchPanel'
import type { Variant } from '@/api/generateService'

function PanelOutput({ result }: { result: Variant }) {
  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">
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

function PanelLoading() {
  return (
    <div className="flex-1 flex items-center justify-center gap-3 p-6">
      <span className="w-[6px] h-[6px] rounded-full bg-accent animate-pulse flex-shrink-0" />
      <span className="text-[13px] text-text-muted">Generating…</span>
    </div>
  )
}

export default function CopyWriterPage() {
  const [result,     setResult]     = useState<Variant | null>(null)
  const [generating, setGenerating] = useState(false)

  function handleResult(v: Variant | null) {
    setResult(v)
    setGenerating(false)
  }

  function handleGenerating() {
    setGenerating(true)
    setResult(null)
  }

  const panelContent = generating
    ? <PanelLoading />
    : result
      ? <PanelOutput result={result} />
      : undefined

  return (
    <DashboardLayout
      title="Copy Writer"
      subtitle="Single post & batch content generation"
      panelTitle="Output"
      panelContent={panelContent}
    >
      <BatchPanel
        onResult={handleResult}
        onGenerating={handleGenerating}
      />
    </DashboardLayout>
  )
}
