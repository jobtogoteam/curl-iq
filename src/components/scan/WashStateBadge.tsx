import { Droplets, Waves, Wind, Sun, HelpCircle } from "lucide-react";
import { WASH_STATE_LABELS, type WashState } from "@/types/hair";

const WASH_STATE_ICONS: Record<WashState, React.ElementType> = {
  just_washed: Droplets,
  minutes_after: Waves,
  hours_after: Wind,
  dry: Sun,
  unknown: HelpCircle,
};

interface WashStateBadgeProps {
  washState: WashState;
  confidence?: number | null;
}

export function WashStateBadge({ washState, confidence }: WashStateBadgeProps) {
  const Icon = WASH_STATE_ICONS[washState];

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium">
      <Icon size={13} strokeWidth={2} />
      <span>{WASH_STATE_LABELS[washState]}</span>
      {confidence !== null && confidence !== undefined && (
        <span className="text-white/60 text-xs">· {confidence}%</span>
      )}
    </span>
  );
}
