"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-sm transition-opacity duration-300 lg:hidden">
      {/* Backdrop Tap to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Sheet Modal Container (White Glass Elevated) */}
      <div className="safe-bottom max-h-[85vh] w-full overflow-hidden rounded-t-3xl border-t border-white/[0.18] bg-white/[0.08] p-4 shadow-2xl backdrop-blur-2xl animate-slide-up">
        {/* Drag Pill Handle */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/20" />

        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          {title ? (
            <h3 className="text-sm font-bold text-white">{title}</h3>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg p-1.5 text-[#94A3B8] hover:bg-white/[0.10] hover:text-white transition active:scale-95"
            aria-label="Close bottom sheet"
          >
            <X className="h-4 w-4 shrink-0" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[calc(85vh-90px)] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
