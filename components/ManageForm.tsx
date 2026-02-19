import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../colors';
import shadows from '../shadows';
import spacing, { radius } from '../spacing';
import { textStyles } from '../typography';
import { ExpenseItem, ManageProps } from '../types';
import CustomButton from './UI/CustomButton';
import Input from './UI/Input';

const ManageForm = ({ onCancel, onSubmit, value }: ManageProps) => {
  const [inputs, setInputs] = useState({
    amount: { value: value?.amount.toString() ?? '', isValid: true },
    date: {
      value: value?.date.toString() ?? '',
      isValid: true,
    },
    description: {
      value: value?.description.toString() ?? '',
      isValid: true,
    },
    category: {
      value: value?.category.toString() ?? 'Others',
      isValid: true,
    },
  });

  const inputHandler = useCallback(
    (inputIdentifier: string, enteredValue: string) => {
      setInputs((prevValue) => ({
        ...prevValue,
        [inputIdentifier]: {
          value: enteredValue,
          isValid: true,
        },
      }));
    },
    []
  );

  const submitHandler = () => {
    const expenseData: ExpenseItem = {
      amount: inputs.amount?.value,
      date: inputs.date?.value,
      description: inputs.description?.value,
      category: inputs.category?.value,
    };

    const amountIsValid = validate('amount', expenseData);
    const dateIsValid = validate('date', expenseData);
    const descriptionIsValid = validate('description', expenseData);
    const categoryIsValid = validate('category', expenseData);
    if (amountIsValid && dateIsValid && descriptionIsValid) {
      onSubmit(expenseData);
    } else {
      setInputs((curr) => ({
        amount: { value: curr.amount.value, isValid: amountIsValid },
        date: { value: curr.date.value, isValid: dateIsValid },
        description: {
          value: curr.description.value,
          isValid: descriptionIsValid,
        },
        category: {
          value: curr.category.value,
          isValid: categoryIsValid,
        },
      }));
    }
  };

  const validate = (name: string, expenseData: ExpenseItem) => {
    switch (name) {
      case 'amount':
        return !isNaN(+expenseData.amount) && +expenseData.amount > 0;
      case 'date':
        const isValidDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(expenseData.date);
        if (!isValidDateFormat) {
          return false;
        }

        const timestamp = Date.parse(expenseData.date);
        if (isNaN(timestamp)) {
          return false; // Not a valid date
        }
        const date = new Date(timestamp);
        return date <= new Date();
      case 'category':
        return expenseData.category?.trim().length > 0;
      case 'description':
        return expenseData.description?.trim().length > 0;
      default:
        return false;
    }
  };

  const categories = ['Food', 'Transport', 'Shopping', 'Others'];

  const formIsValid =
    inputs.amount.isValid &&
    inputs.date.isValid &&
    inputs.description.isValid &&
    inputs.category.isValid;
  return (
    <View style={styles.form}>
      <>
        <SelectDropdown
          data={categories}
          onSelect={(selectedItem, index) => {
            inputHandler('category', selectedItem);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          defaultValueByIndex={2}
          buttonStyle={styles.dropdown1BtnStyle}
          buttonTextStyle={styles.dropdown1BtnTxtStyle}
          renderDropdownIcon={(isOpened) => {
            return (
              <FontAwesome
                name={isOpened ? 'chevron-up' : 'chevron-down'}
                color={colors.textMuted}
                size={16}
                style={{ marginRight: 8 }}
              />
            );
          }}
          dropdownIconPosition={'right'}
          dropdownStyle={styles.dropdown1DropdownStyle}
          rowStyle={styles.dropdown1RowStyle}
          rowTextStyle={styles.dropdown1RowTxtStyle}
        />
      </>
      <Input
        label="Amount"
        invalid={!inputs.amount.isValid}
        inputProps={{
          keyboardType: 'decimal-pad',
          onChangeText: inputHandler.bind(this, 'amount'),
          value: inputs.amount.value,
        }}
      />
      <Input
        label="Date"
        invalid={!inputs.date.isValid}
        inputProps={{
          placeholder: 'YYYY-MM-DD',
          maxLength: 10,
          onChangeText: inputHandler.bind(this, 'date'),
          value: inputs.date.value,
        }}
      />
      <Input
        label="Description"
        invalid={!inputs.description.isValid}
        style={styles.description}
        inputProps={{
          multiline: true,
          onChangeText: inputHandler.bind(this, 'description'),
          value: inputs.description.value,
        }}
      />
      {!inputs.amount.isValid && (
        <Text style={styles.error}>Please enter a valid amount.</Text>
      )}
      {!inputs.date.isValid && (
        <Text style={styles.error}>Please enter a valid date.</Text>
      )}
      {!inputs.description.isValid && (
        <Text style={styles.error}>Description cannot be empty.</Text>
      )}
      {!inputs.category.isValid && (
        <Text style={styles.error}>Please select a category.</Text>
      )}
      <View style={styles.buttons}>
        <CustomButton
          title="Cancel"
          onPress={onCancel}
          iconName="close"
          color={colors.primary}
          style={{ flex: 1 }}
        />
        <CustomButton
          title={value ? 'Update' : 'Add'}
          onPress={submitHandler}
          iconName={value ? 'create' : 'add'}
          color={colors.primary}
          disabled={!formIsValid}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.base,
    gap: spacing.base,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.base,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  error: {
    color: colors.error,
    marginTop: spacing.xs,
    textAlign: 'center',
    fontSize: textStyles.small.fontSize,
    fontWeight: textStyles.smallMedium.fontWeight,
  },
  description: {
    minHeight: 120,
  },
  dropdown1BtnStyle: {
    width: '100%',
    minHeight: 48,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: textStyles.body.fontSize,
    alignSelf: 'center',
    color: colors.textPrimary,
  },
  dropdown1RowTxtStyle: {
    color: colors.textPrimary,
    textAlign: 'left',
    marginRight: spacing.base,
    fontSize: textStyles.body.fontSize,
  },
  dropdown1BtnTxtStyle: {
    color: colors.textPrimary,
    textAlign: 'left',
    marginLeft: 0,
    fontSize: textStyles.body.fontSize,
    fontWeight: textStyles.bodyMedium.fontWeight,
  },
  dropdown1DropdownStyle: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdown1RowStyle: {
    backgroundColor: colors.surfaceSecondary,
    borderBottomColor: colors.border,
  },
});

export default ManageForm;
