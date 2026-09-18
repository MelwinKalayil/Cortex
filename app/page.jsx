import { BrandPanel } from '@/components/brand-panel'
import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[45fr_55fr]">
      <BrandPanel />

      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <header className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to NMSight Campus Operations
            </p>
          </header>

          <LoginForm />

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Authorized campus personnel only
          </p>
        </div>
      </section>
    </main>
  )
}
