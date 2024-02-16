import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { barDataItem } from 'react-native-gifted-charts';
import { useDispatch, useSelector } from 'react-redux';
import colors, { chartColors } from '../colors';
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
  let expenses = useSelector((state: RootState) => state.expenses.items);
  const status = useSelector((state: RootState) => state.expenses.status);
  const dispatch = useDispatch<AppDispatch>();

  const [showCategoryChart, setShowCategoryChart] = useState(false);
  const [monthString, setMonthString] = useState('');
  const [periodData, setPeriodData] = useState<barDataItem[]>();
  const [pieChartData, setPieChartData] = useState<ExtendedItemType[]>();
  const [year, setYear] = useState(new Date().getFullYear());

  const monthNamesToNumbers: Record<string, number> = {
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
  };

  useEffect(() => {
    const prepareData = () => {
      let currentMonthString = monthString;
      if (!currentMonthString) {
        currentMonthString = new Date().toLocaleString('default', {
          month: 'long',
        });
        setMonthString(currentMonthString);
      }

      const formattedMonth = monthNamesToNumbers[currentMonthString]
        .toString()
        .padStart(2, '0');
      const yearMonth = `${year}-${formattedMonth}`;

      const aggregatedData = aggregateExpensesByPeriod(expenses, yearMonth).map(
        (item) => ({
          value: item.total,
          label: formatDate(item.period).toString(),
        })
      );

      setPeriodData(aggregatedData);

      const categoryData = aggregateExpensesByCategory(expenses, yearMonth);

      const pieChartData = categoryData.map((item, num) => {
        const randomColor =
          chartColors[Math.floor(Math.random() * chartColors.length)];

        return {
          value: item.total,
          color: chartColors[num] || randomColor,
          text: item.category,
          focus: false,
        };
      });

      setPieChartData(pieChartData);
    };

    if (!expenses.length && status !== 'succeeded') {
      dispatch(fetchExpenses());
    }
    prepareData();
  }, [dispatch, expenses, monthString, year]);

  const handleMonthChange = (prev = true) => {
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

    setMonthString(Object.keys(monthNamesToNumbers)[newMonthIndex]);
    setYear(newYear);
  };

  return status === 'loading' ? (
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
    marginTop: 10,
  },
  period: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 320,
    marginTop: 20,
    alignItems: 'center',
    color: colors.headerBackground,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 32,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
