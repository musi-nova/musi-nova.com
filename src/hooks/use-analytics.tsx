import { apiFetch } from '@/lib/api';
import { useCallback } from 'react';

type AnyObj = Record<string, any>;

interface AnalyticsEventData extends AnyObj {
  event_type: string;
  path?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  properties?: AnyObj; // explicit properties object if caller provides it
}

interface UseAnalyticsReturn {
  logEvent: (eventData: AnalyticsEventData) => Promise<void>;
  trackPageView: (path?: string, additionalData?: AnyObj) => Promise<void>;
  trackClick: (element?: string, additionalData?: AnyObj) => Promise<void>;
  trackFormSubmit: (formName?: string, additionalData?: AnyObj) => Promise<void>;
  trackError: (error: Error | string, context?: AnyObj) => Promise<void>;
}

export function useAnalytics(): UseAnalyticsReturn {
  // Note: session id is intentionally not managed here — backend handles sessions

  const isDev = typeof window !== 'undefined' && import.meta.env.VITE_DEV === 'true';

  const getUserId = useCallback(() => {
    try {
      const userStr = localStorage.getItem('musinova_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id || user.email || 'anonymous';
      }
    } catch (error) {
      console.error('Error getting user ID:', error);
    }
    return 'anonymous';
  }, []);

  const logEvent = useCallback(async (eventData: AnalyticsEventData) => {
    try {
      // derive common values
      const urlSearch = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
      const path = eventData.path || (typeof window !== 'undefined' ? window.location.pathname : undefined);
      const utm_source = eventData.utm_source || urlSearch.get('utm_source') || undefined;
      const utm_medium = eventData.utm_medium || urlSearch.get('utm_medium') || undefined;
      const utm_campaign = eventData.utm_campaign || urlSearch.get('utm_campaign') || undefined;
      const referrer = eventData.referrer || (typeof document !== 'undefined' ? document.referrer : undefined);

      // Build properties: start with any explicit properties, then add any non-reserved keys
      const reserved = new Set(['event_type', 'path', 'utm_source', 'utm_medium', 'utm_campaign', 'referrer', 'properties']);
      const properties: AnyObj = {
        ...(eventData.properties || {}),
      };

      // Move any other keys into properties (backwards compatibility: event_name, element, etc.)
      Object.keys(eventData).forEach((k) => {
        if (!reserved.has(k)) {
          properties[k] = eventData[k];
        }
      });

      // Always include user/timestamp in properties for debugging / attribution
      properties.user_id = properties.user_id || getUserId();
      properties.timestamp = properties.timestamp || new Date().toISOString();

      const payload: AnyObj = {
        event_type: eventData.event_type,
        path,
        utm_source,
        utm_medium,
        utm_campaign,
        referrer,
        properties,
      };

      // Don't post analytics during local development (npm run dev)
      if (isDev) {
        // Log to console so developers can see the event without sending it
        // eslint-disable-next-line no-console
        console.log('Analytics (dev mode) - skipped POST to /analytics/log-event:', payload);
        return;
      }

      await apiFetch('analytics/log-event', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (error) {
      // Silently fail analytics to not disrupt user experience
      console.warn('Analytics event failed:', error);
    }
  }, [getUserId]);

  const trackPageView = useCallback(async (path?: string, additionalData?: AnyObj) => {
    await logEvent({
      event_type: 'page_view',
      path: path || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      properties: additionalData || {},
    });
  }, [logEvent]);

  const trackClick = useCallback(async (element?: string, additionalData?: AnyObj) => {
    await logEvent({
      event_type: 'cta_click',
      path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      properties: {
        element,
        ...(additionalData || {}),
      },
    });
  }, [logEvent]);

  const trackFormSubmit = useCallback(async (formName?: string, additionalData?: AnyObj) => {
    await logEvent({
      event_type: 'form_submit',
      path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      properties: {
        form_name: formName,
        ...(additionalData || {}),
      },
    });
  }, [logEvent]);

  const trackError = useCallback(async (error: Error | string, context?: AnyObj) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;
    
    await logEvent({
      event_type: 'error',
      path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      properties: {
        error_message: errorMessage,
        error_stack: errorStack,
        ...(context || {}),
      },
    });
  }, [logEvent]);

  return {
    logEvent,
    trackPageView,
    trackClick,
    trackFormSubmit,
    trackError,
  };
}
