// src/components/ConfirmDialog.jsx
import { T } from '../theme';
import { Btn } from './Shared';
import { Modal } from './Shared';

/**
 * Confirmation dialog for dangerous actions
 * @param {boolean} open - Show dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {boolean} dangerous - Red theme if true, orange if false
 * @param {string} confirmText - Confirm button text (default "Confirm")
 * @param {string} cancelText - Cancel button text (default "Cancel")
 * @param {boolean} loading - Show spinner on confirm button
 * @param {function} onConfirm - Called when user confirms
 * @param {function} onCancel - Called when user cancels
 */
export function ConfirmDialog({
  open,
  title,
  message,
  dangerous = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}) {
  const color = dangerous ? T.red : T.orange;

  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p style={{
        fontFamily: T.font,
        fontSize: 14,
        color: T.textMuted,
        marginBottom: 24,
        lineHeight: 1.6,
      }}>
        {message}
      </p>

      <div style={{
        display: 'flex',
        gap: 10,
        justifyContent: 'flex-end',
      }}>
        <Btn
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelText}
        </Btn>
        <Btn
          variant={dangerous ? 'danger' : 'warning'}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Btn>
      </div>
    </Modal>
  );
}