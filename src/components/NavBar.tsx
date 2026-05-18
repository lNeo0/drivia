import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import NavSearch from './NavSearch'

export default function NavBar() {
  return (
    <header
      className="sticky top-0 z-50 h-16
        bg-[var(--bg-surface)]/90 backdrop-blur-md
        border-b border-[var(--border-default)]"
      style={{ boxShadow: '0 1px 0 var(--border-default)' }}
    >
      <div className="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
        <Link
          href="/"
          className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold
            text-[var(--accent-gold)] tracking-tight hover:text-[var(--accent-gold-light)]
            transition-colors duration-150"
        >
          Drivia
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/recherche"
            className="hidden md:block text-sm font-medium text-[var(--text-secondary)]
              hover:text-[var(--text-primary)] transition-colors duration-150
              font-[family-name:var(--font-dm-sans)]"
          >
            Toutes les voitures
          </Link>
          <NavSearch />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
