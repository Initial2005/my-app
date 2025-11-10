import React, { useState, useEffect } from "react";
import "./Certificates.css";
import {
  Award,
  Download,
  Share2,
  CheckCircle,
  Trophy,
  Star,
  Calendar,
  Code,
} from "lucide-react";

const Certificates = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sampleCourses = [
    {
      id: 1,
      courseName: "Python for Beginners",
      language: "Python",
      completedDate: "15 Oct 2025",
      instructor: "Dr. Rajesh Kumar",
      certificateId: "CERT-PY-2025-001",
      score: 95,
      thumbnail: "🐍",
      badge: {
        name: "Python Master",
        color: "#4A9EFF",
        icon: "🏆",
      },
    },
    {
      id: 2,
      courseName: "Web Development with React",
      language: "JavaScript",
      completedDate: "10 Oct 2025",
      instructor: "Sneha Gupta",
      certificateId: "CERT-REACT-2025-002",
      score: 92,
      thumbnail: "⚛️",
      badge: {
        name: "React Developer",
        color: "#00D4AA",
        icon: "⚛️",
      },
    },
    {
      id: 3,
      courseName: "SQL & Database Design",
      language: "SQL",
      completedDate: "5 Oct 2025",
      instructor: "Neha Reddy",
      certificateId: "CERT-SQL-2025-003",
      score: 88,
      thumbnail: "🗄️",
      badge: {
        name: "Database Expert",
        color: "#FFC107",
        icon: "💾",
      },
    },
  ];

  useEffect(() => {
    let mounted = true;
    async function fetchCertificates() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:4000/api/certificates');
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        if (mounted) {
          // map server documents into the expected client shape
          const mapped = data.map((d, idx) => ({
            id: idx + 1,
            courseName: d.title || 'Untitled',
            language: d.language || 'N/A',
            completedDate: new Date(d.issuedAt || d.createdAt).toLocaleDateString(),
            instructor: d.issuer || 'Unknown',
            certificateId: d._id,
            score: d.score || 0,
            thumbnail: '🎓',
            badge: {
              name: d.title || 'Certificate',
              color: '#4A9EFF',
              icon: '🏆',
            },
          }));
          setCompletedCourses(mapped);
        }
      } catch (err) {
        console.warn('Failed to fetch certificates:', err.message);
        if (mounted) {
          setError(err.message);
          setCompletedCourses(sampleCourses);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchCertificates();
    return () => { mounted = false; };
  }, []);

  const allBadges = [
    {
      id: 1,
      name: "Python Master",
      description: "Completed Python for Beginners",
      earned: true,
      earnedDate: "15 Oct 2025",
      icon: "🏆",
      color: "#4A9EFF",
    },
    {
      id: 2,
      name: "React Developer",
      description: "Completed Web Development with React",
      earned: true,
      earnedDate: "10 Oct 2025",
      icon: "⚛️",
      color: "#00D4AA",
    },
    {
      id: 3,
      name: "Database Expert",
      description: "Completed SQL & Database Design",
      earned: true,
      earnedDate: "5 Oct 2025",
      icon: "💾",
      color: "#FFC107",
    },
    {
      id: 4,
      name: "Fast Learner",
      description: "Complete 3 courses in a month",
      earned: true,
      earnedDate: "15 Oct 2025",
      icon: "⚡",
      color: "#FF5252",
    },
    {
      id: 5,
      name: "Java Champion",
      description: "Complete Java Programming Masterclass",
      earned: false,
      earnedDate: null,
      icon: "☕",
      color: "#8b92a7",
    },
    {
      id: 6,
      name: "Full Stack Pro",
      description: "Complete 5 web development courses",
      earned: false,
      earnedDate: null,
      icon: "🌐",
      color: "#8b92a7",
    },
    {
      id: 7,
      name: "DSA Master",
      description: "Complete C++ Data Structures & Algorithms",
      earned: false,
      earnedDate: null,
      icon: "🧮",
      color: "#8b92a7",
    },
    {
      id: 8,
      name: "Perfectionist",
      description: "Score 100% in any course",
      earned: false,
      earnedDate: null,
      icon: "💯",
      color: "#8b92a7",
    },
  ];

  const handleDownload = (certificate) => {
    alert(`Downloading certificate: ${certificate.certificateId}`);
  };

  const handleShare = (certificate) => {
    alert(`Sharing certificate for ${certificate.courseName}`);
  };

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
  };

  const handleCloseCertificate = () => {
    setSelectedCertificate(null);
  };

  return (
    <div className="certificates-container">
      {/* Header */}
      <div className="certificates-header">
        <div>
          <h2 className="certificates-title">My Achievements</h2>
          <p className="certificates-subtitle">
            Certificates and badges earned from completed courses
          </p>
        </div>
        <div className="achievement-stats">
          <div className="stat-box">
            <Trophy size={24} color="#FFD700" />
            <div>
              <div className="stat-value">{loading ? '...' : completedCourses.length}</div>
              <div className="stat-label">Certificates</div>
            </div>
          </div>
          <div className="stat-box">
            <Star size={24} color="#4A9EFF" />
            <div>
              <div className="stat-value">
                {allBadges.filter((b) => b.earned).length}
              </div>
              <div className="stat-label">Badges</div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="badges-section">
        <h3 className="section-title">
          <Star size={20} />
          Achievement Badges
        </h3>
        <div className="badges-grid">
          {allBadges.map((badge) => (
            <div
              key={badge.id}
              className={`badge-card ${badge.earned ? "earned" : "locked"}`}
            >
              <div
                className="badge-icon"
                style={{
                  background: badge.earned
                    ? `linear-gradient(135deg, ${badge.color}, ${badge.color}dd)`
                    : "#2A2D35",
                }}
              >
                <span className="badge-emoji">{badge.icon}</span>
              </div>
              <div className="badge-info">
                <h4 className="badge-name">{badge.name}</h4>
                <p className="badge-description">{badge.description}</p>
                {badge.earned && (
                  <div className="badge-earned">
                    <CheckCircle size={14} />
                    <span>Earned on {badge.earnedDate}</span>
                  </div>
                )}
                {!badge.earned && (
                  <div className="badge-locked">
                    <span>🔒 Locked</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificates Section */}
      <div className="certificates-section">
        <h3 className="section-title">
          <Award size={20} />
          Course Certificates
        </h3>
        <div className="certificates-grid">
          {loading && <div className="loading">Loading certificates…</div>}
          {error && <div className="error">Failed to load: {error}</div>}
          {!loading && completedCourses.map((certificate) => (
            <div key={certificate.id} className="certificate-card">
              <div className="certificate-header-section">
                <div className="cert-thumbnail">
                  <span className="cert-emoji">{certificate.thumbnail}</span>
                </div>
                <div className="cert-badge-icon">
                  <span>{certificate.badge.icon}</span>
                </div>
              </div>

              <div className="certificate-content">
                <h4 className="cert-course-name">{certificate.courseName}</h4>
                <p className="cert-language">{certificate.language}</p>

                <div className="cert-details">
                  <div className="cert-detail-item">
                    <Code size={14} />
                    <span>{certificate.instructor}</span>
                  </div>
                  <div className="cert-detail-item">
                    <Calendar size={14} />
                    <span>{certificate.completedDate}</span>
                  </div>
                  <div className="cert-detail-item">
                    <Star size={14} fill="#FFC107" color="#FFC107" />
                    <span>Score: {certificate.score}%</span>
                  </div>
                </div>

                <div className="cert-id">
                  Certificate ID: {certificate.certificateId}
                </div>

                <div className="cert-actions">
                  <button
                    className="cert-btn view-btn"
                    onClick={() => handleViewCertificate(certificate)}
                  >
                    <Award size={16} />
                    View Certificate
                  </button>
                  <button
                    className="cert-btn download-btn"
                    onClick={() => handleDownload(certificate)}
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    className="cert-btn share-btn"
                    onClick={() => handleShare(certificate)}
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {completedCourses.length === 0 && (
          <div className="empty-certificates">
            <Award size={64} color="#4b5563" />
            <p>No certificates yet</p>
            <span>Complete courses to earn certificates and badges</span>
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div className="certificate-modal" onClick={handleCloseCertificate}>
          <div
            className="certificate-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal-btn"
              onClick={handleCloseCertificate}
            >
              ✕
            </button>

            <div className="certificate-display">
              <div className="cert-border">
                <div className="cert-inner">
                  <div className="cert-header">
                    <Trophy size={48} color="#FFD700" />
                    <h2 className="cert-title">Certificate of Completion</h2>
                  </div>

                  <div className="cert-body">
                    <p className="cert-text">This is to certify that</p>
                    <h3 className="cert-recipient">Student Name</h3>
                    <p className="cert-text">has successfully completed</p>
                    <h3 className="cert-course">
                      {selectedCertificate.courseName}
                    </h3>

                    <div className="cert-details-row">
                      <div className="cert-detail-box">
                        <span className="detail-label">Completed On</span>
                        <span className="detail-value">
                          {selectedCertificate.completedDate}
                        </span>
                      </div>
                      <div className="cert-detail-box">
                        <span className="detail-label">Score</span>
                        <span className="detail-value">
                          {selectedCertificate.score}%
                        </span>
                      </div>
                      <div className="cert-detail-box">
                        <span className="detail-label">Instructor</span>
                        <span className="detail-value">
                          {selectedCertificate.instructor}
                        </span>
                      </div>
                    </div>

                    <div className="cert-footer-section">
                      <div className="cert-signature">
                        <div className="signature-line"></div>
                        <span>Authorized Signature</span>
                      </div>
                      <div className="cert-badge-display">
                        <span className="badge-display-icon">
                          {selectedCertificate.badge.icon}
                        </span>
                        <span>{selectedCertificate.badge.name}</span>
                      </div>
                    </div>

                    <div className="cert-id-display">
                      {selectedCertificate.certificateId}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="modal-action-btn download"
                onClick={() => handleDownload(selectedCertificate)}
              >
                <Download size={18} />
                Download PDF
              </button>
              <button
                className="modal-action-btn share"
                onClick={() => handleShare(selectedCertificate)}
              >
                <Share2 size={18} />
                Share on LinkedIn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
