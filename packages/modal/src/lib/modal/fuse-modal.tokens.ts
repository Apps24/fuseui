import { InjectionToken, Type } from '@angular/core';
import type { FuseModalConfig } from './fuse-modal.config';
import type { FuseModalRef } from './fuse-modal-ref';

/** The dynamic component type to render inside the modal shell. */
export const FUSE_MODAL_COMPONENT = new InjectionToken<Type<unknown>>(
  'FUSE_MODAL_COMPONENT',
);

/** Resolved configuration for the open modal. */
export const FUSE_MODAL_CONFIG = new InjectionToken<Required<FuseModalConfig>>(
  'FUSE_MODAL_CONFIG',
);

/** Reference to the open modal; injectable inside the hosted component. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FUSE_MODAL_REF = new InjectionToken<FuseModalRef<any>>(
  'FUSE_MODAL_REF',
);

/**
 * Arbitrary data passed via FuseModalConfig.data.
 * Inject this token in the hosted component to receive it.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FUSE_MODAL_DATA = new InjectionToken<any>('FUSE_MODAL_DATA');
