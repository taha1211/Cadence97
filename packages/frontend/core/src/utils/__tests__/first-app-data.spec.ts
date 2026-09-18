/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

const initDoc = vi.fn(
  (_store: unknown, _props: unknown, _options: unknown) => {}
);
vi.mock('../../blocksuite/block-suite-editor', () => ({}));
vi.mock('../../blocksuite/initialization', () => ({
  initDocFromProps: initDoc,
}));
vi.mock('@blocksuite/affine/store', () => ({
  Text: class Text {
    constructor(readonly text: string) {}
    toString() {
      return this.text;
    }
  },
}));
const originalBuildConfig = globalThis.BUILD_CONFIG;
beforeEach(() => {
  localStorage.clear();
  initDoc.mockReset();
  vi.stubGlobal('fetch', vi.fn());
  vi.stubGlobal('BUILD_CONFIG', {
    ...originalBuildConfig,
    isMobileEdition: false,
  });
});
afterEach(() => {
  vi.unstubAllGlobals();
});

function createWorkspacesService({
  existing = [],
  createWorkspace,
}: {
  existing?: Array<{ id: string; flavour: string }>;
  createWorkspace?: (
    flavour: string
  ) => Promise<{ id: string; flavour: string }>;
} = {}) {
  const workspaces = [...existing];
  const createMock = vi.fn(
    createWorkspace ??
      (async (flavour: string) => {
        const meta = { id: `workspace-${workspaces.length + 1}`, flavour };
        workspaces.push(meta);
        return meta;
      })
  );
  const setMeta = vi.fn();
  const setDocMeta = vi.fn();
  const collection = {
    meta: { initialize: vi.fn(), setDocMeta },
    doc: { getMap: () => ({ set: setMeta }) },
    createDoc: () => ({ id: 'cadence-welcome', getStore: () => ({}) }),
  };
  const create = vi.fn(
    async (
      flavour: string,
      setup: (initialCollection: typeof collection) => Promise<void>
    ) => {
      await setup(collection);
      return await createMock(flavour);
    }
  );
  const service = {
    list: {
      ['workspaces$']: {
        get value() {
          return workspaces;
        },
      },
    },
    create,
    open: vi.fn(() => {
      throw new Error('Initial content must be saved by the workspace factory');
    }),
  };
  return { service, createMock, workspaces, setMeta, setDocMeta };
}

describe('createFirstAppData', () => {
  test('does not create on desktop when the first-open marker exists', async () => {
    localStorage.setItem('is-first-open', 'false');
    const { createFirstAppData } = await import('../first-app-data');
    const { service, createMock } = createWorkspacesService();

    expect(createFirstAppData(service as never)).toBeUndefined();
    expect(createMock).not.toHaveBeenCalled();
  });

  test('creates on mobile when the first-open marker is stale and no workspace exists', async () => {
    vi.stubGlobal('BUILD_CONFIG', {
      ...originalBuildConfig,
      isMobileEdition: true,
    });
    localStorage.setItem('is-first-open', 'false');
    const { createFirstAppData } = await import('../first-app-data');
    const { service, createMock } = createWorkspacesService();

    await expect(createFirstAppData(service as never)).resolves.toMatchObject({
      meta: { id: 'workspace-1', flavour: 'local' },
      defaultPageId: 'cadence-welcome',
    });
    expect(createMock).toHaveBeenCalledOnce();
    expect(localStorage.getItem('is-first-open')).toBe('false');
  });

  test('does not create when any workspace already exists', async () => {
    vi.stubGlobal('BUILD_CONFIG', {
      ...originalBuildConfig,
      isMobileEdition: true,
    });
    const { createFirstAppData } = await import('../first-app-data');
    const { service, createMock } = createWorkspacesService({
      existing: [{ id: 'existing-workspace', flavour: 'local' }],
    });

    expect(createFirstAppData(service as never)).toBeUndefined();
    expect(createMock).not.toHaveBeenCalled();
  });

  test('coalesces concurrent creation attempts', async () => {
    vi.stubGlobal('BUILD_CONFIG', {
      ...originalBuildConfig,
      isMobileEdition: true,
    });
    const { createFirstAppData } = await import('../first-app-data');
    let resolveCreate:
      | ((meta: { id: string; flavour: string }) => void)
      | undefined;
    const { service, createMock, workspaces } = createWorkspacesService({
      createWorkspace: flavour =>
        new Promise(resolve => {
          resolveCreate = meta => {
            workspaces.push(meta);
            resolve(meta);
          };
          expect(flavour).toBe('local');
        }),
    });

    const first = createFirstAppData(service as never);
    const second = createFirstAppData(service as never);
    await vi.waitFor(() => expect(resolveCreate).toBeDefined());
    resolveCreate?.({ id: 'workspace-1', flavour: 'local' });

    await expect(Promise.all([first, second])).resolves.toEqual([
      {
        meta: { id: 'workspace-1', flavour: 'local' },
        defaultPageId: 'cadence-welcome',
      },
      {
        meta: { id: 'workspace-1', flavour: 'local' },
        defaultPageId: 'cadence-welcome',
      },
    ]);
    expect(createMock).toHaveBeenCalledOnce();
  });

  test('does not persist the first-open marker when creation fails', async () => {
    vi.stubGlobal('BUILD_CONFIG', {
      ...originalBuildConfig,
      isMobileEdition: true,
    });
    const { createFirstAppData } = await import('../first-app-data');
    const error = new Error('create failed');
    const { service, createMock } = createWorkspacesService({
      createWorkspace: async () => {
        throw error;
      },
    });

    await expect(createFirstAppData(service as never)).rejects.toThrow(error);
    await expect(createFirstAppData(service as never)).rejects.toThrow(error);
    expect(createMock).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem('is-first-open')).toBeNull();
  });
});

describe('Cadence97 starter workspace', () => {
  test('saves welcome content in the initial workspace without fetching onboarding or opening a sync engine', async () => {
    const { buildShowcaseWorkspace } = await import('../first-app-data');
    const { service, createMock, setMeta, setDocMeta } =
      createWorkspacesService();
    const result = await buildShowcaseWorkspace(
      service as never,
      'local',
      'My workspace'
    );
    expect(createMock).toHaveBeenCalledWith('local');
    expect(setMeta).toHaveBeenCalledWith('name', 'My workspace');
    expect(setDocMeta).toHaveBeenCalledWith('cadence-welcome', {
      title: 'Welcome to Cadence97',
    });
    expect(result.defaultDocId).toBe('cadence-welcome');
    expect(initDoc).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
      title: 'Welcome to Cadence97',
    });
    const props = initDoc.mock.calls[0][1] as {
      paragraph: { text: { toString(): string } };
    };
    expect(props.paragraph.text.toString()).toContain(
      'Your work is stored in this browser'
    );
    expect(fetch).not.toHaveBeenCalled();
    expect(service.open).not.toHaveBeenCalled();
  });

  test('does not publish a workspace or first-open marker when welcome creation fails', async () => {
    const { createFirstAppData } = await import('../first-app-data');
    const { service, createMock } = createWorkspacesService();
    initDoc.mockImplementationOnce(() => {
      throw new Error('document failed');
    });
    await expect(createFirstAppData(service as never)).rejects.toThrow(
      'document failed'
    );
    expect(createMock).not.toHaveBeenCalled();
    expect(localStorage.getItem('is-first-open')).toBeNull();
  });
});
