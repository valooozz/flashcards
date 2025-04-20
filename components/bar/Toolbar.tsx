import { StyleSheet, View } from 'react-native';
import { BackButton } from '../button/BackButton';
import { SettingsButton } from '../button/SettingsButton';

interface ToolbarProps {
  color: string;
  routeSettingsButton?: string;
  noBackButton?: boolean;
}

export function Toolbar({
  color,
  routeSettingsButton,
  noBackButton = false,
}: ToolbarProps) {
  return (
    <View style={styles.container}>
      {!noBackButton && <BackButton color={'color'} />}
      {routeSettingsButton !== undefined && (
        <View style={styles.settingsButton}>
          <SettingsButton color={color} route={routeSettingsButton} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 24,
  },
  settingsButton: {
    marginLeft: 'auto',
  },
});
