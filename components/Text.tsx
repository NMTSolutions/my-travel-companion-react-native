import React from "react";

import { Text as DefaultText, TextProps, StyleSheet } from "react-native";

const Text = ({ children, style }: TextProps) => {
  return (
    <DefaultText style={{ ...styles.text, ...(style as object) }}>
      {children}
    </DefaultText>
  );
};

export default Text;

const styles = StyleSheet.create({
  text: {
    // fontFamily: "Poppins",
  },
});
