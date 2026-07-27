import { AlertTriangle } from 'lucide-react';
import Modal from './Modal.jsx';

const ConfirmDialog = ({ open, onClose, onConfirm, title = 'Are you sure?', message, loading }) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    <div className="flex items-start gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
        <AlertTriangle size={24} />
      </span>
      <p className="text-sm leading-relaxed text-ink-600">
        {message || 'This action cannot be undone.'}
      </p>
    </div>
    <div className="mt-6 flex justify-end gap-3">
      <button onClick={onClose} className="btn-secondary">
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={loading}
        className="btn bg-red-500 text-white hover:bg-red-600"
      >
        {loading ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
