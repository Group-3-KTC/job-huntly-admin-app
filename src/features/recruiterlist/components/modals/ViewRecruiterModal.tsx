import { X, EnvelopeSimple, Phone, MapPin, Tag } from "@phosphor-icons/react";
import type { Recruiter } from "../../types/recruiterTypes";

interface ViewRecruiterModalProps {
  recruiter: Recruiter;
  onClose: () => void;
}

export const ViewRecruiterModal = ({
  recruiter,
  onClose,
}: ViewRecruiterModalProps) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recruiter Details</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar and basic info */}
        <div className="w-full md:w-1/3">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
              {recruiter.avatarUrl ? (
                <img
                  src={recruiter.avatarUrl}
                  alt={recruiter.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-600">
                  {recruiter.name.charAt(0)}
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold">{recruiter.name}</h3>
            <p className="text-gray-500 mb-4">{recruiter.email}</p>

            <div className="w-full bg-gray-100 rounded-lg p-4">
              <h4 className="font-medium mb-2">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <EnvelopeSimple size={18} className="text-gray-500" />
                  <span>{recruiter.email}</span>
                </div>
                {recruiter.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={18} className="text-gray-500" />
                    <span>{recruiter.phone}</span>
                  </div>
                )}
                {recruiter.location_city && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-gray-500" />
                    <span>{recruiter.location_city}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="w-full md:w-2/3">
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <h4 className="font-medium mb-2">Status</h4>
            <div
              className={`inline-block px-3 py-1 rounded-full text-sm ${
                recruiter.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : recruiter.status === "BANNED"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {recruiter.status}
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <h4 className="font-medium mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {recruiter.skills && recruiter.skills.length > 0 ? (
                recruiter.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    <Tag size={14} />
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No skills listed</span>
              )}
            </div>
          </div>

          {recruiter.cvUrl && (
            <div className="bg-gray-100 rounded-lg p-4">
              <h4 className="font-medium mb-2">CV/Resume</h4>
              <a
                href={recruiter.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                View CV/Resume
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 