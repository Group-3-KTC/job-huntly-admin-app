import React from 'react';
import { Modal } from './Modal';
import type { Candidate } from '../../mock/mockCandidates';

interface CandidateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  onViewCV: (candidate: Candidate) => void;
}

const statusLabel = {
  active: { text: "Active", style: "bg-green-100 text-green-700" },
  blocked: { text: "Blocked", style: "bg-red-100 text-red-700" },
  pending: { text: "Pending", style: "bg-purple-100 text-purple-700" },
};

export const CandidateDetailsModal: React.FC<CandidateDetailsModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onViewCV
}) => {
  if (!candidate) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate information"
      size="lg"
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <img
            src={candidate.avatarUrl}
            alt="avatar"
            className="object-cover w-20 h-20 rounded-full"
          />
          <div>
            <h3 className="text-xl font-bold">{candidate.name}</h3>
            <p className="text-gray-500">{candidate.username}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="font-semibold">Email:</p>
            <p>{candidate.email}</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">Phone:</p>
            <p>{candidate.phone}</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">Status:</p>
            <p>
              <span
                className={`px-2 py-1 ${
                  statusLabel[candidate.status].style
                } rounded-full text-xs`}
              >
                {statusLabel[candidate.status].text}
              </span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">ID:</p>
            <p>{candidate.id}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <button
            onClick={() => {
              onClose();
              onViewCV(candidate);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View CV
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}; 