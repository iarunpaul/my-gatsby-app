import React, { useState, useEffect } from 'react';
import {
  fetchCertifications,
  isCertificationExpired,
  groupCertificationsByIssuer,
  sortCertificationsByDate
} from '../utils/fetchCertifications';

// Fallback image function
const getFallbackImage = () => {
  const svg = `
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="8" fill="#6b7280"/>
      <text x="32" y="38" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="white">🏆</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const Certifications = ({ displayMode = 'grid', maxItems = null }) => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupByIssuer, setGroupByIssuer] = useState(false);

  useEffect(() => {
    const loadCertifications = async () => {
      try {
        setLoading(true);
        setError(null);

        const certs = await fetchCertifications();
        const sortedCerts = sortCertificationsByDate(certs);
        const displayCerts = maxItems ? sortedCerts.slice(0, maxItems) : sortedCerts;

        setCertifications(displayCerts);
      } catch (err) {
        console.error('Error loading certifications:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCertifications();
  }, [maxItems]);

  const handleRetry = () => {
    setCertifications([]);
    setError(null);
    const loadCertifications = async () => {
      try {
        setLoading(true);
        const certs = await fetchCertifications();
        const sortedCerts = sortCertificationsByDate(certs);
        const displayCerts = maxItems ? sortedCerts.slice(0, maxItems) : sortedCerts;
        setCertifications(displayCerts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCertifications();
  };

  if (loading) {
    return (
      <div className="certifications-loading">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading certifications...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="certifications-error bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-red-500 text-xl mr-3">⚠️</div>
          <div>
            <h3 className="text-red-800 font-semibold">Failed to Load Certifications</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!certifications || certifications.length === 0) {
    return (
      <div className="certifications-empty bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="text-gray-400 text-4xl mb-3">🏆</div>
        <h3 className="text-gray-700 font-semibold">No Certifications Found</h3>
        <p className="text-gray-500 text-sm mt-1">Check back later for updates!</p>
      </div>
    );
  }

  const CertificationCard = ({ cert }) => {
    const isExpired = isCertificationExpired(cert);
    const [imageError, setImageError] = useState(false);

    const handleImageError = (e) => {
      if (!imageError) {
        setImageError(true);
        e.target.src = getFallbackImage();
      }
    };

    return (
      <div className={`certification-card bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow p-4 ${isExpired ? 'opacity-75' : ''}`}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img
              src={cert.image_url}
              alt={cert.name}
              className="w-16 h-16 object-contain rounded"
              onError={handleImageError}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {cert.name}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {cert.issuer}
                </p>
              </div>

              {isExpired && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                  Expired
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
              {cert.description}
            </p>

            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-gray-400">
                Issued: {new Date(cert.issued_at).toLocaleDateString()}
                {cert.expires_at && (
                  <span className="ml-2">
                    • Expires: {new Date(cert.expires_at).toLocaleDateString()}
                  </span>
                )}
              </div>

              {cert.public_url && (
                <a
                  href={cert.public_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                >
                  View →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCertifications = () => {
    if (groupByIssuer) {
      const grouped = groupCertificationsByIssuer(certifications);

      return Object.entries(grouped).map(([issuer, certs]) => (
        <div key={issuer} className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-3">
              {certs.length}
            </span>
            {issuer}
          </h3>
          <div className={`grid gap-4 ${displayMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {certs.map(cert => (
              <CertificationCard key={cert.id} cert={cert} />
            ))}
          </div>
        </div>
      ));
    } else {
      return (
        <div className={`grid gap-4 ${displayMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {certifications.map(cert => (
            <CertificationCard key={cert.id} cert={cert} />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="certifications-container">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-gray-900">
            🏆 Professional Certifications
          </h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {certifications.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setGroupByIssuer(!groupByIssuer)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              groupByIssuer
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {groupByIssuer ? 'Show All' : 'Group by Issuer'}
          </button>
        </div>
      </div>

      {renderCertifications()}

      {maxItems && certifications.length >= maxItems && (
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Showing {maxItems} of {certifications.length} certifications
          </p>
        </div>
      )}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .certification-card:hover {
          transform: translateY(-1px);
        }

        .certification-card {
          transition: all 0.2s ease-in-out;
        }

        @media (max-width: 768px) {
          .certifications-container h2 {
            font-size: 1.5rem;
          }

          .flex-wrap-mobile {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Certifications;