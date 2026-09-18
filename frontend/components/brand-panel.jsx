import { NMSightLogo } from '@/components/nmsight-logo'
import { CampusVisual } from '@/components/campus-visual'

export function BrandPanel() {
  return (
    <section className="relative flex flex-col justify-between overflow-hidden border-b border-border bg-sidebar p-8 lg:border-b-0 lg:border-r lg:p-12">
      <CampusVisual />

      <div className="relative z-10">
        <NMSightLogo />
      </div>

      <div className="relative z-10 max-w-md py-12 lg:py-0">
        <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground lg:text-4xl">
          AI-Powered Campus Safety &amp; Intelligence
        </h1>
        <p className="mt-4 text-lg font-medium text-primary">
          See. Detect. Respond.
        </p>
        <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
          Edge-AI computer vision turns drone and camera feeds into real-time
          campus safety intelligence — detecting, classifying, and escalating
          events as they happen.
        </p>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground/90">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-safe/60" />
            <span className="relative inline-flex size-2 rounded-full bg-safe" />
          </span>
          Edge AI Infrastructure
        </div>
        {/* <p className="mt-1.5 text-xs text-muted-foreground">
          Raspberry Pi 5 • Computer Vision • Real-Time Intelligence
        </p> */}
      </div>
    </section>
  )
}
