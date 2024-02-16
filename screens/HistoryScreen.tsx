import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../colors';
import ExpensesList from '../components/ExpensesList';
import CustomButton from '../components/UI/CustomButton';
import { fetchExpenses } from '../store/expensesSlice';
import { AppDispatch, RootState } from '../store/store';
import { ExpenseItem } from '../types';

const HistoryScreen = () => {
  const expenses = useSelector((state: RootState) => state.expenses.items);
  const status = useSelector((state: RootState) => state.expenses.status);

  const [transactions, setTransactions] = useState<ExpenseItem[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (!expenses.length) {
      dispatch(fetchExpenses());
    }
  }, []);
  useEffect(() => {
    setTransactions(expenses);
  }, [expenses]);

  const onStartDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const onEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <>
      <View style={styles.datePicker}>
        <CustomButton
          iconName="calendar-outline"
          color={colors.primary}
          onPress={() =>
            setShowStartDatePicker((currentValue) => !currentValue)
          }
          title="Choose Start Date"
        />

        <CustomButton
          color={colors.primary}
          iconName="calendar-outline"
          onPress={() => setShowEndDatePicker((currentValue) => !currentValue)}
          title="Choose End Date"
        />
      </View>
      <View style={[styles.datePicker, { justifyContent: 'center' }]}>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={onStartDateChange}
          />
        )}
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={onEndDateChange}
          />
        )}
      </View>

      {sortedTransactions?.length > 0 && status !== 'loading' ? (
        <ExpensesList expenses={sortedTransactions} />
      ) : (
        <View style={styles.noData}>
          <Text>Please choose the period</Text>
        </View>
      )}
    </>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 8,
  },
});
