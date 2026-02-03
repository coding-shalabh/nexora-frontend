'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  FileText,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  MessageSquare,
  User,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { useConversationSummary } from '@/hooks/use-inbox-agent';

// Conversation Summary Panel
export function ConversationSummaryPanel({
  conversationId,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const summarize = useConversationSummary();

  const handleGenerateSummary = async () => {
    if (!conversationId) return;

    try {
      const result = await summarize.mutateAsync(conversationId);

      if (result.data) {
        setSummary(result.data);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to generate summary',
      });
    }
  };

  const handleCopy = async () => {
    if (!summary?.summary) return;

    try {
      await navigator.clipboard.writeText(summary.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Copied',
        description: 'Summary copied to clipboard',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to copy to clipboard',
      });
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
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">Conversation Summary</div>
              <div className="text-xs text-muted-foreground">
                AI-generated overview of the conversation
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
          {/* Generate button */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleGenerateSummary}
              disabled={summarize.isPending || !conversationId}
              className="gap-1.5 flex-1"
            >
              {summarize.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : summary ? (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Regenerate Summary
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Generate Summary
                </>
              )}
            </Button>
            {summary && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Summary content */}
          {summary ? (
            <div className="space-y-4">
              {/* Main summary */}
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-sm leading-relaxed">{summary.summary}</p>
              </div>

              {/* Key points */}
              {summary.keyPoints && summary.keyPoints.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Key Points
                  </h4>
                  <ul className="space-y-1">
                    {summary.keyPoints.map((point, index) => (
                      <li
                        key={index}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-primary mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {summary.messageCount && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{summary.messageCount} messages</span>
                  </div>
                )}
                {summary.sentiment && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      'text-xs',
                      summary.sentiment === 'positive' && 'bg-green-100 text-green-700',
                      summary.sentiment === 'negative' && 'bg-red-100 text-red-700',
                      summary.sentiment === 'neutral' && 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {summary.sentiment}
                  </Badge>
                )}
                {summary.topics && summary.topics.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    {summary.topics.slice(0, 3).map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Action items */}
              {summary.actionItems && summary.actionItems.length > 0 && (
                <div className="space-y-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20">
                  <h4 className="text-sm font-medium flex items-center gap-1.5 text-yellow-700 dark:text-yellow-500">
                    <Clock className="h-4 w-4" />
                    Action Items
                  </h4>
                  <ul className="space-y-1">
                    {summary.actionItems.map((item, index) => (
                      <li
                        key={index}
                        className="text-sm text-yellow-700 dark:text-yellow-400 flex items-start gap-2"
                      >
                        <span className="mt-1">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : summarize.isPending ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Analyzing conversation...
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                Click "Generate Summary" to get an AI overview
              </p>
            </div>
          )}

          {/* Error state */}
          {summarize.isError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{summarize.error?.message || 'Failed to generate summary'}</span>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// Compact summary button
export function SummarizeButton({
  conversationId,
  onSummary,
  className,
}) {
  const { toast } = useToast();
  const summarize = useConversationSummary();

  const handleClick = async () => {
    if (!conversationId) return;

    try {
      const result = await summarize.mutateAsync(conversationId);
      if (result.data && onSummary) {
        onSummary(result.data);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to generate summary',
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={summarize.isPending || !conversationId}
      className={cn('gap-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50', className)}
    >
      {summarize.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="hidden sm:inline">Summarizing...</span>
        </>
      ) : (
        <>
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Summarize</span>
        </>
      )}
    </Button>
  );
}

export default ConversationSummaryPanel;
