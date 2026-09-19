import { useContext } from 'react';
import { useColorScheme } from 'react-native';
import colors from '@/constants/colors';
import { applyColorTheme } from '@/constants/colorThemes';
import { CaregiverContext } from '@/context/CaregiverContext';

/**
 * Returns the design tokens for the current color scheme, with any
 * caregiver-selected colour-blind theme overlay applied on top.
 *
 * Safe to call from components outside CaregiverProvider (e.g. the
 * missing-config splash): when the context is absent the default
 * palette is returned unchanged.
 */
export function useColors() {
  const scheme = useColorScheme();
  const caregiver = useContext(CaregiverContext);
  const colorTheme = caregiver?.settings?.colorTheme ?? 'default';

  const basePalette =
    scheme === 'dark' && 'dark' in colors
      ? (colors as Record<string, typeof colors.light>).dark
      : colors.light;

  return { ...applyColorTheme(basePalette, colorTheme), radius: colors.radius };
}
