export const fmtCurrency = (v: number | null | undefined, currency = "USD") => {
  if (v == null || isNaN(v as number)) return "–";
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(v as number);
};

export const tokenColor = (token: string) => {
  const cs = getComputedStyle(document.documentElement);
  const val = cs.getPropertyValue(token).trim();
  return `hsl(${val})`;
};
