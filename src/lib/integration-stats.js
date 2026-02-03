/**
 * Integration Stats System
 * Fetches and aggregates stats from multiple messaging providers
 */

import { api } from '@/lib/api';

/**
 * Provider-specific stats fetchers
 * Each provider has its own method to fetch balance and stats
 */
const providerFetchers = {
  msg91: async (integration) => {
    try {
      const [balanceRes, statsRes] = await Promise.all([
        api.get(`/integrations/messaging/${integration.provider}/balance`),
        api.get(`/integrations/messaging/${integration.provider}/stats`),
      ]);

      return {
        provider: 'MSG91',
        numbers: 1, // MSG91 provides numbers via their API
        messages: statsRes.data?.sent || 0,
        balance: balanceRes.data?.balance || 0,
        deliveryRate: statsRes.data?.deliveryRate || 0,
        currency: balanceRes.data?.currency || 'INR',
      };
    } catch (err) {
      console.error('Failed to fetch MSG91 stats:', err);
      return {
        provider: 'MSG91',
        numbers: 0,
        messages: 0,
        balance: 0,
        deliveryRate: 0,
        currency: 'INR',
      };
    }
  },

  twilio: async (integration) => {
    try {
      const [balanceRes, statsRes] = await Promise.all([
        api.get(`/integrations/messaging/${integration.provider}/balance`),
        api.get(`/integrations/messaging/${integration.provider}/stats`),
      ]);

      return {
        provider: 'Twilio',
        numbers: 1, // Twilio provides phone numbers via API
        messages: statsRes.data?.sent || 0,
        balance: balanceRes.data?.balance || 0,
        deliveryRate: statsRes.data?.deliveryRate || 0,
        currency: balanceRes.data?.currency || 'USD',
      };
    } catch (err) {
      console.error('Failed to fetch Twilio stats:', err);
      return {
        provider: 'Twilio',
        numbers: 0,
        messages: 0,
        balance: 0,
        deliveryRate: 0,
        currency: 'USD',
      };
    }
  },

  gupshup: async (integration) => {
    try {
      const [balanceRes, statsRes] = await Promise.all([
        api.get(`/integrations/messaging/${integration.provider}/balance`),
        api.get(`/integrations/messaging/${integration.provider}/stats`),
      ]);

      return {
        provider: 'Gupshup',
        numbers: 1, // WhatsApp numbers
        messages: statsRes.data?.sent || 0,
        balance: balanceRes.data?.balance || 0,
        deliveryRate: statsRes.data?.deliveryRate || 0,
        currency: balanceRes.data?.currency || 'USD',
      };
    } catch (err) {
      console.error('Failed to fetch Gupshup stats:', err);
      return {
        provider: 'Gupshup',
        numbers: 0,
        messages: 0,
        balance: 0,
        deliveryRate: 0,
        currency: 'USD',
      };
    }
  },

  infobip: async (integration) => {
    try {
      const [balanceRes, statsRes] = await Promise.all([
        api.get(`/integrations/messaging/${integration.provider}/balance`),
        api.get(`/integrations/messaging/${integration.provider}/stats`),
      ]);

      return {
        provider: 'Infobip',
        numbers: 1, // Multi-channel numbers
        messages: statsRes.data?.sent || 0,
        balance: balanceRes.data?.balance || 0,
        deliveryRate: statsRes.data?.deliveryRate || 0,
        currency: balanceRes.data?.currency || 'USD',
      };
    } catch (err) {
      console.error('Failed to fetch Infobip stats:', err);
      return {
        provider: 'Infobip',
        numbers: 0,
        messages: 0,
        balance: 0,
        deliveryRate: 0,
        currency: 'USD',
      };
    }
  },

  resend: async (integration) => {
    try {
      const statsRes = await api.get(`/integrations/messaging/${integration.provider}/stats`);

      return {
        provider: 'Resend',
        accounts: 1, // Email accounts
        sent: statsRes.data?.sent || 0,
        delivered: statsRes.data?.delivered || 0,
        bounced: statsRes.data?.bounced || 0,
        opened: statsRes.data?.opened || 0,
        clicked: statsRes.data?.clicked || 0,
      };
    } catch (err) {
      console.error('Failed to fetch Resend stats:', err);
      return {
        provider: 'Resend',
        accounts: 0,
        sent: 0,
        delivered: 0,
        bounced: 0,
        opened: 0,
        clicked: 0,
      };
    }
  },

  fast2sms: async (integration) => {
    try {
      const [balanceRes, statsRes] = await Promise.all([
        api.get(`/integrations/messaging/${integration.provider}/balance`),
        api.get(`/integrations/messaging/${integration.provider}/stats`),
      ]);

      return {
        provider: 'Fast2SMS',
        numbers: 1,
        messages: statsRes.data?.sent || 0,
        balance: balanceRes.data?.balance || 0,
        deliveryRate: statsRes.data?.deliveryRate || 0,
        currency: balanceRes.data?.currency || 'INR',
      };
    } catch (err) {
      console.error('Failed to fetch Fast2SMS stats:', err);
      return {
        provider: 'Fast2SMS',
        numbers: 0,
        messages: 0,
        balance: 0,
        deliveryRate: 0,
        currency: 'INR',
      };
    }
  },

  telecmi: async (integration) => {
    try {
      const [balanceRes, statsRes] = await Promise.all([
        api.get(`/integrations/messaging/${integration.provider}/balance`),
        api.get(`/integrations/messaging/${integration.provider}/stats`),
      ]);

      return {
        provider: 'TeleCMI',
        numbers: 1,
        calls: statsRes.data?.calls || 0,
        answered: statsRes.data?.answered || 0,
        missed: statsRes.data?.missed || 0,
        balance: balanceRes.data?.balance || 0,
        currency: balanceRes.data?.currency || 'INR',
      };
    } catch (err) {
      console.error('Failed to fetch TeleCMI stats:', err);
      return {
        provider: 'TeleCMI',
        numbers: 0,
        calls: 0,
        answered: 0,
        missed: 0,
        balance: 0,
        currency: 'INR',
      };
    }
  },
};

/**
 * Fetch stats from all connected integrations for a channel
 * @param {string} channelType - whatsapp, email, sms, voice
 * @param {Array} integrations - Array of connected integrations
 * @returns {Promise<Object>} Aggregated stats
 */
export async function fetchChannelStats(channelType, integrations) {
  if (!integrations || integrations.length === 0) {
    return {
      numbers: 0,
      messages: 0,
      balance: 0,
      deliveryRate: 0,
      currency: 'USD',
    };
  }

  // Fetch stats from each integration in parallel
  const statPromises = integrations.map(async (integration) => {
    const fetcher = providerFetchers[integration.provider];
    if (fetcher) {
      return await fetcher(integration);
    }
    return null;
  });

  const allStats = await Promise.all(statPromises);
  const validStats = allStats.filter((s) => s !== null);

  // Aggregate stats based on channel type
  if (channelType === 'whatsapp' || channelType === 'sms' || channelType === 'voice') {
    return aggregateMessagingStats(validStats);
  } else if (channelType === 'email') {
    return aggregateEmailStats(validStats);
  }

  return {
    numbers: 0,
    messages: 0,
    balance: 0,
    deliveryRate: 0,
    currency: 'USD',
  };
}

/**
 * Aggregate messaging stats (WhatsApp, SMS, Voice)
 */
function aggregateMessagingStats(stats) {
  const totalNumbers = stats.reduce((sum, s) => sum + (s.numbers || 0), 0);
  const totalMessages = stats.reduce((sum, s) => sum + (s.messages || 0), 0);
  const totalCalls = stats.reduce((sum, s) => sum + (s.calls || 0), 0);

  // Aggregate balance by currency
  const balanceByCurrency = {};
  stats.forEach((s) => {
    if (s.balance !== undefined) {
      const currency = s.currency || 'USD';
      balanceByCurrency[currency] = (balanceByCurrency[currency] || 0) + s.balance;
    }
  });

  // Get primary balance (prefer INR, then USD, then first available)
  let primaryBalance = 0;
  let primaryCurrency = 'USD';
  if (balanceByCurrency['INR']) {
    primaryBalance = balanceByCurrency['INR'];
    primaryCurrency = 'INR';
  } else if (balanceByCurrency['USD']) {
    primaryBalance = balanceByCurrency['USD'];
    primaryCurrency = 'USD';
  } else {
    const currencies = Object.keys(balanceByCurrency);
    if (currencies.length > 0) {
      primaryCurrency = currencies[0];
      primaryBalance = balanceByCurrency[primaryCurrency];
    }
  }

  // Calculate weighted average delivery rate
  const totalDeliveries = stats.reduce((sum, s) => {
    if (s.deliveryRate && s.messages) {
      return sum + s.messages * (s.deliveryRate / 100);
    }
    return sum;
  }, 0);
  const avgDeliveryRate = totalMessages > 0 ? (totalDeliveries / totalMessages) * 100 : 0;

  return {
    numbers: totalNumbers,
    messages: totalMessages,
    calls: totalCalls,
    balance: primaryBalance,
    currency: primaryCurrency,
    deliveryRate: Math.round(avgDeliveryRate),
    providers: stats.map((s) => s.provider),
    balanceDetails: balanceByCurrency,
  };
}

/**
 * Aggregate email stats
 */
function aggregateEmailStats(stats) {
  const totalAccounts = stats.reduce((sum, s) => sum + (s.accounts || 0), 0);
  const totalSent = stats.reduce((sum, s) => sum + (s.sent || 0), 0);
  const totalDelivered = stats.reduce((sum, s) => sum + (s.delivered || 0), 0);
  const totalBounced = stats.reduce((sum, s) => sum + (s.bounced || 0), 0);
  const totalOpened = stats.reduce((sum, s) => sum + (s.opened || 0), 0);
  const totalClicked = stats.reduce((sum, s) => sum + (s.clicked || 0), 0);

  const deliveryRate = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;
  const openRate = totalDelivered > 0 ? Math.round((totalOpened / totalDelivered) * 100) : 0;
  const clickRate = totalOpened > 0 ? Math.round((totalClicked / totalOpened) * 100) : 0;

  return {
    accounts: totalAccounts,
    sent: totalSent,
    delivered: totalDelivered,
    bounced: totalBounced,
    opened: totalOpened,
    clicked: totalClicked,
    deliveryRate,
    openRate,
    clickRate,
    providers: stats.map((s) => s.provider),
  };
}

/**
 * Format stats for display in UI
 * @param {string} channelType - whatsapp, email, sms, voice
 * @param {Object} stats - Aggregated stats
 * @param {Object} icons - Icon components
 * @returns {Array} Formatted stats for display
 */
export function formatStatsForDisplay(channelType, stats, icons) {
  const { Phone, MessageSquare, Wallet, CheckCircle, Mail, Zap, FileText } = icons;

  if (channelType === 'whatsapp') {
    return [
      {
        value: stats.numbers || 0,
        label: 'Numbers',
        icon: Phone,
        bg: 'bg-green-50',
        color: 'text-green-600',
      },
      {
        value: stats.messages || 0,
        label: 'Messages',
        icon: MessageSquare,
        bg: 'bg-blue-50',
        color: 'text-blue-600',
      },
      {
        value: `${stats.currency === 'INR' ? '₹' : '$'}${stats.balance || 0}`,
        label: 'Balance',
        icon: Wallet,
        bg: 'bg-purple-50',
        color: 'text-purple-600',
      },
      {
        value: `${stats.deliveryRate || 0}%`,
        label: 'Delivery',
        icon: CheckCircle,
        bg: 'bg-emerald-50',
        color: 'text-emerald-600',
      },
    ];
  }

  if (channelType === 'email') {
    return [
      {
        value: stats.accounts || 0,
        label: 'Accounts',
        icon: Mail,
        bg: 'bg-blue-50',
        color: 'text-blue-600',
      },
      {
        value: stats.sent || 0,
        label: 'Sent',
        icon: MessageSquare,
        bg: 'bg-green-50',
        color: 'text-green-600',
      },
      {
        value: `${stats.deliveryRate || 0}%`,
        label: 'Delivered',
        icon: CheckCircle,
        bg: 'bg-emerald-50',
        color: 'text-emerald-600',
      },
      {
        value: `${stats.openRate || 0}%`,
        label: 'Opened',
        icon: FileText,
        bg: 'bg-purple-50',
        color: 'text-purple-600',
      },
    ];
  }

  if (channelType === 'sms') {
    return [
      {
        value: stats.numbers || 0,
        label: 'Numbers',
        icon: Phone,
        bg: 'bg-orange-50',
        color: 'text-orange-600',
      },
      {
        value: stats.messages || 0,
        label: 'Sent',
        icon: MessageSquare,
        bg: 'bg-blue-50',
        color: 'text-blue-600',
      },
      {
        value: `${stats.currency === 'INR' ? '₹' : '$'}${stats.balance || 0}`,
        label: 'Balance',
        icon: Wallet,
        bg: 'bg-purple-50',
        color: 'text-purple-600',
      },
      {
        value: `${stats.deliveryRate || 0}%`,
        label: 'Delivery',
        icon: CheckCircle,
        bg: 'bg-emerald-50',
        color: 'text-emerald-600',
      },
    ];
  }

  if (channelType === 'voice') {
    return [
      {
        value: stats.numbers || 0,
        label: 'Numbers',
        icon: Phone,
        bg: 'bg-indigo-50',
        color: 'text-indigo-600',
      },
      {
        value: stats.calls || 0,
        label: 'Calls',
        icon: Zap,
        bg: 'bg-blue-50',
        color: 'text-blue-600',
      },
      {
        value: `${stats.currency === 'INR' ? '₹' : '$'}${stats.balance || 0}`,
        label: 'Balance',
        icon: Wallet,
        bg: 'bg-purple-50',
        color: 'text-purple-600',
      },
      {
        value: stats.answered || 0,
        label: 'Answered',
        icon: CheckCircle,
        bg: 'bg-emerald-50',
        color: 'text-emerald-600',
      },
    ];
  }

  // Default fallback
  return [
    {
      value: stats.numbers || 0,
      label: 'Items',
      icon: MessageSquare,
      bg: 'bg-blue-50',
      color: 'text-blue-600',
    },
  ];
}
