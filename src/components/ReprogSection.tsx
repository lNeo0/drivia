import type { PotentielReprog, TypeMoteur, StageReprog } from '@/types'

type Props = { reprog: PotentielReprog }

type ColorCfg = { label: string; textColor: string; bg: string; border: string }

const typeMoteurConfig: Record<TypeMoteur, ColorCfg> = {
  turbo: {
    label: 'Turbo',
    textColor: '#C9A84C',
    bg: 'rgba(201,168,76,0.08)',
    border: 'rgba(201,168,76,0.2)',
  },
  atmospherique: {
    label: 'Atmosphérique',
    textColor: 'var(--text-muted)',
    bg: 'var(--bg-elevated)',
    border: 'var(--border-default)',
  },
  hybride: {
    label: 'Hybride',
    textColor: '#4A8FBF',
    bg: 'rgba(74,143,191,0.10)',
    border: 'rgba(74,143,191,0.2)',
  },
  electrique: {
    label: 'Électrique',
    textColor: '#4CAF7A',
    bg: 'rgba(76,175,122,0.12)',
    border: 'rgba(76,175,122,0.2)',
  },
}

const recommandationConfig: Record<PotentielReprog['recommandation'], ColorCfg> = {
  oui: {
    label: 'Recommandé',
    textColor: '#4CAF7A',
    bg: 'rgba(76,175,122,0.12)',
    border: 'rgba(76,175,122,0.2)',
  },
  selon_usage: {
    label: 'Selon usage',
    textColor: '#D48C3A',
    bg: 'rgba(212,140,58,0.12)',
    border: 'rgba(212,140,58,0.2)',
  },
  non: {
    label: 'Non recommandé',
    textColor: '#C0442E',
    bg: 'rgba(192,68,46,0.12)',
    border: 'rgba(192,68,46,0.2)',
  },
}

function StageCard({ stage }: { stage: StageReprog }) {
  const notApplicable = stage.cout === 'Non applicable'
  return (
    <div className="rounded-[12px] p-5 border border-rim bg-elevated">
      <div className="flex items-center justify-between gap-4 mb-3">
        <p className="text-[0.9375rem] font-semibold font-body text-primary">{stage.nom}</p>
        {notApplicable ? (
          <span className="text-[0.75rem] font-semibold font-body px-3 py-1 rounded-full
            bg-subtle border border-rim text-muted">
            Non applicable
          </span>
        ) : (
          <span className="text-[0.8125rem] font-semibold font-body text-gold tabular-nums">
            {stage.cout}
          </span>
        )}
      </div>

      {!notApplicable && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[0.75rem] font-semibold font-body text-success">
              +{stage.puissanceGain} ch
            </span>
            <span className="text-[0.75rem] text-muted font-body">·</span>
            <span className="text-[0.75rem] font-semibold font-body text-success">
              +{stage.coupleGain} Nm
            </span>
          </div>
          <span className="text-[0.75rem] text-rim-strong">→</span>
          <div className="flex items-center gap-1.5">
            <span className="font-display text-[0.9375rem] font-bold tabular-nums text-gold">
              {stage.puissanceFinal}
            </span>
            <span className="text-[0.75rem] font-body text-muted">ch</span>
            <span className="text-[0.75rem] text-rim-strong mx-0.5">·</span>
            <span className="font-display text-[0.9375rem] font-bold tabular-nums text-gold">
              {stage.coupleFinal}
            </span>
            <span className="text-[0.75rem] font-body text-muted">Nm</span>
          </div>
        </div>
      )}

      <p className="text-[0.875rem] italic font-body leading-relaxed text-secondary">
        {stage.avis}
      </p>
    </div>
  )
}

export default function ReprogSection({ reprog }: Props) {
  const typeCfg = typeMoteurConfig[reprog.typeMoteur]
  const recommCfg = recommandationConfig[reprog.recommandation]

  return (
    <div className="space-y-5">
      {/* Header : badge type moteur + avis général */}
      <div className="rounded-2xl p-6 border border-rim bg-surface"
        style={{ boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-[0.625rem] font-semibold uppercase tracking-[0.1em] font-body
              px-3 py-1.5 rounded-full"
            style={{
              color: typeCfg.textColor,
              background: typeCfg.bg,
              border: `1px solid ${typeCfg.border}`,
            }}
          >
            {typeCfg.label}
          </span>
        </div>
        <p className="text-[0.9375rem] leading-relaxed font-body text-secondary">
          {reprog.avisGeneral}
        </p>
      </div>

      {/* Stages */}
      <div className="space-y-3">
        {reprog.stages.map((stage, i) => (
          <StageCard key={i} stage={stage} />
        ))}
      </div>

      {/* Recommandation */}
      <div
        className="rounded-[14px] p-5 flex items-start gap-4"
        style={{ background: recommCfg.bg, border: `1px solid ${recommCfg.border}` }}
      >
        <span
          className="shrink-0 text-[0.625rem] font-semibold uppercase tracking-[0.1em]
            font-body px-3 py-1.5 rounded-full whitespace-nowrap mt-0.5"
          style={{
            color: recommCfg.textColor,
            background: recommCfg.bg,
            border: `1px solid ${recommCfg.border}`,
          }}
        >
          {recommCfg.label}
        </span>
        <p
          className="text-[0.9375rem] leading-relaxed font-body"
          style={{ color: recommCfg.textColor }}
        >
          {reprog.raisonRecommandation}
        </p>
      </div>
    </div>
  )
}
