'use client';

import { useEffect } from 'react';

interface PlausibleAnalyticsProps {
  domain?: string;
  trackOutboundLinks?: boolean;
  trackLocalhost?: boolean;
  customDomain?: string;
  apiHost?: string;
}

export default function PlausibleAnalytics({
  domain = 'abdushakur.me',
  trackOutboundLinks = true,
  trackLocalhost = false,
  customDomain,
  apiHost = 'https://plausible.io'
}: PlausibleAnalyticsProps) {
  useEffect(() => {
    // Skip on localhost unless explicitly enabled
    if (!trackLocalhost && typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      return;
    }

    // Load Plausible script
    const script = document.createElement('script');
    script.defer = true;
    script.setAttribute('data-domain', domain);
    
    if (trackOutboundLinks) {
      script.setAttribute('data-track-outbound-links', '');
    }
    
    // Set custom domain if provided
    if (customDomain) {
      script.setAttribute('data-api', `${customDomain}/api/event`);
      script.src = `${customDomain}/js/script.js`;
    } else {
      script.src = `${apiHost}/js/script.js`;
    }
    
    // Add the script to the document
    document.head.appendChild(script);
    
    return () => {
      // Clean up
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [domain, trackOutboundLinks, trackLocalhost, customDomain, apiHost]);

  return null;
}
