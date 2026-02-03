'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export function ModeIndicator() {
  const [modeInfo, setModeInfo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fetch mode info from backend
    const fetchModeInfo = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.nexoraos.pro/api/v1';
        const response = await fetch(`${API_BASE}/system/mode`);
        const data = await response.json();

        if (data.success) {
          setModeInfo(data.data);
          // Only show if not in production or channels are mocked
          setIsVisible(!data.data.isProduction || data.data.channels.areChannelsMocked);
        }
      } catch (error) {
        console.error('Failed to fetch mode info:', error);
      }
    };

    fetchModeInfo();
    // Refresh every 30 seconds
    const interval = setInterval(fetchModeInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible || !modeInfo) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {/* Demo Mode Badge */}
      {modeInfo.demo?.enabled && (
        <div className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-1.5 rounded-md shadow-lg text-sm font-medium">
          <AlertCircle className="h-4 w-4" />
          <span>Demo Mode</span>
          <span className="text-xs opacity-90">({modeInfo.demo.tenantId})</span>
        </div>
      )}

      {/* Environment Badge */}
      {!modeInfo.isProduction && (
        <div
          className={`px-3 py-1.5 rounded-md shadow-lg text-sm font-medium text-white ${
            modeInfo.isDevelopment
              ? 'bg-blue-600'
              : modeInfo.isStaging
                ? 'bg-orange-600'
                : 'bg-gray-600'
          }`}
        >
          {modeInfo.environment.toUpperCase()}
        </div>
      )}

      {/* Channels Mode Badge */}
      {modeInfo.channels?.areChannelsMocked && (
        <div className="bg-purple-600 text-white px-3 py-1.5 rounded-md shadow-lg text-sm font-medium">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Mocked Channels</span>
          </div>
          <div className="text-xs mt-1 opacity-90">
            {modeInfo.channels.mockedChannels.join(', ')}
          </div>
        </div>
      )}

      {/* Channel Details (collapsible) */}
      {modeInfo.channels && (
        <details className="bg-gray-800 text-white px-3 py-2 rounded-md shadow-lg text-xs">
          <summary className="cursor-pointer font-medium">Channel Status</summary>
          <div className="mt-2 space-y-1">
            {modeInfo.channels.whatsapp && (
              <div className="flex justify-between">
                <span>WhatsApp:</span>
                <span
                  className={
                    modeInfo.channels.whatsapp.mocked ? 'text-yellow-400' : 'text-green-400'
                  }
                >
                  {modeInfo.channels.whatsapp.mocked ? 'Mocked' : 'Live'}
                </span>
              </div>
            )}
            {modeInfo.channels.email && (
              <div className="flex justify-between">
                <span>Email:</span>
                <span
                  className={modeInfo.channels.email.mocked ? 'text-yellow-400' : 'text-green-400'}
                >
                  {modeInfo.channels.email.mocked ? 'Mocked' : 'Live'}
                </span>
              </div>
            )}
            {modeInfo.channels.sms && (
              <div className="flex justify-between">
                <span>SMS:</span>
                <span
                  className={modeInfo.channels.sms.mocked ? 'text-yellow-400' : 'text-green-400'}
                >
                  {modeInfo.channels.sms.mocked ? 'Mocked' : 'Live'}
                </span>
              </div>
            )}
            {modeInfo.channels.voice && (
              <div className="flex justify-between">
                <span>Voice:</span>
                <span
                  className={modeInfo.channels.voice.mocked ? 'text-yellow-400' : 'text-green-400'}
                >
                  {modeInfo.channels.voice.mocked ? 'Mocked' : 'Live'}
                </span>
              </div>
            )}
          </div>
        </details>
      )}
    </div>
  );
}
