import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

interface ToolbarProps {
  childrenOnTheRight?: boolean;
  addMarginRight?: boolean;
  children: ReactNode;
}

export function Toolbar({
  childrenOnTheRight = false,
  addMarginRight = false,
  children,
}: ToolbarProps) {
  return (
    <View
      style={{ ...styles.container, marginRight: addMarginRight ? 24 : 0 }}
      testID='toolbar'
    >
      {childrenOnTheRight ?
        <View style={styles.rightButton} testID='toolbar-children-container'>
          {children}
        </View>
        :
        children}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightButton: {
    marginLeft: 'auto',
  },
});
