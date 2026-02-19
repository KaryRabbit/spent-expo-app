import { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import { barDataItem } from 'react-native-gifted-charts';
export type ExpenseItem = {
  id?: string | null;
  amount: string;
  category: string;
  description: string;
  date: string;
};

export type ExpensesListProps = {
  expenses: ExpenseItem[];
  onEditItem?: (item: ExpenseItem) => void;
};

export type CustomButtonProps = {
  title?: string;
  onPress: () => void;
  iconName?: string;
  color?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  size?: number;
};

export type ExpensesState = {
  items: ExpenseItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

export type InputProps = {
  label: string;
  inputProps: TextInputProps;
  invalid?: boolean;
  style?: StyleProp<ViewStyle>;
};

export type ManageProps = {
  onCancel: () => void;
  onSubmit: (data: ExpenseItem) => void;
  value?: ExpenseItem | null;
};

export type ModalProps = {
  text: string;
  setModalVisible: (modalVisible: boolean) => void;
  modalVisible: boolean;
};

export type User = {
  uid: string;
  email: string | null;
};

export type LoginData = {
  email: string;
  password: string;
};

export type AuthState = {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

export interface ExtendedItemType extends barDataItem {
  percentage?: string;
  text?: string;
  focused?: boolean;
  color?: string;
}

export interface PasswordInputProps {
  label: string;
  invalid?: boolean;
  onChangeText?: TextInputProps['onChangeText'];
  value?: TextInputProps['value'];
}

export interface SwitchProps {
  onSwitch: () => void;
  isEnabled: boolean;
  textOff: string;
  textOn: string;
}
