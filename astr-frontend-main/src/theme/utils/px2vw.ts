export default function px2vw(
  px: number,
  unit = 375,
  ignoreMax = true,
  ignoreUnit = false
): string {
  if (!ignoreMax) {
    if (px > unit) {
      return "100vw";
    } else if (px < -1 * unit) {
      return "-100vw";
    }
  }

  // 100vw = ${unit}px
  return `${(px / unit) * 100}${ignoreUnit ? "" : "vw"}`;
}
