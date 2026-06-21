"use client";

import { useState, useEffect } from "react";
import BorderGlow from "./BorderGlow";
import GridBackground from "./GridBackground";
import { getCertificates, type Certificate } from "../lib/certificatesService";
import {
  FaGlobe,
  FaBuilding,
  FaCalendarAlt,
  FaCertificate,
} from "react-icons/fa";

/* ============================================
   CERTIFICATE CARD
   ============================================ */
function CertificateCard({ certificate }: { certificate: Certificate }) {
  const [imageError, setImageError] = useState(false);

  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor="0 0 100"
      backgroundColor="#0a0a0a"
      borderRadius={16}
      glowRadius={20}
      glowIntensity={0.3}
      coneSpread={25}
      animated={false}
      colors={["#ffffff", "#ffffff", "#ffffff"]}
    >
      <div className="flex flex-col h-full">
        {/* Image Area */}
        {certificate.imageUrl && !imageError && (
          <div className="relative w-full rounded-t-xl overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <img
                src={certificate.imageUrl}
                alt={`${certificate.title} certificate`}
                className="absolute inset-0 w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-4 md:p-6 flex flex-col flex-1">
          {/* Certificate Icon & Title */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center bg-white/[0.03] shrink-0">
              <FaCertificate size={18} className="text-white/50" />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="text-white text-lg md:text-xl font-light mb-1"
                style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
              >
                {certificate.title}
              </h3>
              <p className="text-white/50 text-xs font-mono flex items-center gap-1.5">
                <FaBuilding size={10} />
                {certificate.issuer}
              </p>
            </div>
          </div>

          {/* Description */}
          {certificate.description && (
            <p className="text-white/40 text-xs md:text-sm font-mono leading-relaxed mb-3 md:mb-4 text-justify line-clamp-3">
              {certificate.description}
            </p>
          )}

          {/* Date & Credential Link */}
          <div className="flex items-center justify-between mt-auto pt-3 md:pt-4 border-t border-white/5">
            {certificate.date && (
              <span className="flex items-center gap-1.5 text-white/40 text-[10px] md:text-xs font-mono">
                <FaCalendarAlt size={10} className="md:w-3 md:h-3" />
                {new Date(certificate.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })}
              </span>
            )}
            {certificate.credentialUrl && (
              <a
                href={certificate.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-[10px] md:text-xs font-mono uppercase tracking-wide"
              >
                <FaGlobe size={12} className="md:w-3.5 md:h-3.5" />
                Verify
              </a>
            )}
          </div>
        </div>
      </div>
    </BorderGlow>
  );
}

/* ============================================
   LOADING SKELETON
   ============================================ */
function CertificateCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0a0a0a] overflow-hidden h-full flex flex-col">
      <div className="w-full animate-pulse shrink-0" style={{ paddingBottom: "56.25%", background: "rgba(255,255,255,0.03)" }} />
      <div className="p-4 md:p-6 space-y-3 flex-1 flex flex-col">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white/5 rounded-lg animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-white/5 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-white/5 rounded w-1/2 animate-pulse" />
          </div>
        </div>
        <div className="h-3 bg-white/5 rounded w-full animate-pulse" />
        <div className="h-3 bg-white/5 rounded w-4/5 animate-pulse" />
        <div className="pt-3 mt-auto border-t border-white/5 flex justify-between">
          <div className="h-3 bg-white/5 rounded w-20 animate-pulse" />
          <div className="h-3 bg-white/5 rounded w-16 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/* ============================================
   MAIN COMPONENT - Certifications Section
   ============================================ */
export default function Certifications() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch certificates from API
  useEffect(() => {
    async function fetchCertificates() {
      try {
        const data = await getCertificates();
        setCertificates(data);
      } catch (err) {
        console.error("Failed to fetch certificates:", err);
        setError("Failed to load certificates. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchCertificates();
  }, []);

  // Don't render if no certificates and not loading
  if (!loading && certificates.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full bg-[#000000] py-12 md:py-16 lg:py-24 overflow-hidden">
      {/* Grid Background */}
      <GridBackground />

      {/* Section Header */}
      <div className="relative z-10 text-center mb-8 md:mb-12 lg:mb-16 px-4 md:px-8 lg:px-20">
        <h2
          className="text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight mb-4 md:mb-6 lg:mb-8"
          style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
        >
          Certifications
        </h2>

        {!loading && certificates.length > 0 && (
          <p className="text-white/30 text-xs md:text-sm font-mono max-w-2xl mx-auto leading-relaxed px-2">
            Professional certifications and credentials that validate my expertise across various technologies and domains.
          </p>
        )}
      </div>

      {/* Certificates Grid */}
      <div className="relative z-10 w-full px-4 md:px-8 lg:px-20">
        {error ? (
          <div className="text-center py-12">
            <p className="text-white/50 font-mono text-sm">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {loading
              ? Array.from({ length: 3 }, (_, i) => (
                  <CertificateCardSkeleton key={`skeleton-${i}`} />
                ))
              : certificates.map((certificate) => (
                  <CertificateCard key={certificate.id} certificate={certificate} />
                ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative z-10 mt-8 md:mt-12 lg:mt-16 w-px h-12 md:h-16 bg-gradient-to-b from-white/10 to-transparent mx-auto" />
    </section>
  );
}
