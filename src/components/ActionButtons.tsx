'use client';
import React from 'react';
import { Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconButton } from '@/components/IconButton';

interface ActionButtonsProps {
  onLogout: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onLogout }) => {
  const router = useRouter();

  const handleLogout = async () => {
    // Additional logout logic can be placed here if needed
    onLogout();
    router.push('/login');
  };

  return (
    <div className="flex space-x-6">
      <Link href="/notifications" className="flex items-center gap-2 text-primary hover:underline">
        <Settings size={20} /> Notification Settings
      </Link>
      <button onClick={handleLogout} className="flex items-center gap-2 text-destructive hover:underline">
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};
