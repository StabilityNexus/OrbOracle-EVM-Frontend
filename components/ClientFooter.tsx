"use client";

import { useState, useEffect } from "react";
import Footer from "./Footer";
import TermsOfUseModal, { getTodayUtcKey } from "./TermsOfUseModal";
import ShareModal from "./ShareModal";

export default function ClientFooter() {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    // Check if user has accepted Terms of Use for today (00:00 UTC cycle)
    const todayKey = getTodayUtcKey();
    const acceptedToday = localStorage.getItem(todayKey);
    if (!acceptedToday) {
      setIsTermsModalOpen(true);
    }
  }, []);

  const handleTermsClick = () => {
    setIsTermsModalOpen(true);
  };

  const handleTermsClose = () => {
    setIsTermsModalOpen(false);
  };

  const handleTermsAccept = () => {
    setIsTermsModalOpen(false);
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleShareClose = () => {
    setIsShareModalOpen(false);
  };

  return (
    <>
      <Footer onTermsClick={handleTermsClick} onShareClick={handleShareClick} />
      <TermsOfUseModal
        isOpen={isTermsModalOpen}
        onClose={handleTermsClose}
        onAccept={handleTermsAccept}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleShareClose}
      />
    </>
  );
}

