import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { IconButton, IconButtonProps } from "react-native-paper";

interface CustomIconButtonProps extends IconButtonProps {
  isActive: boolean;
}

const CustomIconButton = ({
  onPress,
  isActive,
  ...props
}: CustomIconButtonProps) => {
  return (
    <TouchableOpacity style={styles.iconButton} onPress={onPress}>
      <IconButton
        size={isActive ? 30 : 25}
        iconColor={isActive ? "#ece7e5" : undefined}
        {...props}
      />
      {isActive && (
        <View
          style={{
            width: 20,
            backgroundColor: "#ece7e5",
            height: 5,
            borderRadius: 2.5,
          }}
        ></View>
      )}
    </TouchableOpacity>
  );
};

export default CustomIconButton;

const styles = StyleSheet.create({
  iconButton: {
    height: 65,
    width: 65,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    borderColor: "black",
  },
});
