export function currency(value) {
  return `PHP ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function number(value) {
  return Number(value || 0).toLocaleString("en-US");
}

export function date(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}
