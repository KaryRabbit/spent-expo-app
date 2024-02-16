import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import colors from '../colors';
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
        showGradient
        sectionAutoFocus
        radius={120}
        innerRadius={80}
        innerCircleColor={colors.screenBackground}
        focusOnPress
        centerLabelComponent={() => {
          return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
                {selectedSection?.percentage || 100}%
              </Text>
              <Text style={{ fontSize: 14 }}>{selectedSection?.text}</Text>
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
            <Text>
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

          <Text>Total: {total?.toFixed(2)}€</Text>
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.noData}>
      <Text>No data</Text>
    </View>
  );
};

export default CategoryChart;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
    marginTop: 16,
  },
  indicator: {
    height: 16,
    width: 16,
    borderRadius: 16,
    marginRight: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
