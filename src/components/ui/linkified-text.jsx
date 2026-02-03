'use client'

import { useState, useEffect, memo } from 'react'
import { ExternalLink, Globe, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// URL regex pattern - matches http, https, and www URLs
const URL_REGEX = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s]|www\.[^\s<]+[^<.,:;"')\]\s])/gi

// Phone number regex for Indian numbers
const PHONE_REGEX = /(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/g

/**
 * Parse text and extract URLs and phone numbers
 */
function parseTextWithLinks(text) {
  if (!text) return [{ type: 'text', content: text }]

  const parts = []
  let lastIndex = 0

  // Combine URL and phone patterns
  const combinedRegex = new RegExp(
    `(${URL_REGEX.source})|(${PHONE_REGEX.source})`,
    'gi'
  )

  let match
  while ((match = combinedRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex, match.index),
      })
    }

    // Determine if it's a URL or phone
    const matchedText = match[0]
    if (matchedText.match(/^(https?:\/\/|www\.)/i)) {
      const url = matchedText.startsWith('www.')
        ? `https://${matchedText}`
        : matchedText
      parts.push({
        type: 'url',
        content: matchedText,
        url,
      })
    } else {
      // Phone number
      const cleanPhone = matchedText.replace(/[\s-]/g, '')
      parts.push({
        type: 'phone',
        content: matchedText,
        phone: cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`,
      })
    }

    lastIndex = match.index + matchedText.length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(lastIndex),
    })
  }

  return parts.length > 0 ? parts : [{ type: 'text', content: text }]
}

/**
 * Extract domain from URL for display
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url
  }
}

/**
 * Link Preview Card component
 */
const LinkPreviewCard = memo(function LinkPreviewCard({ url, variant = 'light' }) {
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchPreview() {
      try {
        // Use our API to fetch link preview
        const res = await fetch(`/api/v1/utils/link-preview?url=${encodeURIComponent(url)}`)
        const data = await res.json()

        if (!cancelled && data.success && data.data) {
          setPreview(data.data)
        } else {
          setError(true)
        }
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPreview()

    return () => {
      cancelled = true
    }
  }, [url])

  const domain = extractDomain(url)
  const isLight = variant === 'light'

  if (loading) {
    return (
      <div className={cn(
        'mt-2 rounded-lg border overflow-hidden animate-pulse',
        isLight ? 'bg-gray-100 border-gray-200' : 'bg-white/10 border-white/20'
      )}>
        <div className="p-3 space-y-2">
          <div className={cn('h-4 w-3/4 rounded', isLight ? 'bg-gray-200' : 'bg-white/20')} />
          <div className={cn('h-3 w-1/2 rounded', isLight ? 'bg-gray-200' : 'bg-white/20')} />
        </div>
      </div>
    )
  }

  if (error || !preview) {
    // Simple fallback - just show domain
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'mt-2 flex items-center gap-2 p-2 rounded-lg border text-xs',
          isLight
            ? 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
        )}
      >
        <Globe className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">{domain}</span>
        <ExternalLink className="h-3 w-3 flex-shrink-0 ml-auto" />
      </a>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'mt-2 block rounded-lg border overflow-hidden transition-all hover:shadow-md',
        isLight ? 'bg-white border-gray-200' : 'bg-white/10 border-white/20'
      )}
    >
      {/* Image preview */}
      {preview.image && (
        <div className="relative h-32 bg-gray-100 overflow-hidden">
          <img
            src={preview.image}
            alt={preview.title || 'Link preview'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-3">
        <div className={cn(
          'flex items-center gap-1.5 text-xs mb-1',
          isLight ? 'text-gray-500' : 'text-white/60'
        )}>
          {preview.favicon ? (
            <img src={preview.favicon} alt="" className="h-4 w-4 rounded" />
          ) : (
            <Globe className="h-3.5 w-3.5" />
          )}
          <span className="truncate">{preview.siteName || domain}</span>
        </div>

        {preview.title && (
          <p className={cn(
            'font-medium text-sm line-clamp-2',
            isLight ? 'text-gray-900' : 'text-white'
          )}>
            {preview.title}
          </p>
        )}

        {preview.description && (
          <p className={cn(
            'text-xs mt-1 line-clamp-2',
            isLight ? 'text-gray-600' : 'text-white/70'
          )}>
            {preview.description}
          </p>
        )}
      </div>
    </a>
  )
})

/**
 * LinkifiedText - Renders text with clickable links and optional previews
 */
export function LinkifiedText({
  text,
  className,
  showPreviews = true,
  maxPreviews = 2,
  variant = 'light', // 'light' for inbound, 'dark' for outbound
  linkClassName,
}) {
  if (!text) return null

  const parts = parseTextWithLinks(text)
  const urls = parts.filter((p) => p.type === 'url').slice(0, maxPreviews)
  const isLight = variant === 'light'

  return (
    <div className={className}>
      {/* Rendered text with inline links */}
      <span className="whitespace-pre-wrap">
        {parts.map((part, index) => {
          if (part.type === 'url') {
            return (
              <a
                key={index}
                href={part.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'underline hover:no-underline inline-flex items-center gap-0.5',
                  isLight ? 'text-blue-600' : 'text-blue-200',
                  linkClassName
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {part.content}
                <ExternalLink className="h-3 w-3 inline-block" />
              </a>
            )
          }

          if (part.type === 'phone') {
            return (
              <a
                key={index}
                href={`tel:${part.phone}`}
                className={cn(
                  'underline hover:no-underline',
                  isLight ? 'text-green-600' : 'text-green-200',
                  linkClassName
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {part.content}
              </a>
            )
          }

          return <span key={index}>{part.content}</span>
        })}
      </span>

      {/* Link previews */}
      {showPreviews && urls.length > 0 && (
        <div className="space-y-2">
          {urls.map((urlPart, index) => (
            <LinkPreviewCard
              key={index}
              url={urlPart.url}
              variant={variant}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default LinkifiedText
