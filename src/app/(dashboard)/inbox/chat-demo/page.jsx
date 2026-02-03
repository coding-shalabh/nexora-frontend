'use client';

import { useState } from 'react';
import { UnifiedChatView } from '@/components/inbox/unified-chat-view';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Sample messages for demo
const sampleMessages = [
  {
    id: '1',
    content: "Well... I'm not sure about it but I have an idea",
    direction: 'outbound',
    createdAt: new Date(Date.now() - 3600000 * 2),
    status: 'read',
  },
  {
    id: '2',
    content: "It's an evening. Let's do that",
    direction: 'outbound',
    createdAt: new Date(Date.now() - 3600000 * 1.5),
    status: 'read',
  },
  {
    id: '3',
    content: 'Where do we want to meet guys? I need to know before',
    direction: 'inbound',
    senderName: 'Sarah',
    senderAvatar: null,
    createdAt: new Date(Date.now() - 3600000),
    status: 'read',
  },
  {
    id: '4',
    content: 'Hm ... Let me think',
    direction: 'outbound',
    createdAt: new Date(Date.now() - 1800000),
    status: 'delivered',
  },
  {
    id: '5',
    mediaType: 'audio',
    duration: '0:30',
    direction: 'outbound',
    createdAt: new Date(Date.now() - 1200000),
    status: 'delivered',
  },
  {
    id: '6',
    type: 'poll',
    pollQuestion: 'What do you want to eat?',
    pollOptions: ['Pizza', 'Burgers', 'Sushi', 'Tacos'],
    pollVotes: 8,
    direction: 'inbound',
    senderName: 'Sarah',
    createdAt: new Date(Date.now() - 600000),
  },
  {
    id: '7',
    content: "I'm craving pizza! Let's go to that new Italian place downtown.",
    direction: 'outbound',
    createdAt: new Date(Date.now() - 300000),
    status: 'sent',
    reactions: [{ emoji: '😋' }],
  },
];

// Sample conversation data
const sampleConversations = {
  whatsapp: {
    id: 'conv-1',
    channel: 'whatsapp',
    contactName: 'Sarah Johnson',
    contactPhone: '+1 555 123 4567',
    contact: {
      name: 'Sarah Johnson',
      phone: '+1 555 123 4567',
    },
  },
  email: {
    id: 'conv-2',
    channel: 'email',
    contactName: 'John Smith',
    contactPhone: 'john.smith@company.com',
    contact: {
      name: 'John Smith',
      phone: 'john.smith@company.com',
    },
  },
  sms: {
    id: 'conv-3',
    channel: 'sms',
    contactName: 'Mike Wilson',
    contactPhone: '+1 555 987 6543',
    contact: {
      name: 'Mike Wilson',
      phone: '+1 555 987 6543',
    },
  },
};

export default function ChatDemoPage() {
  const [selectedChannel, setSelectedChannel] = useState('whatsapp');
  const [messages, setMessages] = useState(sampleMessages);

  const handleSendMessage = (content) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      content,
      direction: 'outbound',
      createdAt: new Date(),
      status: 'sent',
    };
    setMessages([...messages, newMessage]);

    // Simulate status updates
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, status: 'delivered' } : m))
      );
    }, 1000);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, status: 'read' } : m))
      );
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Channel Selector */}
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900 mb-3">Unified Chat UI Demo</h1>
        <p className="text-sm text-gray-500 mb-4">
          This is a sample of the unified chat UI that works across all channels. The UI remains
          consistent - only the channel badge changes.
        </p>
        <div className="flex gap-2">
          <Button
            variant={selectedChannel === 'whatsapp' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedChannel('whatsapp')}
            className={cn(selectedChannel === 'whatsapp' && 'bg-green-600 hover:bg-green-700')}
          >
            WhatsApp
          </Button>
          <Button
            variant={selectedChannel === 'email' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedChannel('email')}
            className={cn(selectedChannel === 'email' && 'bg-purple-600 hover:bg-purple-700')}
          >
            Email
          </Button>
          <Button
            variant={selectedChannel === 'sms' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedChannel('sms')}
            className={cn(selectedChannel === 'sms' && 'bg-blue-600 hover:bg-blue-700')}
          >
            SMS
          </Button>
        </div>
      </div>

      {/* Chat View */}
      <div className="flex-1 overflow-hidden">
        <UnifiedChatView
          conversation={sampleConversations[selectedChannel]}
          messages={messages}
          onSendMessage={handleSendMessage}
          currentUserId="current-user"
        />
      </div>
    </div>
  );
}
