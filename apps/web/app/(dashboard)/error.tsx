'use client'

import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  error: Error & { digest?: string }
  reset: () => void
  minimal?: boolean
}

export default function Error({ error, reset, className, minimal = false }: ErrorProps) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className={cn('h-svh w-full', className)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        {!minimal && <h1 className="text-[7rem] font-bold leading-tight">500</h1>}
        <span className="font-medium">Oops! Something went wrong {`:')`}</span>
        <p className="text-muted-foreground text-center">
          {error.message || 'We apologize for the inconvenience.'} <br /> Please try again later.
        </p>
        {!minimal && (
          <div className="mt-6 flex gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
            <Button onClick={() => reset()}>Try Again</Button>
            <Button onClick={() => router.push('/')}>Back to Home</Button>
          </div>
        )}
      </div>
    </div>
  )
}
