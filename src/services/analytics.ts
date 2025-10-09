// TerraGuardian Analytics Service
// This service handles tracking user interactions and behaviors
// In a real app, this would connect to a service like Plausible, PostHog, or Google Analytics

interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp: number;
}

class AnalyticsService {
  private isEnabled: boolean = true;
  private userId: string | null = null;
  
  constructor() {
    this.checkEnabled();
  }
  
  private checkEnabled(): void {
    // Check if analytics is enabled (could be environment-based)
    const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
    this.isEnabled = analyticsEnabled !== false; // Default to true if not specified
  }
  
  // Identify a user
  identify(userId: string): void {
    this.userId = userId;
    this.track('user_identified', { userId });
  }
  
  // Track a custom event
  track(eventName: string, properties?: Record<string, any>): void {
    if (!this.isEnabled) return;
    
    const event: AnalyticsEvent = {
      eventName,
      properties: {
        ...properties,
        userId: this.userId,
        userAgent: navigator.userAgent,
        language: navigator.language,
        timestamp: Date.now(),
      },
      userId: this.userId,
      timestamp: Date.now(),
    };
    
    // In a real implementation, send to analytics service
    console.log('Analytics event:', event);
    
    // Simulate sending to analytics endpoint
    this.sendEvent(event);
  }
  
  // Page view tracking
  pageView(path: string, properties?: Record<string, any>): void {
    this.track('page_view', {
      path,
      ...properties,
    });
  }
  
  // Track quest completion
  trackQuestCompletion(questId: string, questType: string, points: number): void {
    this.track('quest_completed', {
      quest_id: questId,
      quest_type: questType,
      points_earned: points,
    });
  }
  
  // Track AI advisor interaction
  trackAIInteraction(type: 'message_sent' | 'advice_received' | 'advice_saved'): void {
    this.track('ai_interaction', {
      interaction_type: type,
    });
  }
  
  // Track plot claiming
  trackPlotClaim(plotId: string, area: number, degradationType: string): void {
    this.track('plot_claimed', {
      plot_id: plotId,
      area_hectares: area,
      degradation_type: degradationType,
    });
  }
  
  // Track impact dashboard view
  trackImpactView(): void {
    this.track('impact_dashboard_viewed');
  }
  
  // Track user registration
  trackUserRegistration(method: 'email' | 'google'): void {
    this.track('user_registered', {
      registration_method: method,
    });
  }
  
  // Track user login
  trackUserLogin(method: 'email' | 'google'): void {
    this.track('user_logged_in', {
      login_method: method,
    });
  }
  
  // Track user logout
  trackUserLogout(): void {
    this.track('user_logged_out');
  }
  
  // Track badge earned
  trackBadgeEarned(badgeType: string): void {
    this.track('badge_earned', {
      badge_type: badgeType,
    });
  }
  
  // Track any error
  trackError(error: Error, context?: string): void {
    this.track('error', {
      error_message: error.message,
      error_stack: error.stack,
      context,
    });
  }
  
  // Internal method to send events (mock implementation)
  private async sendEvent(event: AnalyticsEvent): Promise<void> {
    // In a real implementation, this would send the event to your analytics service
    // For example: await fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {...})
    
    // For demo purposes, we'll just log it to console and potentially store it locally
    try {
      // If needed, you could store events locally and sync them later
      // This is useful for offline support
      const storedEvents = JSON.parse(localStorage.getItem('analyticsQueue') || '[]');
      storedEvents.push(event);
      
      // Limit the queue size to prevent storage bloat
      if (storedEvents.length > 100) {
        storedEvents.shift(); // Remove oldest event
      }
      
      localStorage.setItem('analyticsQueue', JSON.stringify(storedEvents));
      
      // In a real app, you would periodically sync these events when online
    } catch (error) {
      console.error('Error storing analytics event:', error);
    }
  }
  
  // Sync any pending events when online
  syncEvents(): void {
    if (!navigator.onLine || !this.isEnabled) return;
    
    try {
      const storedEvents = JSON.parse(localStorage.getItem('analyticsQueue') || '[]');
      
      if (storedEvents.length > 0) {
        // In a real app, send all events to analytics service
        console.log('Syncing', storedEvents.length, 'analytics events');
        
        // Clear the queue after syncing
        localStorage.removeItem('analyticsQueue');
      }
    } catch (error) {
      console.error('Error syncing analytics events:', error);
    }
  }
  
  // Initialize analytics for the app
  init(): void {
    // Listen for online/offline events to sync events
    window.addEventListener('online', () => {
      this.syncEvents();
    });
    
    // Track initial page view
    this.pageView(window.location.pathname);
  }
  
  // Enable/disable analytics
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
  
  // Check if analytics is enabled
  getEnabled(): boolean {
    return this.isEnabled;
  }
}

// Create a singleton instance
export const analytics = new AnalyticsService();

// Initialize analytics when the service is imported
analytics.init();

// Export types for use in components
export type { AnalyticsEvent };