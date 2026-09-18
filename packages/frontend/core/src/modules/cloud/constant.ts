import { ServerDeploymentType, ServerFeature } from '@affine/graphql';

import type { ServerConfig, ServerMetadata } from './types';

export const BUILD_IN_SERVERS: (ServerMetadata & { config: ServerConfig })[] = [
  {
    id: 'affine-cloud', // Persisted identifier; not a hosted AFFiNE connection.
    baseUrl: BUILD_CONFIG.isNative ? 'http://localhost:8080' : location.origin,
    config: {
      serverName: 'Cadence97',
      features: [ServerFeature.LocalWorkspace],
      oauthProviders: [],
      type: ServerDeploymentType.Selfhosted,
      credentialsRequirement: { password: { minLength: 8, maxLength: 32 } },
    },
  },
];
