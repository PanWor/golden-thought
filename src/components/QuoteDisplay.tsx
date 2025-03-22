import React from 'react'
import { Quote } from '../App'
import './QuoteDisplay.css'

interface QuoteDisplayProps {
  quote: Quote | null
  loading: boolean
  error: string | null
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, loading, error }) => {
  if (loading) {
    return (
      <div className="quote-container loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="quote-container error">
        <p className="error-message">{error}</p>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="quote-container empty">
        <p>No quote to display. Click the button to get started.</p>
      </div>
    )
  }

  return (
    <div className="quote-container">
      <blockquote>
        <p className="quote-content">{quote.content}</p>
        <footer className="quote-author">— {quote.author}</footer>
      </blockquote>
      
      {quote.tags && quote.tags.length > 0 && (
        <div className="quote-tags">
          {quote.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuoteDisplay