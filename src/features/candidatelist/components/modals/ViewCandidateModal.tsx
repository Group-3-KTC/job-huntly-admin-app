import type { Candidate } from "../../types/candidateTypes";

interface ViewCandidateModalProps {
  candidate: Candidate;
  onClose: () => void;
}

export const ViewCandidateModal = ({ candidate, onClose }: ViewCandidateModalProps) => {
  // Helper function để xác định màu cho badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Candidate Profile</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {candidate.avatarUrl ? (
                <img src={candidate.avatarUrl} alt={candidate.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-gray-600">{candidate.name.charAt(0)}</span>
              )}
            </div>
            
            <h3 className="mt-4 text-xl font-semibold">{candidate.name}</h3>
            <p className="text-gray-600">{candidate.email}</p>
            {candidate.phone && <p className="text-gray-600">{candidate.phone}</p>}
            
            {/* Status badge */}
            <span className={`mt-2 px-3 py-1 rounded-full text-sm ${getStatusColor(candidate.status)}`}>
              {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
            </span>
          </div>

          {candidate.location_city && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Location</h4>
              <p>{candidate.location_city}</p>
            </div>
          )}
        </div>

        <div className="md:w-2/3">
          <div className="p-6 bg-gray-50 rounded-lg mb-4">
            <h4 className="font-medium mb-4">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.skills && candidate.skills.length > 0 ? (
                candidate.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No skills listed</p>
              )}
            </div>
          </div>

          {candidate.cvUrl && (
            <div className="p-6 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-4">CV / Resume</h4>
              <a 
                href={candidate.cvUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download CV
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 