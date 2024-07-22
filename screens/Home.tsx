import * as React from 'react';
import { ScrollView, Text, View, StyleSheet, TextStyle } from 'react-native';
import { Category, Transaction, TransactionsByMonth } from '../types';
import { useSQLiteContext } from 'expo-sqlite';
import TransactionList from '../components/TransactionsList';
import Card from '../components/ui/Card';
import AddTransaction from '../components/AddTransaction';

export default function Home() {
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [transactionsByMonth, setTransactionsByMonth] =
    React.useState<TransactionsByMonth>({
      totalExpenses: 0,
      totalIncome: 0,
    });

    const db = useSQLiteContext();

    React.useEffect(()=> {
        db.withTransactionAsync(async ()=>{
            await getData();
        })
    },[db])

    async function getData() {
        const result = await db.getAllAsync<Transaction>(
            `SELECT * FROM Transactions ORDER by date DESC`
        );
        setTransactions(result)

        const categoriesResult = await db.getAllAsync<Category>(
            `SELECT * FROM Categories`
        );
        setCategories(categoriesResult)


        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

        const startOfMonthTimestamp = Math.floor(startOfMonth.getTime() / 1000);
        const endOfMonthTimestamp = Math.floor(endOfMonth.getTime() / 1000);

        const transactionsByMonth = await db.getAllAsync<TransactionsByMonth>(
            `SELECT
            COALESCE(SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END), 0) AS totalExpenses,
            COALESCE(SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END), 0) AS totalIncome
            FROM Transactions
            WHERE date >= ? AND date <= ?;`,
            [startOfMonthTimestamp,endOfMonthTimestamp]
        )
        setTransactionsByMonth(transactionsByMonth[0])
    }

    async function deleteTransaction(id: number) {
        db.withTransactionAsync(async () => {
          await db.runAsync(`DELETE FROM Transactions WHERE id = ?;`, [id]);
          await getData();
        });
    }

    async function insertTransaction(transaction: Transaction) {
        db.withTransactionAsync(async () => {
          await db.runAsync(
            `
            INSERT INTO Transactions (category_id, amount, date, description, type) VALUES (?, ?, ?, ?, ?);
          `,
            [
              transaction.category_id,
              transaction.amount,
              transaction.date,
              transaction.description,
              transaction.type,
            ]
          );
          await getData();
        });
      }

    return (
        <ScrollView
          contentContainerStyle={styles.container}
        >
            <AddTransaction insertTransaction={insertTransaction}/>
            <TransactionSummary totalExpenses={transactionsByMonth.totalExpenses} totalIncome={transactionsByMonth.totalIncome} />
          <TransactionList
            categories={categories}
            transactions={transactions}
            deleteTransaction={deleteTransaction}
          />
        </ScrollView>
    )
}

function TransactionSummary({
    totalIncome,
    totalExpenses,
  }: TransactionsByMonth) {
    const savings = totalIncome - totalExpenses;
    const readablePeriod = new Date().toLocaleDateString("default", {
      month: "long",
      year: "numeric",
    });

    const getMoneyTextStyle = (value: number): TextStyle => ({
        fontWeight: 'bold',
        color: value < 0 ? '#ff4500' : '#2e8b57', 
    });

    const formatMoney = (value: number) => {
        const absValue = Math.abs(value).toFixed(2);
        return `${value < 0 ? '-' : ''}$${absValue}`;
    };

    return (
        <Card style={styles.card}>
            <Text style={styles.periodTitle}>Summary for {readablePeriod}</Text>
            <Text>‎ </Text>
            <View style={styles.summaryItem}>
                <Text style={styles.summaryText}>Income: </Text>
                <Text style={[styles.summaryText, getMoneyTextStyle(totalIncome)]}>
                    {formatMoney(totalIncome)}
                </Text>
                
            </View>
            
            <View style={styles.summaryItem}>
            
                <Text style={styles.summaryText}>Total Expenses: </Text>
                <Text style={[styles.summaryText, getMoneyTextStyle(totalExpenses)]}>
                    {formatMoney(totalExpenses)}
                    
                </Text>
                
            </View>
            <View style={styles.summaryItem}>
                <Text style={styles.summaryText}>Savings: </Text>
                <Text style={[styles.summaryText, getMoneyTextStyle(savings)]}>
                    {formatMoney(savings)}
                </Text>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        backgroundColor: 'black',
    },
    card: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    periodTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color:"white"
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryText: {
        fontSize: 18,
        color: '#333',
    },
});

