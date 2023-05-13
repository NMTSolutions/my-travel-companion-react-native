import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { chunkArrayInGroups } from "../utilities/utils";

const Grid = ({
  columns,
  items,
  render,
  onPress,
}: {
  columns: number;
  items: unknown[];
  render: (item: unknown, index: number) => React.ReactNode;
  onPress?: (item: unknown, index: number) => void;
}) => {
  const convertedInRows = chunkArrayInGroups(items, columns);

  const getView = (item: unknown, index: number) => {
    if (onPress) {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => onPress(item, index)}
          style={styles.cell}
        >
          {render(item, index)}
        </TouchableOpacity>
      );
    }
    return (
      <View key={index} style={styles.cell}>
        {render(item, index)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {convertedInRows.map((rows, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {rows.map((item, cellIndex) => getView(item, cellIndex))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 8,
  },
  cell: {
    backgroundColor: "#fff",
    width: "49%",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});

export default Grid;
