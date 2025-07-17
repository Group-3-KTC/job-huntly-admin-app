import React from 'react';
import { Modal } from './Modal';
import type { Candidate } from '../../mock/mockCandidates';

interface CandidateCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
}

const statusLabel = {
  active: { text: "Active", style: "bg-green-100 text-green-700" },
  blocked: { text: "Blocked", style: "bg-red-100 text-red-700" },
  pending: { text: "Pending", style: "bg-purple-100 text-purple-700" },
};

export const CandidateCVModal: React.FC<CandidateCVModalProps> = ({
  isOpen,
  onClose,
  candidate
}) => {
  if (!candidate) return null;

  const handleDownloadCV = () => {
    // TODO: Tải xuống CV
    console.log("Download CV of:", candidate.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate CV"
      size="xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">{candidate.name}</h3>
          <span
            className={`px-2 py-1 ${
              statusLabel[candidate.status].style
            } rounded-full text-xs`}
          >
            {statusLabel[candidate.status].text}
          </span>
        </div>
        <div className="border rounded p-4 min-h-[400px] bg-gray-50">
          <div className="text-center py-10">
            <p className="text-gray-500">
              This is where the candidate's CV is displayed.
            </p>
            <p className="text-gray-500 mt-2">
              (CV of {candidate.name})
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleDownloadCV}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Download
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