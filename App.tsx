import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

interface Item {
  listId: number;
  id: number;
  name: string;
}

const FetchDataComponent: React.FC = () => {
  const [data, setData] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://fetch-hiring.s3.amazonaws.com/hiring.json');
        const result = await response.json();

        const filteredData = result.filter((item: Item) => item.name && item.name.trim() !== '');
        const groupedAndSortedData = groupAndSortData(filteredData);

        setData(groupedAndSortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const groupAndSortData = (originalData: Item[]) => {
    const groupedData = originalData.reduce((groups, item) => {
      const groupKey = item.listId;
      groups[groupKey] = groups[groupKey] || [];
      groups[groupKey].push(item);
      return groups;
    }, {});

    for (const key in groupedData) {
      groupedData[key].sort((a, b) => a.name.localeCompare(b.name));
    }

    const sortedGroups = Object.keys(groupedData).sort((a, b) => parseInt(a) - parseInt(b));

    const finalSortedData = sortedGroups.reduce((finalArray, key) => {
      finalArray.push(...groupedData[key]);
      return finalArray;
    }, []);

    return finalSortedData;
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{`ListId: ${item.listId}, Name: ${item.name}`}</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => `${item.listId}-${item.id}`}
      style={styles.flatList}
    />
  );
};

const styles = StyleSheet.create({
  flatList: {
    padding: 10,
  },
  itemContainer: {
    padding: 10,
    marginBottom: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FetchDataComponent;
