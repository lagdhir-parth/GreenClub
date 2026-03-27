export function calculatePrize(totalPool, winners) {
  return {
    match5: totalPool * 0.4,
    match4: totalPool * 0.35,
    match3: totalPool * 0.25,
  };
}
