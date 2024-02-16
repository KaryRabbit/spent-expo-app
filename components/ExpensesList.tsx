import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
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
import { lightenHexColor } from '../service/tools';
import { deleteExpense } from '../store/expensesSlice';
import { AppDispatch } from '../store/store';
import { ExpenseItem, ExpensesListProps } from '../types';
import IconButton from './UI/IconButton';

const ExpensesList = ({ expenses, onEditItem }: ExpensesListProps) => {
  const [selectedId, setSelectedId] = useState<string | null | undefined>(null);

  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  useFocusEffect(
    useCallback(() => {
      setSelectedId(null);
    }, [])
  );

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
        <TouchableOpacity onPress={onItemPress} style={styles.itemContent}>
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
              <LinearGradient
                colors={[colors.primary, lightenHexColor(colors.primary, 15)]}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <IconButton
                  size={20}
                  onPress={onEditItem?.bind(this, item)}
                  iconName={'eye'}
                  color={colors.secondary}
                />
              </LinearGradient>
            )}
            <LinearGradient
              colors={[colors.accent, lightenHexColor(colors.accent, 15)]}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <IconButton
                size={20}
                onPress={onRemoveItem}
                iconName={'trash'}
                color={colors.white}
              />
            </LinearGradient>
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
    />
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderBottomColor: colors.disabled,
    borderBottomWidth: 1,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  leftSide: {
    flex: 1,
  },
  dateText: {
    color: colors.disabledText,
    maxWidth: '80%',
    marginTop: 8,
  },
  boldText: {
    color: colors.disabledText,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: 80,
    minHeight: 40,
    gap: 4,
    marginRight: 4,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
});

export default ExpensesList;
