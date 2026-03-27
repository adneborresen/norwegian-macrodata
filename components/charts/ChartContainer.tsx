interface Props {
  children: React.ReactNode
  loading?: boolean
  error?: string
}

export function ChartContainer({ children, loading = false, error }: Props) {
  if (loading) {
    return (
      <div className="flex h-full min-h-[56px] items-center justify-center text-sm text-zinc-400">
        Loading…
      </div>
    )
  }
  if (error !== undefined) {
    return (
      <div className="flex h-full min-h-[56px] items-center justify-center text-sm text-red-500">
        {error}
      </div>
    )
  }
  return <>{children}</>
}
