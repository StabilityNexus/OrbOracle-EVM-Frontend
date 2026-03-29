"use client";

import { useState } from "react";
import Footer from "./Footer";
import KyaModal from "./KyaModal";
import ShareModal from "./ShareModal";

export default function ClientFooter() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleShareClose = () => {
    setIsShareModalOpen(false);
  };

  return (
    <>
      <Footer onShareClick={handleShareClick} />
      <KyaModal />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleShareClose}
      />
    </>
  );
}

