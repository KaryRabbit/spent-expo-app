import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../colors';
import ExpensesList from '../components/ExpensesList';
import ManageForm from '../components/ManageForm';
import CustomButton from '../components/UI/CustomButton';
import IconButton from '../components/UI/IconButton';
import ModalView from '../components/UI/ModalView';
import { selectAndParseFile } from '../service/fileService';
import spacing from '../spacing';
import {
  addExpense,
  addExpensesAndFetch,
  fetchExpenses,
  updateExpense,
} from '../store/expensesSlice';
import { AppDispatch, RootState } from '../store/store';
import { ExpenseItem } from '../types';
import { textStyles } from '../typography';

const ExpensesScreen = ({ navigation }: any) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ExpenseItem | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const expenses = useSelector((state: RootState) => state.expenses.items);
  const status = useSelector((state: RootState) => state.expenses.status);
  const [modalVisible, setModalVisible] = useState(false);

  const HELP_TEXT = `Uploaded file should have CSV format and contain fields like amount,
  category, description, date (for English) or débito, categoria,
  descrição, data, valor (for Portuguese).`;

  useFocusEffect(
    useCallback(() => {
      setShowForm(false);
      setSelectedItem(null);
    }, []),
  );

  useEffect(() => {
    if (!expenses.length) {
      dispatch(fetchExpenses());
    }
  }, []);

  let sorted = [...expenses]?.sort((a, b) => b.date.localeCompare(a.date));
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        if (showForm) {
          return (
            <IconButton
              iconName="chevron-back-outline"
              onPress={handleBackPress}
              color={colors.white}
            />
          );
        }
      },
    });
  }, [navigation, showForm]);

  const handleBackPress = () => {
    if (showForm) {
      setShowForm(false);
      setSelectedItem(null);
    } else {
      navigation.goBack();
    }
  };

  const handleAddExpense = () => {
    setShowForm(true);
  };

  const onCancel = () => {
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleEditItem = (item: ExpenseItem) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const onSubmit = (data: ExpenseItem) => {
    setShowForm(false);
    selectedItem
      ? dispatch(updateExpense({ ...data, id: selectedItem.id }))
      : dispatch(addExpense(data));
    setSelectedItem(null);
  };

  const handleUploadExpenses = async () => {
    const data = await selectAndParseFile();
    if (data) {
      dispatch(addExpensesAndFetch(data));
    }
  };

  return showForm ? (
    <ScrollView>
      <ManageForm
        onCancel={onCancel}
        onSubmit={onSubmit}
        value={selectedItem}
      />
    </ScrollView>
  ) : (
    <View style={styles.container}>
      <>
        <View style={styles.buttonContainer}>
          <CustomButton
            style={{ flex: 1 }}
            title="Add Expense"
            onPress={handleAddExpense}
            iconName="add-circle-outline"
            color={colors.primary}
          />
          <CustomButton
            style={{ flex: 1 }}
            title="Upload"
            onPress={handleUploadExpenses}
            iconName="cloud-upload-outline"
            color={colors.primary}
          />
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons
              name="help-circle-outline"
              size={28}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        <ModalView
          text={HELP_TEXT}
          modalVisible={modalVisible}
          setModalVisible={(value) => setModalVisible(value)}
        />
        {status === 'loading' && (
          <ActivityIndicator
            size="large"
            color={colors.headerBackground}
            style={styles.loader}
          />
        )}
        {sorted?.length > 0 && status !== 'loading' ? (
          <ExpensesList expenses={sorted} onEditItem={handleEditItem} />
        ) : (
          <View style={styles.noData}>
            <Text style={styles.noDataText}>No data yet</Text>
          </View>
        )}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: colors.textMuted,
    fontSize: textStyles.body.fontSize,
    fontWeight: textStyles.bodyMedium.fontWeight,
  },
});

export default ExpensesScreen;
