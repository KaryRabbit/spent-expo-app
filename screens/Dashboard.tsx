import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { barDataItem } from 'react-native-gifted-charts';
import { useDispatch, useSelector } from 'react-redux';
import colors, { chartColors } from '../colors';
import shadows from '../shadows';
import spacing, { radius } from '../spacing';
import { textStyles } from '../typography';
import CategoryChart from '../components/CategoryChart';
import PeriodChart from '../components/PeriodChart';
import CustomText from '../components/UI/CustomText';
import IconButton from '../components/UI/IconButton';
import ToggleSwitch from '../components/UI/ToggleSwitch';
import {
  aggregateExpensesByCategory,
  aggregateExpensesByPeriod,
  formatDate,
} from '../service/transformDataService';
import { fetchExpenses } from '../store/expensesSlice';
import { AppDispatch, RootState } from '../store/store';
import { ExtendedItemType } from '../types';

const Dashboard = () => {
  const expenses = useSelector((state: RootState) => state.expenses.items);
  const status = useSelector((state: RootState) => state.expenses.status);
  const dispatch = useDispatch<AppDispatch>();

  const [showCategoryChart, setShowCategoryChart] = useState(false);
  const [monthString, setMonthString] = useState(() =>
    new Date().toLocaleString('default', {
      month: 'long',
    })
  );
  const [year, setYear] = useState(new Date().getFullYear());

  const monthNamesToNumbers = useMemo<Record<string, number>>(
    () => ({
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    }),
    []
  );

  const monthOrder = useMemo(() => Object.keys(monthNamesToNumbers), [monthNamesToNumbers]);

  const yearMonth = useMemo(() => {
    const formattedMonth = (monthNamesToNumbers[monthString] ?? 1)
      .toString()
      .padStart(2, '0');
    return `${year}-${formattedMonth}`;
  }, [monthNamesToNumbers, monthString, year]);

  const periodData = useMemo<barDataItem[]>(
    () =>
      aggregateExpensesByPeriod(expenses, yearMonth).map((item) => ({
        value: item.total,
        label: formatDate(item.period).toString(),
      })),
    [expenses, yearMonth]
  );

  const pieChartData = useMemo<ExtendedItemType[]>(
    () =>
      aggregateExpensesByCategory(expenses, yearMonth).map(
        (item, num) => ({
          value: item.total,
          color: chartColors[num % chartColors.length],
          text: item.category,
          focus: false,
        })
      ),
    [expenses, yearMonth]
  );

  useEffect(() => {
    if (!expenses.length && status === 'idle') {
      dispatch(fetchExpenses());
    }
  }, [dispatch, expenses.length, status]);

  const handleMonthChange = useCallback(
    (prev = true) => {
      const currentMonthIndex = monthNamesToNumbers[monthString] - 1;
      let newMonthIndex = prev ? currentMonthIndex - 1 : currentMonthIndex + 1;
      let newYear = year;
      if (newMonthIndex < 0) {
        newMonthIndex = 11;
        newYear--;
      } else if (newMonthIndex > 11) {
        newMonthIndex = 0;
        newYear++;
      }

      setMonthString(monthOrder[newMonthIndex]);
      setYear(newYear);
    },
    [monthNamesToNumbers, monthOrder, monthString, year]
  );

  return status === 'loading' && !expenses.length ? (
    <ActivityIndicator
      size="large"
      color={colors.headerBackground}
      style={styles.loader}
    />
  ) : (
    <>
      <View style={styles.toggle}>
        <ToggleSwitch
          textOff="Period Chart"
          textOn="Category Chart"
          isEnabled={!showCategoryChart}
          onSwitch={() => setShowCategoryChart(!showCategoryChart)}
        />
        <View style={styles.period}>
          <IconButton
            onPress={handleMonthChange}
            iconName="chevron-back-outline"
          ></IconButton>
          <CustomText>
            {monthString} - {year}
          </CustomText>
          <IconButton
            onPress={() => handleMonthChange(false)}
            iconName="chevron-forward-outline"
          ></IconButton>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {!showCategoryChart ? (
          <PeriodChart data={periodData}></PeriodChart>
        ) : (
          <CategoryChart data={pieChartData}></CategoryChart>
        )}
      </ScrollView>
    </>
  );
};

export default Dashboard;

export const styles = StyleSheet.create({
  toggle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.base,
    gap: spacing.md,
  },
  period: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '88%',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: textStyles.h1.fontSize,
    fontWeight: textStyles.h1.fontWeight,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 120,
  },
});
