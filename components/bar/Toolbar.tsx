import { StyleSheet, View } from 'react-native';
import { BackButton } from '../button/BackButton';
import { ImportExportButton } from '../button/ImportExportButton';
import { SettingsButton } from '../button/SettingsButton';

interface ToolbarProps {
  color: string;
  routeSettingsButton?: string;
  noBackButton?: boolean;
  importExportButton?: boolean;
}

export function Toolbar({
  color,
  routeSettingsButton,
  noBackButton = false,
  importExportButton = false,
}: ToolbarProps) {
  return (
    <View
      style={{ ...styles.container, marginRight: importExportButton ? 0 : 24 }}
    >
      {!noBackButton && <BackButton color={color} />}
      {routeSettingsButton !== undefined && (
        <View style={styles.rightButton}>
          <SettingsButton color={color} route={routeSettingsButton} />
        </View>
      )}
      {importExportButton && (
        <View style={styles.rightButton}>
          <ImportExportButton color={color} />
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
  },
  rightButton: {
    marginLeft: 'auto',
  },
});
