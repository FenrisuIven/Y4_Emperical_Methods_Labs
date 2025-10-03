import { assertEquals } from "@std/assert";
import Sequence from "./src/classes/Sequence.ts";

const seq1 = [4, 6, 2, 9, 2, 8, 6, 6, 5, 4, 7, 9, 6, 9, 6, 7, 9, 3, 3, 7, 4, 3, 6, 6];
const seq2 = [3, 3, 3, 4, 4, 5, 6, 6, 6, 6, 7, 7];

const sorted1 = [2, 2, 3, 3, 3, 4, 4, 4, 5, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 8, 9, 9, 9, 9];
const dist1 = [[2, 2], [3, 3], [4, 3], [5, 1], [6, 7], [7, 3], [8, 1], [9, 4]];

const median2 = 5.5;

const mean1 = 5.7083333333333333;
const mean2 = 5.0;

Deno.test(function modaTest() {

  const seq = new Sequence();
  seq.Sequence = seq1;

  seq.FormVariationsDistribution();
  assertEquals(seq.VariationDistribution, sorted1);

  seq.FormStatisticalDistribution();
  assertEquals([...seq.StatisticalDistribution], dist1);

  seq.CalculateModa();
  assertEquals(seq.Moda, { primary: [[6,7]], secondary: [[9,4],[3.5,3]] });
});

Deno.test(function medianTest() {
  const seq = new Sequence();
  seq.Sequence = seq2;

  seq.FormVariationsDistribution();

  seq.CalculateMedian();
  assertEquals(seq.Median, median2);
})

Deno.test(function meanTest() {
  const sequence1 = new Sequence();
  sequence1.Sequence = seq1;
  sequence1.CalculateMean();
  assertEquals(sequence1.Mean, mean1);

  const sequence2 = new Sequence();
  sequence2.Sequence = seq2;
  sequence2.CalculateMean();
  assertEquals(sequence2.Mean, mean2);
})
