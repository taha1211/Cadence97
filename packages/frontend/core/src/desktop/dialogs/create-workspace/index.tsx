import { Button, ConfirmModal, notify, RowInput } from '@affine/component';
import { useAsyncCallback } from '@affine/core/components/hooks/affine-async-hooks';
import type {
  DialogComponentProps,
  GLOBAL_DIALOG_SCHEMA,
} from '@affine/core/modules/dialogs';
import { WorkspacesService } from '@affine/core/modules/workspace';
import { buildShowcaseWorkspace } from '@affine/core/utils/first-app-data';
import { useI18n } from '@affine/i18n';
import { useService } from '@toeverything/infra';
import { useState } from 'react';

import * as styles from './index.css';

export const CreateWorkspaceDialog = ({
  close,
}: DialogComponentProps<GLOBAL_DIALOG_SCHEMA['create-workspace']>) => {
  const t = useI18n();
  const workspacesService = useService(WorkspacesService);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const createWorkspace = useAsyncCallback(async () => {
    if (loading || !name.trim()) return;
    setLoading(true);
    try {
      const result = await buildShowcaseWorkspace(
        workspacesService,
        'local',
        name.trim()
      );
      close({ metadata: result.meta, defaultDocId: result.defaultDocId });
    } catch (error) {
      console.error(error);
      notify.error({
        title: 'Unable to create workspace',
        message: 'Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }, [close, loading, name, workspacesService]);
  return (
    <ConfirmModal
      open
      onOpenChange={open => {
        if (!open) close();
      }}
      title={t['com.affine.nameWorkspace.title']()}
      description="Create a workspace stored in this browser."
      cancelText={t['Cancel']()}
      childrenContentClassName={styles.content}
      closeButtonOptions={{
        ['data-testid' as string]: 'create-workspace-close-button',
      }}
      customConfirmButton={() => (
        <Button
          variant="primary"
          data-testid="create-workspace-create-button"
          loading={loading}
          disabled={!name.trim() || loading}
          onClick={createWorkspace}
        >
          {t['com.affine.nameWorkspace.button.create']()}
        </Button>
      )}
    >
      <label className={styles.label} htmlFor="cadence-workspace-name">
        {t['com.affine.nameWorkspace.subtitle.workspace-name']()}
      </label>
      <RowInput
        id="cadence-workspace-name"
        autoFocus
        className={styles.input}
        data-testid="create-workspace-input"
        placeholder={t['com.affine.nameWorkspace.placeholder']()}
        maxLength={64}
        onChange={setName}
      />
    </ConfirmModal>
  );
};
