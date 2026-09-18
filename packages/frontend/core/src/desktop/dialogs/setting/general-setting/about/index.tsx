import {
  SettingHeader,
  SettingRow,
  SettingWrapper,
} from '@affine/component/setting-components';
import { OpenInNewIcon } from '@blocksuite/icons/rc';

import * as styles from './style.css';

export const AboutAffine = () => (
  <>
    <SettingHeader
      title="About Cadence97"
      subtitle="A personal workspace for documents, ideas, and canvases."
      data-testid="about-title"
    />
    <SettingWrapper title="This workspace">
      <SettingRow
        name="Cadence97"
        desc={BUILD_CONFIG.appVersion}
        className={styles.appImageRow}
      >
        <img src="/cadence-icon.svg" alt="Cadence97" width={56} height={56} />
      </SettingRow>
      <SettingRow name="Editor engine" desc={BUILD_CONFIG.editorVersion} />
      <SettingRow
        name="Stored on this device"
        desc="Your local workspace stays in this browser. Export important documents and workspace backups regularly."
      />
    </SettingWrapper>
    <SettingWrapper title="Project">
      <a
        className={styles.link}
        href="https://github.com/taha1211/Cadence97"
        target="_blank"
        rel="noreferrer"
      >
        Cadence97 source code <OpenInNewIcon className="icon" />
      </a>
    </SettingWrapper>
    <SettingWrapper title="Open-source notices">
      <SettingRow
        name="Built on open-source software"
        desc="Cadence97 is an independent fork of AFFiNE, with the BlockSuite editor. Original copyright and license notices are retained in the source distribution."
      />
    </SettingWrapper>
  </>
);
