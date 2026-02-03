'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useTelecmiStore, useTelecmiConfig } from '@/hooks/use-telecmi';
import { useCreateWebRTCCall, useUpdateWebRTCCall } from '@/hooks/use-dialer';

// TeleCMI WebRTC Context
const TelecmiContext = createContext(null);

// Call status enum
export const CallStatus = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  RINGING: 'ringing',
  CONNECTED: 'connected',
  ON_HOLD: 'on_hold',
  ENDED: 'ended',
};

/**
 * TeleCMI Provider Component
 * Initializes PIOPIY SDK and provides call management methods
 */
export function TelecmiProvider({ children }) {
  const { data: config } = useTelecmiConfig();
  const { agentToken, agentInfo, agentPassword, isLoggedIn } = useTelecmiStore();

  // WebRTC call logging hooks
  const createWebRTCCall = useCreateWebRTCCall();
  const updateWebRTCCall = useUpdateWebRTCCall();

  // SDK state
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState(null);
  const [PiopiyClass, setPiopiyClass] = useState(null);

  // Call state
  const [currentCall, setCurrentCall] = useState(null);
  const [callStatus, setCallStatus] = useState(CallStatus.IDLE);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isHeld, setIsHeld] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);

  // Refs
  const piopiyRef = useRef(null);
  const durationIntervalRef = useRef(null);
  const currentCallIdRef = useRef(null); // Track call ID for logging

  // Load PIOPIY SDK via dynamic import
  useEffect(() => {
    if (sdkLoaded) return;

    const loadSDK = async () => {
      try {
        // Dynamic import of piopiyjs npm package
        const module = await import('piopiyjs');
        const PIOPIY = module.default || module.PIOPIY || module;
        setPiopiyClass(() => PIOPIY);
        setSdkLoaded(true);
        console.log('[TeleCMI] SDK loaded via npm');
      } catch (err) {
        console.error('[TeleCMI] Failed to load SDK:', err);
        // SDK not installed - that's okay, calls will work via API
        setError('PIOPIY SDK not available - install piopiyjs package for WebRTC calls');
        setSdkLoaded(true); // Mark as loaded to prevent retry
      }
    };

    loadSDK();
  }, [sdkLoaded]);

  // Initialize PIOPIY when SDK is loaded and agent is logged in
  useEffect(() => {
    if (!sdkLoaded || !isLoggedIn || !agentPassword || !PiopiyClass) {
      return;
    }

    try {
      // Initialize PIOPIY with agent token
      piopiyRef.current = new PiopiyClass({
        name: agentInfo?.name || 'Agent',
        debug: true,
        autoplay: true,
        ringTime: 60,
      });

      // Login with agent credentials to India SBC
      // Format: login(user_id, password, sbc_uri)
      const sbcUri = 'sbcind.telecmi.com'; // India region
      piopiyRef.current.login(agentInfo?.id, agentPassword, sbcUri);

      // Set up event listeners
      setupEventListeners();
      console.log('[TeleCMI] SDK initialized');
    } catch (err) {
      console.error('[TeleCMI] Failed to initialize SDK:', err);
      setError('Failed to initialize TeleCMI SDK: ' + err.message);
    }

    return () => {
      // Cleanup on unmount
      if (piopiyRef.current) {
        try {
          piopiyRef.current.logout();
        } catch (e) {
          // Ignore logout errors
        }
        piopiyRef.current = null;
      }
      setSdkReady(false);
    };
  }, [sdkLoaded, isLoggedIn, agentToken, agentPassword, PiopiyClass, agentInfo]);

  // Set up PIOPIY event listeners
  const setupEventListeners = useCallback(() => {
    const piopiy = piopiyRef.current;
    if (!piopiy) return;

    // Ready event
    piopiy.on('ready', () => {
      console.log('[TeleCMI] Ready');
      setSdkReady(true);
      setError(null);
    });

    // Login success
    piopiy.on('login', () => {
      console.log('[TeleCMI] Login successful');
      setSdkReady(true);
      setError(null);
    });

    // Login failure
    piopiy.on('loginFailed', (err) => {
      console.error('[TeleCMI] Login failed:', err);
      setError('Login failed: ' + (err.message || err));
      setSdkReady(false);
    });

    // Incoming call (PIOPIY uses 'inComingCall' event)
    piopiy.on('inComingCall', (call) => {
      console.log('[TeleCMI] Incoming call:', call);
      setIncomingCall(call);
      setCallStatus(CallStatus.RINGING);
    });

    // Call connected (PIOPIY uses 'answered' event)
    piopiy.on('answered', (call) => {
      console.log('[TeleCMI] Call answered:', call);
      setCurrentCall(call);
      setIncomingCall(null);
      setCallStatus(CallStatus.CONNECTED);
      startDurationTimer();

      // Update call record in database
      if (currentCallIdRef.current) {
        updateWebRTCCall.mutate({
          callId: currentCallIdRef.current,
          status: 'IN_PROGRESS',
        });
      }
    });

    // Outgoing call ringing
    piopiy.on('ringing', () => {
      console.log('[TeleCMI] Ringing');
      setCallStatus(CallStatus.RINGING);
    });

    // Call ended
    piopiy.on('hangup', (data) => {
      console.log('[TeleCMI] Call ended:', data);
      handleCallEnded('COMPLETED');
    });

    // Call failed
    piopiy.on('failed', (err) => {
      console.error('[TeleCMI] Call failed:', err);
      setError('Call failed: ' + (err.message || err));
      handleCallEnded('FAILED');
    });

    // Error
    piopiy.on('error', (err) => {
      console.error('[TeleCMI] Error:', err);
      setError(err.message || 'Call error');
    });
  }, []);

  // Start duration timer
  const startDurationTimer = useCallback(() => {
    setCallDuration(0);
    durationIntervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  }, []);

  // Stop duration timer
  const stopDurationTimer = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, []);

  // Handle call ended
  const handleCallEnded = useCallback(
    (status = 'COMPLETED') => {
      // Update call record in database with final status and duration
      if (currentCallIdRef.current) {
        updateWebRTCCall.mutate({
          callId: currentCallIdRef.current,
          status,
          duration: callDuration,
          endedAt: new Date().toISOString(),
        });
        currentCallIdRef.current = null;
      }

      setCurrentCall(null);
      setIncomingCall(null);
      setCallStatus(CallStatus.ENDED);
      setIsMuted(false);
      setIsHeld(false);
      stopDurationTimer();

      // Reset to idle after a short delay
      setTimeout(() => {
        setCallStatus(CallStatus.IDLE);
        setCallDuration(0);
      }, 2000);
    },
    [stopDurationTimer, callDuration, updateWebRTCCall]
  );

  // ============ Call Control Methods ============

  /**
   * Format phone number for TeleCMI
   * Ensures number has country code (default: India 91)
   */
  const formatPhoneNumber = (number) => {
    // Remove all non-digit characters except leading +
    let cleaned = number.replace(/[^\d+]/g, '');

    // Remove leading + if present
    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }

    // If 10 digits (Indian mobile), add 91 country code
    if (cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }

    return cleaned;
  };

  /**
   * Make an outbound call
   * PIOPIY SDK call signature: call(phoneNumber, extraParam?)
   * extraParam must be a string if provided
   */
  const makeCall = useCallback(
    async (phoneNumber, contactId = null, extraParam = '') => {
      if (!piopiyRef.current || !sdkReady) {
        throw new Error('TeleCMI SDK not ready. Please login first.');
      }

      try {
        setCallStatus(CallStatus.CONNECTING);
        setError(null);

        // Format phone number with country code
        const formattedNumber = formatPhoneNumber(phoneNumber);
        console.log('[TeleCMI] Making call to:', formattedNumber);

        // Create call record in database
        try {
          const result = await createWebRTCCall.mutateAsync({
            toNumber: formattedNumber,
            contactId,
            direction: 'OUTBOUND',
          });
          currentCallIdRef.current = result.callId;
          console.log('[TeleCMI] Call record created:', result.callId);
        } catch (logErr) {
          console.warn('[TeleCMI] Failed to create call record:', logErr);
          // Continue with call even if logging fails
        }

        // Use PIOPIY SDK to make call
        // extraParam must be a string (or empty string)
        const extra = typeof extraParam === 'string' ? extraParam : '';
        if (extra) {
          piopiyRef.current.call(formattedNumber, extra);
        } else {
          piopiyRef.current.call(formattedNumber);
        }

        return { success: true, callId: currentCallIdRef.current };
      } catch (err) {
        console.error('[TeleCMI] Make call error:', err);
        setCallStatus(CallStatus.IDLE);

        // Mark call as failed if record was created
        if (currentCallIdRef.current) {
          updateWebRTCCall.mutate({
            callId: currentCallIdRef.current,
            status: 'FAILED',
            endedAt: new Date().toISOString(),
          });
          currentCallIdRef.current = null;
        }

        throw err;
      }
    },
    [sdkReady, createWebRTCCall, updateWebRTCCall]
  );

  /**
   * Answer incoming call
   */
  const answerCall = useCallback(async () => {
    if (!piopiyRef.current || !incomingCall) {
      throw new Error('No incoming call to answer');
    }

    try {
      piopiyRef.current.answer();
      return { success: true };
    } catch (err) {
      console.error('[TeleCMI] Answer call error:', err);
      throw err;
    }
  }, [incomingCall]);

  /**
   * Reject incoming call
   */
  const rejectCall = useCallback(async () => {
    if (!piopiyRef.current || !incomingCall) {
      throw new Error('No incoming call to reject');
    }

    try {
      piopiyRef.current.reject();
      setIncomingCall(null);
      setCallStatus(CallStatus.IDLE);
      return { success: true };
    } catch (err) {
      console.error('[TeleCMI] Reject call error:', err);
      throw err;
    }
  }, [incomingCall]);

  /**
   * End current call
   */
  const endCall = useCallback(async () => {
    if (!piopiyRef.current) {
      throw new Error('TeleCMI SDK not ready');
    }

    try {
      piopiyRef.current.terminate(); // PIOPIY uses 'terminate()' not 'hangup()'
      handleCallEnded();
      return { success: true };
    } catch (err) {
      console.error('[TeleCMI] End call error:', err);
      throw err;
    }
  }, [handleCallEnded]);

  /**
   * Mute/unmute call
   */
  const toggleMute = useCallback(async () => {
    if (!piopiyRef.current) {
      throw new Error('TeleCMI SDK not ready');
    }

    try {
      if (isMuted) {
        piopiyRef.current.unMute(); // PIOPIY uses 'unMute()' not 'unmute()'
      } else {
        piopiyRef.current.mute();
      }
      setIsMuted(!isMuted);
      return { success: true };
    } catch (err) {
      console.error('[TeleCMI] Toggle mute error:', err);
      throw err;
    }
  }, [isMuted]);

  /**
   * Hold/resume call
   */
  const toggleHold = useCallback(async () => {
    if (!piopiyRef.current) {
      throw new Error('TeleCMI SDK not ready');
    }

    try {
      if (isHeld) {
        piopiyRef.current.unHold(); // PIOPIY uses 'unHold()' not 'unhold()'
        setCallStatus(CallStatus.CONNECTED);
      } else {
        piopiyRef.current.hold();
        setCallStatus(CallStatus.ON_HOLD);
      }
      setIsHeld(!isHeld);
      return { success: true };
    } catch (err) {
      console.error('[TeleCMI] Toggle hold error:', err);
      throw err;
    }
  }, [isHeld]);

  /**
   * Transfer call
   */
  const transferCall = useCallback(
    async (transferTo) => {
      if (!piopiyRef.current) {
        throw new Error('TeleCMI SDK not ready');
      }

      try {
        piopiyRef.current.transfer(transferTo);
        handleCallEnded();
        return { success: true };
      } catch (err) {
        console.error('[TeleCMI] Transfer call error:', err);
        throw err;
      }
    },
    [handleCallEnded]
  );

  /**
   * Send DTMF tone
   */
  const sendDTMF = useCallback(async (digit) => {
    if (!piopiyRef.current) {
      throw new Error('TeleCMI SDK not ready');
    }

    try {
      piopiyRef.current.sendDtmf(digit); // PIOPIY uses 'sendDtmf()' not 'sendDTMF()'
      return { success: true };
    } catch (err) {
      console.error('[TeleCMI] Send DTMF error:', err);
      throw err;
    }
  }, []);

  // Context value
  const value = {
    // State
    sdkLoaded,
    sdkReady,
    isLoggedIn,
    error,
    currentCall,
    callStatus,
    callDuration,
    isMuted,
    isHeld,
    incomingCall,

    // Methods
    makeCall,
    answerCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleHold,
    transferCall,
    sendDTMF,

    // Helper
    isInCall: callStatus !== CallStatus.IDLE && callStatus !== CallStatus.ENDED,
  };

  return <TelecmiContext.Provider value={value}>{children}</TelecmiContext.Provider>;
}

/**
 * Hook to use TeleCMI context
 */
export function useTelecmi() {
  const context = useContext(TelecmiContext);
  if (!context) {
    throw new Error('useTelecmi must be used within a TelecmiProvider');
  }
  return context;
}

export default TelecmiProvider;
