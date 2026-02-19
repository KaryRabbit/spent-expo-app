import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import colors from '../colors';
import shadows from '../shadows';
import spacing, { radius } from '../spacing';
import { textStyles } from '../typography';
import { deleteExpense } from '../store/expensesSlice';
import { AppDispatch } from '../store/store';
import { ExpenseItem, ExpensesListProps } from '../types';
import IconButton from './UI/IconButton';

const ExpensesList = ({ expenses, onEditItem }: ExpensesListProps) => {
  const [selectedId, setSelectedId] = useState<string | null | undefined>(null);
  const prevLengthRef = useRef(expenses.length);

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSelectedId(null);
    }, [])
  );

  useEffect(() => {
    if (prevLengthRef.current !== expenses.length) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      prevLengthRef.current = expenses.length;
    }
  }, [expenses]);
  const dispatch = useDispatch<AppDispatch>();

  const renderExpenseItem = ({ item }: { item: ExpenseItem }) => {
    const marginLeft = new Animated.Value(0);

    const onItemPress = () => {
      if (selectedId === item.id) {
        setSelectedId(null);
        Animated.timing(marginLeft, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else {
        setSelectedId(item.id);
        Animated.timing(marginLeft, {
          toValue: -150,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    };

    const onRemoveItem = () => {
      if (selectedId) {
        dispatch(deleteExpense(selectedId));
      }
    };

    return (
      <Animated.View style={styles.listItem}>
        <TouchableOpacity
          onPress={onItemPress}
          style={styles.itemContent}
          activeOpacity={0.85}
        >
          <View style={styles.leftSide}>
            <Text
              style={styles.boldText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
          <Text style={styles.boldText} numberOfLines={1} ellipsizeMode="tail">
            €{item.amount}
          </Text>
        </TouchableOpacity>
        {selectedId === item.id && (
          <View style={styles.buttonsContainer}>
            {onEditItem && (
              <View style={[styles.button, styles.editButton]}>
                <IconButton
                  size={20}
                  onPress={onEditItem?.bind(this, item)}
                  iconName={'eye'}
                  color={colors.secondary}
                />
              </View>
            )}
            <View style={[styles.button, styles.deleteButton]}>
              <IconButton
                size={20}
                onPress={onRemoveItem}
                iconName={'trash'}
                color={colors.white}
              />
            </View>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <FlatList
      data={expenses}
      renderItem={renderExpenseItem}
      keyExtractor={(item) => item.id || ''}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
  },
  listItem: {
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.base,
  },
  itemContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.base,
  },
  leftSide: {
    flex: 1,
    marginRight: spacing.md,
  },
  dateText: {
    color: colors.textSecondary,
    maxWidth: '80%',
    marginTop: spacing.xs,
    fontSize: textStyles.small.fontSize,
  },
  boldText: {
    color: colors.textPrimary,
    fontWeight: textStyles.bodySemibold.fontWeight,
    fontSize: textStyles.body.fontSize,
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: 98,
    minHeight: 48,
    gap: spacing.sm,
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
});

export default ExpensesList;
