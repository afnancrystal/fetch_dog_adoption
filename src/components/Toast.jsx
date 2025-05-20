import React, { useEffect, useRef, useState } from "react";

export default function Toast({ message, onClose }) {
  const [visible, setVisible] = useState(false);
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (message && !hasShownRef.current) {
      setVisible(true);
      hasShownRef.current = true;

      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  const handleManualClose = () => {
    setVisible(false);
    onClose();
  };

  if (!visible || !message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#e8d4bb] text-brown-900 px-6 py-3 rounded-2xl border border-brown-400 shadow-[0_4px_12px_rgba(101,67,33,0.4)] z-50 max-w-sm w-fit">
      <div className="relative inline-block">
        <span>{message}</span>
        <button
          onClick={handleManualClose}
          className="absolute -top-2 -right-4 text-brown-700 hover:text-brown-900 text-lg font-bold leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

