export type FuseModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';
export type FuseConfirmType = 'danger' | 'warning' | 'info';

export interface FuseModalConfig {
  /** Panel size. Default: 'md'. */
  size?: FuseModalSize;
  /** Show the built-in × close button. Default: true. */
  closable?: boolean;
  /** Close when the backdrop is clicked. Default: true. */
  backdropDismiss?: boolean;
  /** Arbitrary data injected as FUSE_MODAL_DATA in the hosted component. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export interface FuseConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: FuseConfirmType;
}
