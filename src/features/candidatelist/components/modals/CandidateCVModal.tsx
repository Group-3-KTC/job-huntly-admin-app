import React from 'react';
import { Modal } from './Modal';
import type { Candidate } from '../../types/candidateTypes';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface CandidateCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
}

const STATUS_LABEL: Record<Candidate['status'], { text: string; style: string }> = {
  active: { text: 'Active', style: 'bg-green-100 text-green-700' },
  banned: { text: 'Banned', style: 'bg-red-100 text-red-700' },
  inactive: { text: 'Inactive', style: 'bg-yellow-100 text-yellow-700' },
  pending: { text: 'Pending', style: 'bg-purple-100 text-purple-700' },
} as const;

/**
 * @param isOpen
 * @param onClose
 * @param candidate
 */
export const CandidateCVModal: React.FC<CandidateCVModalProps> = ({
  isOpen,
  onClose,
  candidate,
}) => {
  if (!candidate) return null;

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handleDownloadCV = () => {
    if (candidate.cvUrl) {
      const link = document.createElement('a');
      link.href = candidate.cvUrl;
      link.download = `CV-${candidate.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="View Candidate CV"
      size="xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">{candidate.name}</h3>
          <span
            className={`px-2 py-1 ${
              STATUS_LABEL[candidate.status].style
            } rounded-full text-xs`}
          >
            {STATUS_LABEL[candidate.status].text}
          </span>
        </div>
        
        <div className="border rounded bg-gray-50 h-[600px]">
          {candidate.cvUrl ? (
            <Worker workerUrl="/utils/pdf.worker.min.js">
              <Viewer
                fileUrl={candidate.cvUrl}
                plugins={[defaultLayoutPluginInstance]}
                defaultScale={1.0}
              />
            </Worker>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-xl">This candidate has no CV</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          {candidate.cvUrl && (
            <button
              onClick={handleDownloadCV}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              type="button"
            >
              Download
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}; 