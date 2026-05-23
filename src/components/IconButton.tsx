import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** Click handler */
  onClick?: () => void;
  /** Accessible label for screen readers */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Simple button that renders a Lucide icon.
 * Applies the shared `.btn-icon` styles defined in globals.css.
 */
export const IconButton: React.FC<IconButtonProps> = ({ icon: Icon, onClick, label, className }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`btn-icon ${className ?? ''}`}
  >
    <Icon size={16} />
  </button>
);
