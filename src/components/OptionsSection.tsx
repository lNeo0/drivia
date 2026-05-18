import type { Option, ImportanceOption } from '@/types'

type Props = { options: Option[] }

type ImportanceCfg = {
  label: string
  textColor: string
  cardBg: string
  cardBorder: string
  badgeBg: string
}

const importanceConfig: Record<ImportanceOption, ImportanceCfg> = {
  indispensable: {
    label: 'Indispensable',
    textColor: '#4CAF7A',
    cardBg: 'rgba(76,175,122,0.12)',
    cardBorder: 'rgba(76,175,122,0.2)',
    badgeBg: 'rgba(76,175,122,0.08)',
  },
  interessante: {
    label: 'Intéressante',
    textColor: '#C9A84C',
    cardBg: 'rgba(201,168,76,0.08)',
    cardBorder: 'rgba(201,168,76,0.2)',
    badgeBg: 'rgba(201,168,76,0.05)',
  },
  inutile: {
    label: 'Sans intérêt',
    textColor: 'var(--text-muted)',
    cardBg: 'var(--bg-elevated)',
    cardBorder: 'var(--border-default)',
    badgeBg: 'var(--bg-subtle)',
  },
}

export default function OptionsSection({ options }: Props) {
  return (
    <ul className="space-y-3">
      {options.map((option, i) => {
        const cfg = importanceConfig[option.importance]
        const isMuted = option.importance === 'inutile'
        return (
          <li
            key={i}
            className="rounded-[14px] p-5"
            style={{ background: cfg.cardBg, border: `1px solid ${cfg.cardBorder}` }}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <p
                className="text-[0.9375rem] font-semibold font-body leading-snug"
                style={{ color: isMuted ? 'var(--text-secondary)' : 'var(--text-primary)' }}
              >
                {option.nom}
              </p>
              <span
                className="shrink-0 text-[0.625rem] font-semibold uppercase tracking-[0.08em]
                  font-body px-2.5 py-1 rounded-full whitespace-nowrap"
                style={{
                  color: cfg.textColor,
                  background: cfg.badgeBg,
                  border: `1px solid ${cfg.cardBorder}`,
                }}
              >
                {cfg.label}
              </span>
            </div>
            <p
              className="text-[0.8125rem] font-body mb-3 leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              {option.description}
            </p>
            <p
              className="text-[0.875rem] italic font-body leading-relaxed"
              style={{ color: isMuted ? 'var(--text-muted)' : 'var(--text-secondary)' }}
            >
              {option.avis}
            </p>
          </li>
        )
      })}
    </ul>
  )
}
