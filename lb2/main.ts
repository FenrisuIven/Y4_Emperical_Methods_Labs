import {VariationsSeries} from "./src/classes/VariationsSeries.ts";
import FormatFrequentismsTable from "./src/functions/format_table.tsx";

if (import.meta.main) {
  const N = Deno.args[0] ? Number(Deno.args[0]) : 19; // Порядковий номер
  const sequenceLength = N + 10;                      // Довжина послідовності

  console.log(`N = ${N}, Seq: [.., ${N + 10}]`);

  const VS = new VariationsSeries();
  VS.FormRandomSequence({
    sequenceLength,
    possibleValues: [ 1, 2, 3, 4, 5 ]
  }); // Генерація послідовності з випадковими значеннями

  // Формування варіаційного розподілу
  VS.GetVariationsSequence();
  // Формування статистичного розподілу та контрольної суми
  const {control: amountsControl} = VS.FormVariationsAmounts();
  // Визначення частот елементів та контрольної частоти
  const {control: frequencyControl} = VS.FormVariationsFrequenciesSeries();
  // Визначення частотності та інтегральної частоти елементів розподілу
  VS.FormFrequentismAndFrequenciesSeries();

  console.log({
    sequence: VS.sequence,                    // Початкова послідовність
    variationsSequence: VS.variationsSeries,  // Варіаційний розподіл
    variationsAmounts: VS.variationsAmounts,  // Статистичний розподіл
    frequenciesSeries: VS.frequenciesSeries,  // Частоти елементів
    frequentismSeries: VS.frequentismsSeries  // Частотності та інтегральні частоти елементів
  } );
  console.log({ amountsControl, frequencyControl })

  FormatFrequentismsTable(VS.frequentismsSeries); // Вивід таблиці частотностей та інтегральних частот
}
