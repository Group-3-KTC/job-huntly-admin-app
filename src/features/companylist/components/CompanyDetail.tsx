import { Dialog } from "@headlessui/react";
import { FacebookLogo, LinkedinLogo, TwitterLogo, Globe, MapPin, Calendar, Users, Star, Briefcase, Phone, Envelope, User, HashStraight, Buildings } from "@phosphor-icons/react";
import type { Company } from "../types/companyType";

interface Props {
  company: Company | null;
  onClose: () => void;
}

export default function CompanyDetailModal({ company, onClose }: Props) {
  if (!company) return null;

  // Mặc định avatar nếu không có
  const defaultAvatar = "https://via.placeholder.com/150?text=No+Avatar";

  return (
    <Dialog
      open={!!company}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />

        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-auto z-50 overflow-hidden">          
          <div className="flex flex-col md:flex-row">
            {/* Left Column - Avatar and Basic Info */}
            <div className="md:w-1/3 p-6 border-r border-gray-200">
              <div className="flex flex-col items-center mb-6">
                <img 
                  src={company.avatar || defaultAvatar} 
                  alt={company.companyName} 
                  className="w-24 h-24 rounded-xl border-2 border-gray-200 shadow-md object-cover"
                />
                <h2 className="text-xl font-bold mt-4 text-center">{company.companyName}</h2>
                
                {/* Status Badge */}
                <span
                  className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    company.status === "active"
                      ? "bg-green-100 text-green-700"
                      : company.status === "banned"
                      ? "bg-red-100 text-red-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {company.status === "active"
                    ? "Active"
                    : company.status === "banned"
                    ? "Blocked"
                    : "Pending"}
                </span>

                {/* Pro badge */}
                {company.isProCompany && (
                  <div className="mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center">
                    <Star weight="fill" className="mr-1" size={16} />
                    Pro Company
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-3 mt-6">
                <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
                
                <div className="flex items-center">
                  <Envelope className="text-gray-500 mr-2" size={18} />
                  <span>{company.email}</span>
                </div>
                
                <div className="flex items-center">
                  <Phone className="text-gray-500 mr-2" size={18} />
                  <span>{company.phoneNumber}</span>
                </div>
                
                {company.website && (
                  <div className="flex items-center">
                    <Globe className="text-gray-500 mr-2" size={18} />
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                      {company.website}
                    </a>
                  </div>
                )}

                <div className="flex items-center">
                  <MapPin className="text-gray-500 mr-2" size={18} />
                  <span>{company.address}, {company.locationCity}, {company.locationCountry}</span>
                </div>

                {/* Social Media */}
                <div className="flex space-x-2 mt-4">
                  {company.facebookUrl && (
                    <a href={company.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                      <FacebookLogo size={20} />
                    </a>
                  )}
                  {company.linkedinUrl && (
                    <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200">
                      <LinkedinLogo size={20} />
                    </a>
                  )}
                  {company.twitterUrl && (
                    <a href={company.twitterUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-100 text-blue-500 rounded-full hover:bg-blue-200">
                      <TwitterLogo size={20} />
                    </a>
                  )}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Calendar size={16} className="mr-1" />
                    <span className="text-xs">Founded</span>
                  </div>
                  <div className="font-semibold">{company.foundedYear}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Users size={16} className="mr-1" />
                    <span className="text-xs">Employees</span>
                  </div>
                  <div className="font-semibold">{company.quantityEmployee}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-gray-500 mb-1">
                    <User size={16} className="mr-1" />
                    <span className="text-xs">Followers</span>
                  </div>
                  <div className="font-semibold">{company.followersCount}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Briefcase size={16} className="mr-1" />
                    <span className="text-xs">Jobs</span>
                  </div>
                  <div className="font-semibold">{company.jobsCount}</div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="md:w-2/3 p-6 overflow-y-auto max-h-[calc(100vh-100px)]">
              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {company.parentCategories.map((category, index) => (
                    <span key={`parent-${index}`} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm">
                      <Buildings size={14} className="inline mr-1" />
                      {category}
                    </span>
                  ))}
                  {company.categories.map((category, index) => (
                    <span key={`cat-${index}`} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm">
                      <HashStraight size={14} className="inline mr-1" />
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{company.description}</p>
              </div>

              {/* Map if available */}
              {company.mapEmbedUrl && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold border-b pb-2 mb-3">Location</h3>
                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    <iframe
                      src={company.mapEmbedUrl}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Additional metadata */}
              <div className="mt-6 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Company ID: {company.id}</span>
                  <span>User ID: {company.userId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-700 p-2 rounded-full shadow-md transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
