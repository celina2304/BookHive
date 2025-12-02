"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingCard() {
  return (
    <Card className="w-[250px] rounded-2xl shadow-md">
      <CardContent className="p-4 space-y-3">
        {/* Thumbnail */}
        <Skeleton className="h-32 w-full rounded-xl" />

        {/* Title */}
        <Skeleton className="h-5 w-3/4 rounded-md" />

        {/* Subtitle */}
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </CardContent>
    </Card>
  )
}
