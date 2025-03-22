import { useState, useEffect } from 'react'
import './App.css'
import QuoteDisplay from './components/QuoteDisplay'
import TagSelector from './components/TagSelector'

// Define the Quote interface
export interface Quote {
  _id: string
  content: string
  author: string
  tags: string[]
}

// Available tags for filtering quotes
export const AVAILABLE_TAGS: string[] = []

// Cache duration in milliseconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000

// Function to fetch and cache tags
const fetchAndCacheTags = async () => {
  try {
    // Check if we have cached tags
    const cachedData = localStorage.getItem('tagCache')
    
    if (cachedData) {
      const { tags, timestamp } = JSON.parse(cachedData)
      const now = new Date().getTime()
      
      // If cache is still valid, use it
      if (now - timestamp < CACHE_DURATION) {
        console.log('Using cached tags')
        AVAILABLE_TAGS.length = 0 // Clear array
        AVAILABLE_TAGS.push(...tags)
        return
      }
    }
    
    // Fetch fresh tags if cache is invalid or missing
    console.log('Fetching fresh tags')
    const response = await fetch('https://api.quotable.io/tags')
    const tagsData = await response.json()
    
    // Extract tag names and update AVAILABLE_TAGS
    const tagNames = tagsData
      .map((tag: { name: string }) => tag.name.toLowerCase())
      // Remove duplicates using Set
      .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index)
    
    AVAILABLE_TAGS.length = 0 // Clear array
    AVAILABLE_TAGS.push(...tagNames)
    
    // Cache the tags with timestamp
    localStorage.setItem('tagCache', JSON.stringify({
      tags: tagNames,
      timestamp: new Date().getTime()
    }))
  } catch (error) {
    console.error('Failed to fetch tags:', error)
  }
}

// Fetch tags when the module loads
fetchAndCacheTags()
  
function App() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const fetchQuote = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const url = selectedTag
        ? `https://api.quotable.io/quotes/random?tags=${selectedTag}`
        : 'https://api.quotable.io/quotes/random'
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch quote')
      }
      
      const data = await response.json()
      setQuote(data[0]) // API returns an array with one quote
    } catch (err) {
      setError('Failed to fetch a quote. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch a quote when the component mounts
  useEffect(() => {
    fetchQuote()
  }, [])

  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag)
  }

  return (
    <div className="app-container">
      <header>
        <h1>Golden Thought Generator</h1>
        <p className="subtitle">Discover wisdom that inspires</p>
      </header>
      
      <main>
        <TagSelector 
          availableTags={AVAILABLE_TAGS} 
          selectedTag={selectedTag} 
          onTagChange={handleTagChange} 
        />
        
        <QuoteDisplay 
          quote={quote} 
          loading={loading} 
          error={error} 
        />
        
        <button 
          className="fetch-button" 
          onClick={fetchQuote} 
          disabled={loading}
        >
          {loading ? 'Loading...' : 'New Thought'}
        </button>
      </main>
      
      <footer>
        <p>Powered by <a href="https://api.quotable.io" target="_blank" rel="noopener noreferrer">Quotable API</a> | Made by <a href="https://github.com/PanWor" target="_blank" rel="noopener noreferrer">PanWor</a></p>
      </footer>
    </div>
  )
}

export default App