import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Category, Transaction } from "../types";
import TransactionListItem from "./TransactionListItem";

export default function TransactionList({
    transactions,
    categories,
    deleteTransaction,
  }: {
    categories: Category[];
    transactions: Transaction[];
    deleteTransaction: (id: number) => Promise<void>;
  }) {

    const renderHiddenItem = (data: any, rowMap: any) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTransaction(data.item.id)}
            >
                <Text style={styles.deleteButtonText}>DELETE</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SwipeListView
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
                const categoryForCurrentItem = categories.find(
                    (category) => category.id === item.category_id
                );
                return (
                    <View style={styles.transactionItemContainer}>
                        <TransactionListItem 
                            transaction={item} 
                            categoryInfo={categoryForCurrentItem} 
                        />
                    </View>
                );
            }}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-80}  
            swipeToOpenPercent={30}  
            swipeToClosePercent={30}  
        />
    );
}

const styles = StyleSheet.create({
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingLeft: 15,
        paddingBottom: 10,
        marginVertical: 5,
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
        height: '99%',
        borderRadius: 25,
        marginBottom: -20, 
    },
    deleteButtonText: {
        color: 'white',
        fontFamily:"nothing"
    },
    transactionItemContainer: {
        marginVertical: 5, 
        paddingHorizontal: 0,
        paddingVertical: 0,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
});
