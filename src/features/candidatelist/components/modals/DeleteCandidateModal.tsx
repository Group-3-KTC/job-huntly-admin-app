import type { Candidate } from "../../types/candidateTypes";

interface DeleteCandidateModalProps {
  candidate: Candidate;
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteCandidateModal = ({
  candidate,
  onClose,
  onDelete,
}: DeleteCandidateModalProps) => {
  return (
    <div className="p-6">
      <div className="text-center">
        <svg
          className="mx-auto mb-4 text-red-500 w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h3 className="mb-5 text-lg font-semibold text-gray-800">
          Delete Candidate
        </h3>
        <p className="mb-5 text-gray-600">
          Are you sure you want to delete <strong>{candidate.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}; 