import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Session management constants
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const WARNING_TIMEOUT = 5 * 60 * 1000; // 5 minutes before timeout
const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'touchmove',
  'click',
  'focus'
];

interface SessionTimeoutWarningProps {
  onContinue: () => void;
  timeLeft: number;
}

const SessionTimeoutWarning = ({ onContinue, timeLeft }: SessionTimeoutWarningProps) => {
  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4 text-center">Session Timeout Warning</h3>
        <p className="mb-4 text-center">
          Your session is about to expire due to inactivity. You will be logged out in:
        </p>
        <div className="text-3xl font-bold text-center mb-6 text-primary">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
        <p className="mb-6 text-center">
          Click "Continue Session" to stay logged in.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onContinue}
            className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
          >
            Continue Session
          </button>
          <button
            onClick={() => window.location.href = '/login'}
            className="flex-1 bg-muted text-muted-foreground py-2 px-4 rounded-md hover:bg-muted/80 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

const SessionManager = () => {
  const { user, signOut } = useAuth();
  const [timeLeft, setTimeLeft] = useState<number>(WARNING_TIMEOUT);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Reset the timeout when there's activity
  const resetTimeout = () => {
    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      // Start warning countdown
      startWarningCountdown();
    }, SESSION_TIMEOUT - WARNING_TIMEOUT);

    setTimer(newTimer);
  };

  // Start the warning countdown
  const startWarningCountdown = () => {
    setShowWarning(true);
    const warningTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          // Time's up - log out
          clearInterval(warningTimer as NodeJS.Timeout);
          signOut();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  };

  // Continue session after warning
  const continueSession = () => {
    setShowWarning(false);
    setTimeLeft(WARNING_TIMEOUT);
    resetTimeout();
  };

  // Track user activity
  useEffect(() => {
    if (!user) return; // Only track when user is logged in

    // Initialize the timeout
    resetTimeout();

    // Add event listeners for user activity
    const handleActivity = () => resetTimeout();
    
    ACTIVITY_EVENTS.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      ACTIVITY_EVENTS.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [user, timer]);

  // Cleanup warning timer on unmount
  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  if (!user || !showWarning) {
    return null;
  }

  return (
    <SessionTimeoutWarning 
      onContinue={continueSession} 
      timeLeft={timeLeft} 
    />
  );
};

export default SessionManager;