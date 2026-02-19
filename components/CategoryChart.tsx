import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import colors from '../colors';
import shadows from '../shadows';
import spacing, { radius } from '../spacing';
import { textStyles } from '../typography';
import { ExtendedItemType } from '../types';

const CategoryChart = ({ data }: { data?: ExtendedItemType[] }) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<ExtendedItemType>();

  const total = data?.reduce((acc, item) => acc + item.value, 0);

  const handlePress = (_item: ExtendedItemType, index: number) => {
    setFocusedIndex(index);
    if (data && total) {
      const section = data[index];
      const percentage = ((section.value / total) * 100).toFixed(1);
      setSelectedSection({ ...section, percentage });
    }
  };

  return data?.length ? (
    <View style={styles.container}>
      <PieChart
        donut
        sectionAutoFocus
        radius={120}
        innerRadius={80}
        innerCircleColor={colors.background}
        focusOnPress
        centerLabelComponent={() => {
          return (
            <View style={styles.centerLabel}>
              <Text style={styles.percentage}>
                {selectedSection?.percentage || 100}%
              </Text>
              <Text style={styles.categoryName}>
                {selectedSection?.text}
              </Text>
            </View>
          );
        }}
        data={data.map((item, index) => {
          return {
            ...item,
            focused: index === focusedIndex,
            onPress: () => {
              handlePress(item, index);
              item.focused = true;
            },
          };
        })}
      />
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <View style={[styles.indicator, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item?.text}: {item?.value.toFixed(2)}€
            </Text>
          </View>
        ))}
        <View style={styles.itemContainer}>
          <View
            style={[
              styles.indicator,
              { borderColor: colors.primary, borderWidth: 2 },
            ]}
          />
          <Text style={styles.legendText}>Total: {total?.toFixed(2)}€</Text>
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.noDataCard}>
      <Text style={styles.noDataTitle}>No data for this period</Text>
      <Text style={styles.noDataText}>
        Add or upload expenses to see category breakdown.
      </Text>
    </View>
  );
};

export default CategoryChart;

export const styles = StyleSheet.create({
  container: {
    width: '95%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.base,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.base,
  },
  centerLabel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontSize: textStyles.h1.fontSize,
    fontWeight: textStyles.h1.fontWeight,
    color: colors.textPrimary,
  },
  categoryName: {
    fontSize: textStyles.small.fontSize,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  noDataCard: {
    width: '95%',
    alignSelf: 'center',
    minHeight: 120,
    marginTop: spacing.md,
    borderRadius: radius.lg,
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
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    marginTop: spacing.base,
  },
  indicator: {
    height: 14,
    width: 14,
    borderRadius: radius.xs,
    marginRight: spacing.sm,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendText: {
    color: colors.textSecondary,
    fontSize: textStyles.small.fontSize,
    fontWeight: textStyles.smallMedium.fontWeight,
  },
});
