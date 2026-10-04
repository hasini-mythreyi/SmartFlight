export function generatePNR() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export function recommendationScore(flight, minPrice, maxDuration) {
  const priceScore = 1 - (flight.price - minPrice) / Math.max(flight.price, minPrice);
  const durationScore = 1 - (flight.durationMinutes - 60) / Math.max(maxDuration, 60);
  const stopScore = flight.stops === 0 ? 1 : 0.65;
  return priceScore * 0.5 + durationScore * 0.35 + stopScore * 0.15;
}
