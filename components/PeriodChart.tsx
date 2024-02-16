import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarChart, LineChart, barDataItem } from 'react-native-gifted-charts';
import colors from '../colors';

const PeriodChart = ({ data }: { data?: barDataItem[] }) => {
  return (
    <View style={styles.container}>
      {data?.length ? (
        <>
          <BarChart
            data={data}
            barWidth={25}
            barBorderRadius={4}
            frontColor={colors.accentLight}
            yAxisThickness={0}
            xAxisThickness={0}
          />
          <LineChart
            data={data}
            areaChart
            dataPointsColor={colors.secondary}
            color={colors.accentLight}
            startFillColor={colors.accentLight}
            startOpacity={0.8}
            endFillColor={colors.secondary}
            endOpacity={0.3}
          />
        </>
      ) : (
        <View style={styles.noData}>
          <Text>No data</Text>
        </View>
      )}
    </View>
  );
};

export default PeriodChart;

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },

  noData: {
    flex: 1,
    justifyContent: 'center',
  },
});
