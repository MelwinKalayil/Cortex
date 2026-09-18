import { cn } from '@/lib/utils'

/**
 * NMSight brand mark: a shield outline (safety) enclosing an eye/aperture
 * (computer vision) with small network nodes (edge AI). Kept intentionally
 * simple and monochrome so it reads at small sizes.
 */
export function NMSightLogo({ className, showWordmark = true }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="relative flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-6 text-primary"
          aria-hidden="true"
        >
          <path
            d="M12 2 4 5v6c0 4.4 3.1 8.3 8 9.7 4.9-1.4 8-5.3 8-9.7V5l-8-3Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M6.8 11.3c1.4-2.2 3.2-3.3 5.2-3.3s3.8 1.1 5.2 3.3c-1.4 2.2-3.2 3.3-5.2 3.3s-3.8-1.1-5.2-3.3Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="11.3" r="1.6" fill="currentColor" />
        </svg>
      </span>
      {showWordmark && (
        <span className="text-xl font-semibold tracking-tight text-foreground">
          NM<span className="text-primary">Sight</span>
        </span>
      )}
    </div>
  )
}
