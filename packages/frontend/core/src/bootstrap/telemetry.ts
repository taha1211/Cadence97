import { sentry, tracker } from '@affine/track';

// This fork has no analytics provider. Do not initialize the upstream SDKs.
sentry.disable();
tracker.opt_out_tracking();
