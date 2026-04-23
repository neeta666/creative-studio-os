import DashboardLayout from '@/components/layout/DashboardLayout'
import BatchPanel      from '@/components/batch/BatchPanel'

export default function HomePage() {
  return (
    <DashboardLayout
      title="Batch Generation"
      subtitle="Process up to 10 topics sequentially"
      panelTitle="Output"
    >
      <BatchPanel />
    </DashboardLayout>
  )
}
