import React from "react";
import { View, GestureResponderEvent } from "react-native";
import { Badge, IconButton } from "react-native-paper";

const IconButtonWithBadge = ({
  icon,
  badgeContent = 0,
  withContent = true,
  showBadge = true,
  onPress,
  size = 25,
}: {
  icon: string;
  badgeContent?: number;
  withContent?: boolean;
  showBadge?: boolean;
  size?: number;
  onPress?:
    | (((event: GestureResponderEvent) => void) &
        ((e: GestureResponderEvent) => void) &
        ((e: GestureResponderEvent) => void))
    | undefined;
}) => {
  if (!showBadge) return <IconButton icon={icon} size={30} onPress={onPress} />;
  return (
    <View style={{ position: "relative" }}>
      <IconButton icon={icon} size={size} onPress={onPress} />
      {withContent ? (
        <Badge style={{ position: "absolute", top: 10, right: 10 }}>
          {badgeContent}
        </Badge>
      ) : (
        <Badge style={{ position: "absolute", top: 10, right: 10 }}></Badge>
      )}
    </View>
  );
};

export default IconButtonWithBadge;
