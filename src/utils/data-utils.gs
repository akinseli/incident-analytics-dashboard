function toSafeNumber(value) {
  if (value === "" || value == null) return 0;

  if (typeof value === "string" && value.trim().toUpperCase() === "NIL") {
    return 0;
  }

  return Number(value) || 0;
}