'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Wand2,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { useAISuggestions } from '@/hooks/use-inbox-agent';

// Tone options for AI suggestions
const toneOptions = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'empathetic', label: 'Empathetic', description: 'Understanding and supportive' },
  { value: 'concise', label: 'Concise', description: 'Brief and to the point' },
];

// AI Suggestions Panel - expandable panel that shows in the conversation view
export function AISuggestionsPanel({
  conversationId,
  lastCustomerMessage,
  onSelectSuggestion,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tone, setTone] = useState('professional');
  const [suggestions, setSuggestions] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { toast } = useToast();

  const aiSuggestions = useAISuggestions();

  const handleGenerateSuggestions = async () => {
    if (!conversationId) return;

    try {
      const result = await aiSuggestions.mutateAsync({
        conversationId,
        context: lastCustomerMessage,
        tone,
      });

      if (result.data?.suggestions) {
        setSuggestions(result.data.suggestions);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to generate suggestions',
      });
    }
  };

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: 'Copied',
        description: 'Suggestion copied to clipboard',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to copy to clipboard',
      });
    }
  };

  const handleUseSuggestion = (text) => {
    if (onSelectSuggestion) {
      onSelectSuggestion(text);
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn('border rounded-lg bg-card', className)}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-3 h-auto hover:bg-muted/50"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-violet-500" />
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">AI Suggestions</div>
              <div className="text-xs text-muted-foreground">
                Get smart reply suggestions
              </div>
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="p-3 pt-0 space-y-3">
          {/* Tone selector and generate button */}
          <div className="flex items-center gap-2">
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="flex-1 h-9">
                <SelectValue placeholder="Select tone..." />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={handleGenerateSuggestions}
              disabled={aiSuggestions.isPending || !conversationId}
              className="gap-1.5"
            >
              {aiSuggestions.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : suggestions.length > 0 ? (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>

          {/* Suggestions list */}
          {suggestions.length > 0 ? (
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <p className="text-sm mb-2">{suggestion}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => handleUseSuggestion(suggestion)}
                    >
                      <MessageSquare className="h-3 w-3" />
                      Use this
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => handleCopy(suggestion, index)}
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="h-3 w-3 text-green-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : aiSuggestions.isPending ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-violet-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Analyzing conversation...
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                Click "Generate" to get AI-powered reply suggestions
              </p>
            </div>
          )}

          {/* Error state */}
          {aiSuggestions.isError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{aiSuggestions.error?.message || 'Failed to generate suggestions'}</span>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// Compact AI button for message input area
export function AISuggestButton({
  conversationId,
  lastCustomerMessage,
  onSelectSuggestion,
  className,
}) {
  const [showPopover, setShowPopover] = useState(false);
  const [tone, setTone] = useState('professional');
  const [suggestions, setSuggestions] = useState([]);
  const { toast } = useToast();

  const aiSuggestions = useAISuggestions();

  const handleGenerate = async () => {
    if (!conversationId) return;

    try {
      const result = await aiSuggestions.mutateAsync({
        conversationId,
        context: lastCustomerMessage,
        tone,
      });

      if (result.data?.suggestions) {
        setSuggestions(result.data.suggestions);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to generate suggestions',
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleGenerate}
      disabled={aiSuggestions.isPending || !conversationId}
      className={cn('gap-1.5 text-violet-500 hover:text-violet-600 hover:bg-violet-50', className)}
    >
      {aiSuggestions.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="hidden sm:inline">Generating...</span>
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">AI Suggest</span>
        </>
      )}
    </Button>
  );
}

// Quick suggestions dropdown for message input
export function AIQuickSuggestions({
  conversationId,
  lastCustomerMessage,
  onSelectSuggestion,
  trigger,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const { toast } = useToast();

  const aiSuggestions = useAISuggestions();

  const handleGenerate = async () => {
    if (!conversationId) return;

    try {
      const result = await aiSuggestions.mutateAsync({
        conversationId,
        context: lastCustomerMessage,
        tone: 'professional',
      });

      if (result.data?.suggestions) {
        setSuggestions(result.data.suggestions);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to generate suggestions',
      });
    }
  };

  return (
    <div className="space-y-2">
      {trigger && (
        <div onClick={handleGenerate}>
          {trigger}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-1">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSelectSuggestion?.(suggestion)}
              className="w-full text-left p-2 text-sm rounded-md hover:bg-muted transition-colors"
            >
              {suggestion.length > 100 ? `${suggestion.slice(0, 100)}...` : suggestion}
            </button>
          ))}
        </div>
      )}

      {aiSuggestions.isPending && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

export default AISuggestionsPanel;
