import {FrequentismsSeries} from "#types";

import React from "npm:react";
import {render, Box, Text} from "npm:ink"

export default function FormatFrequentismsTable (series: FrequentismsSeries): void {
  const maxValueLength = Math.max(...series.map(variant => variant.value.toString().length));
  const maxAmountLength = Math.max(...series.map(variant => variant.amount.toString().length));
  const maxFrequentismLength = Math.max(...series.map(variant => variant.frequentism.toString().length));
  const maxIntegralFrequencyLength = Math.max(...series.map(variant => variant.integralFrequency.toString().length));

  const valueLength = maxValueLength > 'xi'.length ? maxValueLength : 'xi'.length;
  const amountLength = maxAmountLength > 'ni'.length ? maxAmountLength : 'ni'.length;
  const frequentismLength = maxFrequentismLength > 'Частотність'.length ? maxFrequentismLength : 'Частотність'.length;
  const integralFrequencyLength = maxIntegralFrequencyLength > 'Інт. частота'.length ? maxIntegralFrequencyLength : 'Інт. частота'.length;

  const headerParams = {
    borderStyle: {
      right: '│', bottomRight: '╪', bottom: '═', bottomLeft: '═', left: ''
    },
    borderTop: false
  }
  const rowParams = {
    borderStyle: {
      right: '│', bottomRight: '┼', bottom: '─', bottomLeft: '─', left: ''
    },
    borderTop: false,
  }

  render(
    <Box flexDirection="column" width={100} marginBottom={1} maringTop={1}>
      <Box>
        <Box width={valueLength + 4} {...headerParams}><Text>xi</Text></Box>
        <Box width={amountLength + 4} {...headerParams}><Text>ni</Text></Box>
        <Box width={frequentismLength + 4} {...headerParams}><Text>Частотність</Text></Box>
        <Box width={integralFrequencyLength + 4} {...headerParams} borderRight={false}><Text>Інт. частота</Text></Box>
      </Box>
        {series.map((variant, index) => {
          const borderBottom = index !== series.length - 1;
          return (
            <Box key={index}>
            <Box width={valueLength + 4} {...rowParams} borderBottom={borderBottom}><Text>{variant.value}</Text></Box>
            <Box width={amountLength + 4} {...rowParams} borderBottom={borderBottom}><Text>{variant.amount}</Text></Box>
            <Box width={frequentismLength + 4} {...rowParams} borderBottom={borderBottom}><Text>{variant.frequentism}</Text></Box>
            <Box width={integralFrequencyLength + 4} {...rowParams} borderRight={false} borderBottom={borderBottom}><Text>{variant.integralFrequency}</Text></Box>
          </Box>
          )
        })}
    </Box>
  )
}