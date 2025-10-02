import Sequence from "./src/classes/Sequence.ts";

if (import.meta.main) {
  const N = Number(Deno.args[0]) ?? 19;
  const seqLength = N + 10;

  console.log(`N: ${10}, Seq: [.., ${seqLength}]`);

  const seq = new Sequence();
  seq.GenerateRandomSequence({
    sequenceLength: seqLength,
    minValue: 1,
    maxValue: N + 1
  });
  seq.FormVariationsDistribution();
  seq.FormStatisticalDistribution();
  seq.CalculateModa();
  seq.CalculateMedian();
  seq.CalculateMean();

  console.log({
    sequence: seq.Sequence,
    variationsSeries: seq.VariationDistribution,
    statisticalDistribution: [...seq.StatisticalDistribution],
    moda: seq.Moda,
    median: seq.Median,
    mean: seq.Mean,
    desmosDistribution: [...seq.StatisticalDistribution].map(([k, v]) => '(' + k + ',' + v + ')').join(', '),
    desmosModa: seq.Moda.map(m => '(' + m + ',0)').join(', ')
  });
}
