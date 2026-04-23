// Type definitions for the Batch Generation feature.

export type TopicStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface BatchTopic {
  id:     string
  text:   string
  status: TopicStatus
  result?: {
    title: string
    content: string
    word_count: number
  }   // populated on completion
}

export type BatchStatus = 'idle' | 'running' | 'done' | 'cancelled'
