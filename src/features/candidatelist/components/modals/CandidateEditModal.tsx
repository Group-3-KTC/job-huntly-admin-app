import React from 'react';
import { Modal } from './Modal';
import type { Candidate } from '../../types/candidateTypes';

interface CandidateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  formData: Partial<Candidate>;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CandidateEditModal: React.FC<CandidateEditModalProps> = ({
  isOpen,
  onClose,
  candidate,
  formData,
  onFormChange,
  onSubmit
}) => {
  if (!candidate) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit candidate information"
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={onFormChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username || ''}
              onChange={onFormChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={onFormChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={onFormChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Status
            </label>
            <select
              name="status"
              value={formData.status || 'active'}
              onChange={onFormChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="banned">Banned</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Avatar
            </label>
            <div className="flex items-center space-x-2">
              <img
                src={candidate.avatarUrl}
                alt="avatar"
                className="object-cover w-10 h-10 rounded-full"
              />
              <input
                type="file"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save changes
          </button>
        </div>
      </form>
    </Modal>
  );
}; 