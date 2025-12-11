import React from 'react';
import { IpfsIcon } from './icons/Icons';
import { useTranslation } from '../context/LanguageContext';

export const IpfsStatus: React.FC = () => {
  const { t } = useTranslation();
  const peerId = "12D3KooWFap89xPuEnwoEAMmq2YSeiRt9wPCmV6MNELqUiVnJEcH";

  return (
    <div className="bg-brand-bg/50 rounded-xl border border-gray-700/50 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <IpfsIcon className="w-8 h-8 text-brand-cyan" />
          <div>
            <h4 className="font-bold text-lg text-white">{t('ipfs.title')}</h4>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="text-green-400 text-sm font-semibold">{t('ipfs.connected')}</p>
            </div>
          </div>
        </div>

        <div className="text-sm text-brand-muted grid grid-cols-2 sm:flex sm:gap-6">
          <div className="text-center sm:text-left">
            <p className="font-bold text-white">1.2 GiB</p>
            <p>{t('ipfs.dataHosted')}</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="font-bold text-white">39</p>
            <p>{t('ipfs.peersFound')}</p>
          </div>
        </div>

        <div className="text-sm">
          <p className="text-brand-muted">Peer ID:</p>
          <p className="text-gray-400 font-mono text-xs break-all">{peerId}</p>
        </div>
      </div>
    </div>
  );
};