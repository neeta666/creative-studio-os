interface MainContentProps {
  children: React.ReactNode
}

// Thin wrapper — keeps overflow and padding consistent across all pages.
// Pages pass their own content as children; this component never contains
// page-specific markup.

export default function MainContent({ children }: MainContentProps) {
  return (
    <main className="bg-bg-base overflow-y-auto">
      <div className="flex flex-col gap-5 p-6 h-full">{children}</div>
    </main>
  )
}
