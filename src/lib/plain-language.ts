/**
 * Turn a percentage into a comparison people can picture quickly.
 * The exact percentage should still be shown beside it as the proof layer.
 */
export function asOneIn(pct: number) {
  if (!Number.isFinite(pct) || pct <= 0) return `${pct}%`;

  const denominator = Math.max(2, Math.min(10, Math.round(100 / pct)));
  const exactShare = 100 / denominator;
  const difference = pct - exactShare;

  if (Math.abs(difference) <= 1.8) return `about 1 in ${denominator}`;
  if (difference > 0) return `more than 1 in ${denominator}`;
  return `almost 1 in ${denominator}`;
}

export function changeInWords(from: number, to: number) {
  if (from === to) return `It was ${from}% ten years ago and is still ${to}% now.`;
  return `It was ${from}% ten years ago. It is ${to}% now.`;
}
