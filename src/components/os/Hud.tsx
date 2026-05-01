import { motion } from 'framer-motion'

type Props = {
  onReturn: () => void
  onCore: () => void
  onContact: () => void
  onResume: () => void
}

function HudButton({
  label,
  onClick,
  hotkey,
}: {
  label: string
  onClick: () => void
  hotkey?: string
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="group relative flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.25em] text-white/80 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 460, damping: 30 }}
    >
      <span className="pointer-events-none absolute -inset-8 -z-10 opacity-0 blur-2xl transition group-hover:opacity-100 bg-[radial-gradient(circle_at_40%_40%,rgba(80,175,255,0.18),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(185,124,255,0.20),transparent_60%)]" />
      <span>{label}</span>
      {hotkey && <span className="font-mono text-[10px] tracking-[0.3em] text-white/35">{hotkey}</span>}
    </motion.button>
  )
}

export default function Hud({ onReturn, onCore, onContact, onResume }: Props) {
  return (
    <div className="absolute inset-x-0 top-0 z-30 p-4 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="select-none">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(80,175,255,0.15)] backdrop-blur-xl">
              <div className="h-full w-full rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(80,175,255,0.32),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(185,124,255,0.28),transparent_60%)]" />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/50">
                Neural Runtime
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-display text-base font-semibold tracking-tight">Brent.OS</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/80 shadow-[0_0_12px_rgba(110,231,183,0.6)]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
                  live
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <HudButton label="Return" hotkey="R" onClick={onReturn} />
          <HudButton label="About Me" hotkey="I" onClick={onCore} />
          <HudButton label="Contact" hotkey="C" onClick={onContact} />
          <HudButton label="Resume" hotkey="D" onClick={onResume} />
        </div>
      </div>
    </div>
  )
}
