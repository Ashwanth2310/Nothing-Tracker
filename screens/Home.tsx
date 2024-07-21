import * as React from 'react'
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { Category, Transaction } from '../types';
import { useSQLiteContext } from 'expo-sqlite';
import TransactionList from '../components/TransactionsList';

export default function Home() {
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);

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
    }

    async function deleteTransaction(id: number) {
        db.withTransactionAsync(async () => {
          await db.runAsync(`DELETE FROM Transactions WHERE id = ?;`, [id]);
          await getData();
        });
    }

    return (
        <ScrollView
          contentContainerStyle={styles.container}
        >
          <TransactionList
            categories={categories}
            transactions={transactions}
            deleteTransaction={deleteTransaction}
          />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        paddingVertical: 140,
        backgroundColor: 'black', // Set the background color to black
    }
});
