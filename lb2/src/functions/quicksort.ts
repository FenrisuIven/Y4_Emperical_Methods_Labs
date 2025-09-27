export function Quicksort(variations: number[]): number[] {
  if (variations.length <= 1) {
    return variations;
  }

  const pivot = variations[Math.floor(variations.length / 2)];
  const left = [];
  const right = [];

  for (let i = 0; i < variations.length - 1; i++) {
    if (variations[i] < pivot) {
      left.push(variations[i]);
    } else {
      right.push(variations[i]);
    }
  }

  return [...Quicksort(left), pivot, ...Quicksort(right)];
}

