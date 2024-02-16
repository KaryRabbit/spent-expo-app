import { decode as atob } from 'base-64';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import { Alert } from 'react-native';
import { ExpenseItem } from '../types';

export const selectAndParseFile = async (): Promise<ExpenseItem[] | null> => {
  try {
    const file = await pickCsvFile();
    if (!file) return null;

    const decodedContent = await decodeFileContent(file.uri);
    if (!decodedContent) return null;

    const isSpecialCSV = checkIfSpecialCSV(decodedContent);
    const dataToParse = prepareDataForParsing(decodedContent, isSpecialCSV);

    return await parseCsvData(dataToParse, isSpecialCSV);
  } catch (err) {
    Alert.alert('File Error', 'Error selecting file');
    return null;
  }
};

const parseCsvData = async (
  data: string,
  isSpecialCSV: boolean
): Promise<ExpenseItem[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(data, {
      header: true,
      complete: (results) => {
        resolve(
          processCsvResults(
            results.data as Record<string, string>[],
            isSpecialCSV
          )
        );
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
};

const processCsvResults = (
  data: Record<string, string>[],
  isSpecialCSV: boolean
): ExpenseItem[] => {
  return data
    .map((row) => {
      const formattedRow = formatRowKeys(row);
      return isSpecialCSV
        ? parseSpecialCsvRow(formattedRow)
        : parseRegularCsvRow(formattedRow);
    })
    .filter((item) => item !== null) as ExpenseItem[];
};

const formatRowKeys = (row: Record<string, string>): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key.trim().toLowerCase(), value])
  );
};

const parseSpecialCsvRow = (
  row: Record<string, string>
): ExpenseItem | null => {
  if (!row['débito']?.trim()) return null;
  return {
    amount: transformAmountFormat(row['débito']),
    category: row['categoria'],
    description: row['descrição'],
    date: transformDate(row['data valor']),
  };
};

const parseRegularCsvRow = (
  row: Record<string, string>
): ExpenseItem | null => {
  if (!row['amount']?.trim()) return null;
  return {
    amount: transformAmountFormat(row['amount']),
    category: row['category'],
    description: row['description'],
    date: transformDate(row['date']),
  };
};

const checkIfSpecialCSV = (content: string) => content.includes('Débito');

const decodeFileContent = async (uri: string) => {
  const base64Content = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return atob(base64Content).trim();
};

const pickCsvFile = async () => {
  const response = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
  return response.canceled ? null : response.assets?.[0];
};

const prepareDataForParsing = (content: string, isSpecialCSV: boolean) => {
  if (!isSpecialCSV) return content;

  const allLines = content
    .split(/\r\n|\n/)
    .filter((line) => line.trim().length)
    .slice(0, -1);

  const headers = allLines[0]
    .split(';')
    .map((header) => header.trim().toLowerCase());
  const dataLines = allLines.slice(1).join('\n');

  return headers.join(';') + '\n' + dataLines;
};

const transformAmountFormat = (amountString: string) => {
  let normalizedAmount = amountString.replace(/\./g, '');
  normalizedAmount = normalizedAmount.replace(/,/g, '.');

  return normalizedAmount;
};

const transformDate = (dateString: string): string => {
  const formats = [
    {
      regex: /^(\d{4})-(\d{2})-(\d{2})$/,
      parts: (m: RegExpMatchArray) => ({ year: m[1], month: m[2], day: m[3] }),
    },
    {
      regex: /^(\d{2})-(\d{2})-(\d{4})$/,
      parts: (m: RegExpMatchArray) => ({ day: m[1], month: m[2], year: m[3] }),
    },
    {
      regex: /^(\d{2})\/(\d{2})\/(\d{4})$/,
      parts: (m: RegExpMatchArray) => ({ day: m[1], month: m[2], year: m[3] }),
    },
  ];

  for (const format of formats) {
    const match = dateString.match(format.regex);
    if (match) {
      const { year, month, day } = format.parts(match);

      const parsedYear = parseInt(year, 10);
      const parsedMonth = parseInt(month, 10);
      const parsedDay = parseInt(day, 10);

      const date = new Date(parsedYear, parsedMonth - 1, parsedDay);
      if (isNaN(date.getTime())) return dateString; // Check for invalid dates

      return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
  }

  return dateString;
};
