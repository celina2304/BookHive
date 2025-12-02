import { LoadingCard } from "@/components/loading-card"

export default function Loading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  )
}
