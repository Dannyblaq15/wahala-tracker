import React from 'react';
import { Copy } from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import { useNotification } from '@/components/NotificationProvider';

interface AccountInfoCardProps {
  uid: string;
  creationTime: string;
  lastSignInTime: string;
}

export const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ uid, creationTime, lastSignInTime }) => {
  const { notify } = useNotification();

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      notify(`${label} copied`, 'success');
    });
  };

  return (
    <article className="glass-card mb-8">
      <h3 className="mb-3 font-medium text-lg">Account Details</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex items-center">
          <dt className="w-32 font-medium">UID:</dt>
          <dd className="flex items-center gap-2">
            <code className="bg-white/10 px-2 py-1 rounded">{uid}</code>
            <IconButton
              icon={Copy}
              onClick={() => copy(uid, 'UID')}
              label="Copy UID"
            />
          </dd>
        </div>
        <div className="flex items-center">
          <dt className="w-32 font-medium">Created:</dt>
          <dd>{new Date(creationTime).toLocaleString()}</dd>
        </div>
        <div className="flex items-center">
          <dt className="w-32 font-medium">Last sign‑in:</dt>
          <dd>{new Date(lastSignInTime).toLocaleString()}</dd>
        </div>
      </dl>
    </article>
  );
};
