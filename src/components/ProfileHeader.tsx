import React, { useState } from 'react';
import { User, Edit2, ClipboardCopy } from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import { useNotification } from '@/components/NotificationProvider';

interface ProfileHeaderProps {
  displayName: string;
  email: string;
  onEdit: (newName: string) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ displayName, email, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(displayName);
  const { notify } = useNotification();

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    notify('Email copied', 'success');
  };

  const save = () => {
    onEdit(name);
    setEditing(false);
    notify('Name updated', 'success');
  };

  return (
    <header className="flex items-center space-x-4 mb-8">
      <User size={32} className="text-primary" />
      <h2 className="gradient-text text-3xl font-bold">My Profile</h2>
      <div className="flex-1" />
      {editing ? (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="rounded border bg-white/10 p-2 text-foreground focus:outline-none"
          />
          <button onClick={save} className="btn-primary px-4 py-1 rounded">
            Save
          </button>
          <button onClick={() => setEditing(false)} className="btn-outline px-4 py-1 rounded">
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <p className="text-lg font-medium">{displayName || '—'}</p>
          <p className="opacity-70">{email}</p>
          <IconButton
            icon={ClipboardCopy}
            onClick={handleCopy}
            label="Copy email"
          />
          <IconButton
            icon={Edit2}
            onClick={() => setEditing(true)}
            label="Edit name"
          />
        </div>
      )}
    </header>
  );
};
