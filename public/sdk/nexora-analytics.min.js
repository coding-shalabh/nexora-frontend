/**
 * Nexora Analytics SDK
 * Lightweight website analytics tracking for Nexora CRM
 *
 * @version 1.0.0
 * @license MIT
 */
(function (window, document) {
  'use strict';

  // ============ Configuration ============
  const SDK_VERSION = '1.0.0';
  const DEFAULT_CONFIG = {
    apiEndpoint: '/api/v1/tracking/collect',
    trackPageViews: true,
    trackClicks: false,
    trackForms: true,
    trackScroll: false,
    sessionTimeout: 30, // minutes
    batchSize: 10,
    batchInterval: 5000, // ms
    respectDNT: true,
    cookieDomain: '',
    cookieExpiry: 365, // days
    debug: false,
  };

  // ============ Utilities ============

  /**
   * Generate a unique ID
   */
  function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Get or set a cookie
   */
  function cookie(name, value, days, domain) {
    if (value === undefined) {
      // Get cookie
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    }
    // Set cookie
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    const domainStr = domain ? '; domain=' + domain : '';
    document.cookie = name + '=' + value + expires + domainStr + '; path=/; SameSite=Lax';
  }

  /**
   * Parse URL parameters
   */
  function parseQueryParams() {
    const params = {};
    const search = window.location.search.substring(1);
    if (search) {
      search.split('&').forEach(function (pair) {
        const parts = pair.split('=');
        params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || '');
      });
    }
    return params;
  }

  /**
   * Get UTM parameters
   */
  function getUtmParams() {
    const params = parseQueryParams();
    return {
      utmSource: params.utm_source || null,
      utmMedium: params.utm_medium || null,
      utmCampaign: params.utm_campaign || null,
      utmTerm: params.utm_term || null,
      utmContent: params.utm_content || null,
    };
  }

  /**
   * Get device information
   */
  function getDeviceInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let browserVersion = '';
    let os = 'Unknown';
    let osVersion = '';
    let deviceType = 'desktop';

    // Browser detection
    if (ua.indexOf('Firefox') > -1) {
      browser = 'Firefox';
      browserVersion = ua.match(/Firefox\/(\d+)/)?.[1] || '';
    } else if (ua.indexOf('Edg') > -1) {
      browser = 'Edge';
      browserVersion = ua.match(/Edg\/(\d+)/)?.[1] || '';
    } else if (ua.indexOf('Chrome') > -1) {
      browser = 'Chrome';
      browserVersion = ua.match(/Chrome\/(\d+)/)?.[1] || '';
    } else if (ua.indexOf('Safari') > -1) {
      browser = 'Safari';
      browserVersion = ua.match(/Version\/(\d+)/)?.[1] || '';
    } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
      browser = 'IE';
    }

    // OS detection
    if (ua.indexOf('Windows') > -1) {
      os = 'Windows';
      osVersion = ua.match(/Windows NT (\d+\.\d+)/)?.[1] || '';
    } else if (ua.indexOf('Mac OS') > -1) {
      os = 'macOS';
      osVersion = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace('_', '.') || '';
    } else if (ua.indexOf('Linux') > -1) {
      os = 'Linux';
    } else if (ua.indexOf('Android') > -1) {
      os = 'Android';
      osVersion = ua.match(/Android (\d+)/)?.[1] || '';
    } else if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) {
      os = 'iOS';
      osVersion = ua.match(/OS (\d+)/)?.[1] || '';
    }

    // Device type detection
    if (/Mobi|Android|iPhone|iPod/i.test(ua)) {
      deviceType = 'mobile';
    } else if (/iPad|Tablet/i.test(ua)) {
      deviceType = 'tablet';
    }

    return {
      userAgent: ua,
      browser: browser,
      browserVersion: browserVersion,
      os: os,
      osVersion: osVersion,
      deviceType: deviceType,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      language: navigator.language || navigator.userLanguage,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  /**
   * Get referrer information
   */
  function getReferrer() {
    const referrer = document.referrer;
    if (!referrer) return null;

    try {
      const url = new URL(referrer);
      // Don't count same-domain referrers
      if (url.hostname === window.location.hostname) {
        return null;
      }
      return referrer;
    } catch (e) {
      return referrer;
    }
  }

  /**
   * Log debug messages
   */
  function log(tracker, ...args) {
    if (tracker.config.debug) {
      console.log('[NexoraAnalytics]', ...args);
    }
  }

  // ============ NexoraAnalytics Class ============

  class NexoraAnalytics {
    constructor() {
      this.initialized = false;
      this.apiKey = null;
      this.config = { ...DEFAULT_CONFIG };
      this.visitorId = null;
      this.sessionId = null;
      this.sessionStartTime = null;
      this.eventQueue = [];
      this.batchTimer = null;
      this.pageEntryTime = null;
      this.currentPath = null;
      this.scrollDepth = 0;
      this.hasConsent = true;
      this.isOptedOut = false;
    }

    /**
     * Initialize the tracker
     */
    init(apiKey, options = {}) {
      if (this.initialized) {
        log(this, 'Already initialized');
        return this;
      }

      if (!apiKey) {
        console.error('[NexoraAnalytics] API key is required');
        return this;
      }

      this.apiKey = apiKey;
      this.config = { ...DEFAULT_CONFIG, ...options };

      // Check Do Not Track
      if (this.config.respectDNT && navigator.doNotTrack === '1') {
        log(this, 'Do Not Track is enabled, tracking disabled');
        this.isOptedOut = true;
        return this;
      }

      // Get or create visitor ID
      this.visitorId = cookie('_nxa_visitor');
      if (!this.visitorId) {
        this.visitorId = generateId();
        cookie('_nxa_visitor', this.visitorId, this.config.cookieExpiry, this.config.cookieDomain);
      }

      // Check for existing session
      this.sessionId = cookie('_nxa_session');
      const lastActivity = parseInt(cookie('_nxa_last_activity') || '0', 10);
      const now = Date.now();
      const sessionExpired = now - lastActivity > this.config.sessionTimeout * 60 * 1000;

      if (!this.sessionId || sessionExpired) {
        // Start new session
        this.startSession();
      } else {
        // Continue existing session
        this.sessionStartTime = parseInt(cookie('_nxa_session_start') || now, 10);
        this.updateLastActivity();
      }

      // Setup event listeners
      this.setupEventListeners();

      // Start batch timer
      this.startBatchTimer();

      // Track initial page view if enabled
      if (this.config.trackPageViews) {
        this.trackPageView();
      }

      this.initialized = true;
      log(this, 'Initialized', { visitorId: this.visitorId, sessionId: this.sessionId });

      return this;
    }

    /**
     * Start a new session
     */
    startSession() {
      this.sessionId = generateId();
      this.sessionStartTime = Date.now();

      cookie('_nxa_session', this.sessionId, null, this.config.cookieDomain); // Session cookie
      cookie(
        '_nxa_session_start',
        this.sessionStartTime.toString(),
        null,
        this.config.cookieDomain
      );
      this.updateLastActivity();

      // Send session start event
      const data = {
        visitorId: this.visitorId,
        timestamp: this.sessionStartTime,
        device: getDeviceInfo(),
        utm: getUtmParams(),
        referrer: getReferrer(),
        entryPage: window.location.pathname,
      };

      this.send('session.start', data);
      log(this, 'Session started', this.sessionId);
    }

    /**
     * Update last activity timestamp
     */
    updateLastActivity() {
      cookie('_nxa_last_activity', Date.now().toString(), null, this.config.cookieDomain);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
      const self = this;

      // Page visibility change (user leaving/returning)
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
          self.trackPageLeave();
        } else {
          self.updateLastActivity();
        }
      });

      // Before unload - send any pending events
      window.addEventListener('beforeunload', function () {
        self.trackPageLeave();
        self.flush(true);
      });

      // SPA navigation detection
      if (window.history && window.history.pushState) {
        const originalPushState = window.history.pushState;
        window.history.pushState = function () {
          originalPushState.apply(this, arguments);
          self.onRouteChange();
        };

        window.addEventListener('popstate', function () {
          self.onRouteChange();
        });
      }

      // Track scroll depth
      if (this.config.trackScroll) {
        let scrollTimeout;
        window.addEventListener('scroll', function () {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(function () {
            self.updateScrollDepth();
          }, 100);
        });
      }

      // Track form submissions
      if (this.config.trackForms) {
        document.addEventListener('submit', function (e) {
          if (e.target.tagName === 'FORM') {
            self.trackFormSubmit(e.target);
          }
        });
      }

      // Track clicks
      if (this.config.trackClicks) {
        document.addEventListener('click', function (e) {
          self.trackClick(e);
        });
      }
    }

    /**
     * Handle route change (for SPAs)
     */
    onRouteChange() {
      if (this.currentPath !== window.location.pathname) {
        this.trackPageLeave();
        if (this.config.trackPageViews) {
          this.trackPageView();
        }
      }
    }

    /**
     * Track a page view
     */
    trackPageView(path, properties = {}) {
      if (this.isOptedOut || !this.hasConsent) return this;

      const url = path || window.location.href;
      const urlPath = path || window.location.pathname;

      this.pageEntryTime = Date.now();
      this.currentPath = urlPath;
      this.scrollDepth = 0;
      this.updateLastActivity();

      const data = {
        sessionId: this.sessionId,
        visitorId: this.visitorId,
        url: url,
        path: urlPath,
        title: properties.title || document.title,
        referrer: document.referrer,
        timestamp: this.pageEntryTime,
        ...properties,
      };

      this.send('page.view', data);
      log(this, 'Page view', urlPath);

      return this;
    }

    /**
     * Alias for trackPageView (matches common analytics API)
     */
    page(path, properties = {}) {
      return this.trackPageView(path, properties);
    }

    /**
     * Track page leave
     */
    trackPageLeave() {
      if (this.isOptedOut || !this.hasConsent || !this.pageEntryTime) return;

      const now = Date.now();
      const timeOnPage = Math.round((now - this.pageEntryTime) / 1000);

      this.updateScrollDepth();

      const data = {
        sessionId: this.sessionId,
        visitorId: this.visitorId,
        path: this.currentPath,
        timeOnPage: timeOnPage,
        scrollDepth: this.scrollDepth,
        timestamp: now,
      };

      this.send('page.leave', data, true); // Use beacon
      log(this, 'Page leave', {
        path: this.currentPath,
        timeOnPage,
        scrollDepth: this.scrollDepth,
      });
    }

    /**
     * Update scroll depth
     */
    updateScrollDepth() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      const windowHeight = window.innerHeight;
      const scrollPercent = Math.round(((scrollTop + windowHeight) / docHeight) * 100);

      if (scrollPercent > this.scrollDepth) {
        this.scrollDepth = Math.min(scrollPercent, 100);
      }
    }

    /**
     * Track a custom event
     */
    track(eventName, properties = {}) {
      if (this.isOptedOut || !this.hasConsent) return this;
      if (!eventName) {
        console.error('[NexoraAnalytics] Event name is required');
        return this;
      }

      this.updateLastActivity();

      const data = {
        sessionId: this.sessionId,
        visitorId: this.visitorId,
        eventName: eventName,
        properties: properties,
        timestamp: Date.now(),
        path: window.location.pathname,
      };

      this.queueEvent(data);
      log(this, 'Event tracked', eventName, properties);

      return this;
    }

    /**
     * Track a click event
     */
    trackClick(event) {
      const target = event.target.closest('a, button, [data-track]');
      if (!target) return;

      const data = {
        element: target.tagName.toLowerCase(),
        text: target.innerText?.substring(0, 100),
        href: target.href || null,
        id: target.id || null,
        className: target.className || null,
        dataTrack: target.dataset.track || null,
      };

      this.track('click', data);
    }

    /**
     * Track a form submission
     */
    trackFormSubmit(form, options = {}) {
      if (this.isOptedOut || !this.hasConsent) return this;

      const formId = form.id || form.name || form.action || 'unknown';
      const fields = {};

      // Collect form data (excluding sensitive fields)
      const sensitiveFields = ['password', 'creditcard', 'cc', 'cvv', 'ssn', 'token'];

      Array.from(form.elements).forEach(function (element) {
        if (!element.name) return;

        const fieldName = element.name.toLowerCase();
        const isSensitive = sensitiveFields.some(function (s) {
          return fieldName.includes(s);
        });

        if (!isSensitive && element.type !== 'password') {
          if (element.type === 'checkbox') {
            fields[element.name] = element.checked;
          } else if (element.type === 'radio') {
            if (element.checked) {
              fields[element.name] = element.value;
            }
          } else {
            // Truncate long values and mask emails partially
            let value = element.value?.substring(0, 200) || '';
            if (element.type === 'email' && value.includes('@')) {
              const parts = value.split('@');
              value = parts[0].substring(0, 2) + '***@' + parts[1];
            }
            fields[element.name] = value;
          }
        }
      });

      const data = {
        sessionId: this.sessionId,
        visitorId: this.visitorId,
        formId: formId,
        formName: options.name || form.name || formId,
        formAction: form.action,
        fields: fields,
        timestamp: Date.now(),
        path: window.location.pathname,
      };

      this.send('form.submit', data);
      log(this, 'Form submitted', formId);

      return this;
    }

    /**
     * Identify a visitor
     */
    identify(traits = {}) {
      if (this.isOptedOut) return this;

      if (!traits.email && !traits.userId) {
        console.error('[NexoraAnalytics] Email or userId is required for identification');
        return this;
      }

      this.updateLastActivity();

      const data = {
        sessionId: this.sessionId,
        visitorId: this.visitorId,
        traits: {
          email: traits.email,
          userId: traits.userId,
          name: traits.name,
          firstName: traits.firstName,
          lastName: traits.lastName,
          phone: traits.phone,
          company: traits.company,
          ...traits,
        },
        timestamp: Date.now(),
      };

      this.send('user.identify', data);
      log(this, 'User identified', traits.email || traits.userId);

      return this;
    }

    /**
     * Set consent status
     */
    setConsent(consent) {
      this.hasConsent = !!consent;
      log(this, 'Consent set to', this.hasConsent);

      if (this.hasConsent && !this.initialized) {
        // Re-initialize if consent is granted
        this.init(this.apiKey, this.config);
      }

      return this;
    }

    /**
     * Opt out of tracking
     */
    optOut() {
      this.isOptedOut = true;
      cookie('_nxa_opt_out', '1', this.config.cookieExpiry, this.config.cookieDomain);
      log(this, 'Opted out of tracking');
      return this;
    }

    /**
     * Opt back in to tracking
     */
    optIn() {
      this.isOptedOut = false;
      cookie('_nxa_opt_out', '', -1, this.config.cookieDomain); // Delete cookie
      log(this, 'Opted back in to tracking');
      return this;
    }

    /**
     * Queue an event for batching
     */
    queueEvent(event) {
      this.eventQueue.push(event);

      if (this.eventQueue.length >= this.config.batchSize) {
        this.flushEventQueue();
      }
    }

    /**
     * Flush event queue
     */
    flushEventQueue() {
      if (this.eventQueue.length === 0) return;

      const events = this.eventQueue.splice(0, this.config.batchSize);

      this.send('events.batch', {
        sessionId: this.sessionId,
        visitorId: this.visitorId,
        events: events,
      });
    }

    /**
     * Start batch timer
     */
    startBatchTimer() {
      const self = this;
      this.batchTimer = setInterval(function () {
        self.flushEventQueue();
      }, this.config.batchInterval);
    }

    /**
     * Flush all pending data
     */
    flush(useBeacon = false) {
      this.flushEventQueue();
    }

    /**
     * Send data to the server
     */
    send(type, data, useBeacon = false) {
      if (this.isOptedOut || !this.hasConsent) return;

      const payload = JSON.stringify({
        apiKey: this.apiKey,
        type: type,
        data: data,
      });

      const endpoint = this.config.apiEndpoint;

      // Use Beacon API for page unload events
      if (useBeacon && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(endpoint, blob);
        return;
      }

      // Use fetch API
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
        keepalive: true,
      }).catch(
        function (error) {
          if (this.config && this.config.debug) {
            console.error('[NexoraAnalytics] Send failed', error);
          }
        }.bind(this)
      );
    }

    /**
     * Get current visitor ID
     */
    getVisitorId() {
      return this.visitorId;
    }

    /**
     * Get current session ID
     */
    getSessionId() {
      return this.sessionId;
    }

    /**
     * Reset visitor (for testing)
     */
    reset() {
      cookie('_nxa_visitor', '', -1, this.config.cookieDomain);
      cookie('_nxa_session', '', -1, this.config.cookieDomain);
      cookie('_nxa_session_start', '', -1, this.config.cookieDomain);
      cookie('_nxa_last_activity', '', -1, this.config.cookieDomain);
      this.visitorId = null;
      this.sessionId = null;
      this.initialized = false;
      log(this, 'Reset complete');
      return this;
    }
  }

  // ============ Export ============

  // Create singleton instance
  const tracker = new NexoraAnalytics();

  // Process any queued calls
  const existingQueue = window.NexoraAnalytics?.q || [];

  // Create the global API
  window.NexoraAnalytics = function () {
    const args = Array.prototype.slice.call(arguments);
    const method = args.shift();

    if (method === 'init') {
      return tracker.init.apply(tracker, args);
    }

    if (typeof tracker[method] === 'function') {
      return tracker[method].apply(tracker, args);
    }

    console.error('[NexoraAnalytics] Unknown method:', method);
  };

  // Expose direct methods
  window.NexoraAnalytics.init = function (apiKey, options) {
    return tracker.init(apiKey, options);
  };
  window.NexoraAnalytics.page = function (path, props) {
    return tracker.page(path, props);
  };
  window.NexoraAnalytics.track = function (event, props) {
    return tracker.track(event, props);
  };
  window.NexoraAnalytics.identify = function (traits) {
    return tracker.identify(traits);
  };
  window.NexoraAnalytics.setConsent = function (consent) {
    return tracker.setConsent(consent);
  };
  window.NexoraAnalytics.optOut = function () {
    return tracker.optOut();
  };
  window.NexoraAnalytics.optIn = function () {
    return tracker.optIn();
  };
  window.NexoraAnalytics.reset = function () {
    return tracker.reset();
  };
  window.NexoraAnalytics.getVisitorId = function () {
    return tracker.getVisitorId();
  };
  window.NexoraAnalytics.getSessionId = function () {
    return tracker.getSessionId();
  };
  window.NexoraAnalytics.VERSION = SDK_VERSION;

  // Process queued calls
  existingQueue.forEach(function (args) {
    window.NexoraAnalytics.apply(null, args);
  });
})(window, document);
