import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarChart, LineChart, barDataItem } from 'react-native-gifted-charts';
import colors from '../colors';
import shadows from '../shadows';
import spacing, { radius } from '../spacing';
import { textStyles } from '../typography';

const PeriodChart = ({ data }: { data?: barDataItem[] }) => {
  return (
    <View style={styles.container}>
      {data?.length ? (
        <>
          <BarChart
            data={data}
            barWidth={28}
            barBorderRadius={6}
            frontColor={colors.primary}
            yAxisThickness={1}
            xAxisThickness={0}
            yAxisColor={colors.border}
            yAxisTextStyle={{ color: colors.textSecondary }}
            hideRules
            isAnimated
          />
          <LineChart
            data={data}
            dataPointsColor={colors.primary}
            color={colors.primary}
            thickness={2}
            yAxisThickness={1}
            yAxisColor={colors.border}
            yAxisTextStyle={{ color: colors.textSecondary }}
            hideRules
            isAnimated
          />
        </>
      ) : (
        <View style={styles.noDataCard}>
          <Text style={styles.noDataTitle}>No data for this period</Text>
          <Text style={styles.noDataText}>
            Add or upload expenses to see chart trends.
          </Text>
        </View>
      )}
    </View>
  );
};

export default PeriodChart;

export const styles = StyleSheet.create({
  container: {
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.base,
    marginTop: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.base,
  },
  noDataCard: {
    width: '100%',
    minHeight: 120,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
  noDataTitle: {
    color: colors.textSecondary,
    fontSize: textStyles.body.fontSize,
    fontWeight: textStyles.bodyMedium.fontWeight,
  },
  noDataText: {
    color: colors.textMuted,
    fontSize: textStyles.small.fontSize,
    textAlign: 'center',
  },
});
