import { Tooltip } from '@affine/component';
import { useI18n } from '@affine/i18n';
import { DoneIcon } from '@blocksuite/icons/rc';
import { DEFAULT_ACCENT_CHROMA, DEFAULT_ACCENT_HUE } from '@toeverything/infra';
import { assignInlineVars } from '@vanilla-extract/dynamic';

import { useAppSettingHelper } from '../../../../../components/hooks/affine/use-app-setting-helper';
import { accents } from '../../../../../modules/theme/accent';
import * as styles from './accent-picker.css';

export const AccentPicker = () => {
  const t = useI18n();
  const { appSettings, updateSettings } = useAppSettingHelper();
  const hue = appSettings.accentHue ?? DEFAULT_ACCENT_HUE;
  const chroma = appSettings.accentChroma ?? DEFAULT_ACCENT_CHROMA;

  return (
    <div
      role="radiogroup"
      aria-label={t['com.affine.appearanceSettings.accent.title']()}
      className={styles.group}
    >
      {accents.map(accent => {
        const name = t[`com.affine.appearanceSettings.accent.${accent.id}`]();
        const checked = accent.hue === hue && accent.chroma === chroma;
        return (
          <Tooltip key={accent.id} content={name}>
            <button
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={name}
              data-testid={`accent-${accent.id}`}
              className={styles.swatch}
              style={assignInlineVars({
                [styles.swatchColor]: `oklch(0.62 ${0.16 * accent.chroma} ${accent.hue})`,
              })}
              onClick={() => {
                updateSettings('accentHue', accent.hue);
                updateSettings('accentChroma', accent.chroma);
              }}
            >
              <DoneIcon className={styles.check} />
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
};
