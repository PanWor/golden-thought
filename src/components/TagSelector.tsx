import React, { useState, useEffect } from 'react'
import './TagSelector.css'

interface TagSelectorProps {
  availableTags: string[]
  selectedTag: string | null
  onTagChange: (tag: string | null) => void
}

const TagSelector: React.FC<TagSelectorProps> = ({ 
  availableTags, 
  selectedTag, 
  onTagChange 
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [expanded, setExpanded] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  
  // Check if tags are loaded
  useEffect(() => {
    if (availableTags.length > 0) {
      setIsLoading(false)
    }
  }, [availableTags])
  
  const handleTagClick = (tag: string) => {
    // If the tag is already selected, deselect it
    if (selectedTag === tag) {
      onTagChange(null)
    } else {
      onTagChange(tag)
    }
  }

  // Filter tags based on search query
  const filteredTags = availableTags.filter(tag => 
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  return (
    <div className="tag-selector">
      <h3>Filter by tag:</h3>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="tag-search-input"
          disabled={isLoading}
        />
        {searchQuery && (
          <button 
            className="clear-search-button"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      <div className={`tags-container ${expanded ? 'expanded' : ''}`}>
        {isLoading ? (
          <p className="no-tags-message">Loading tags...</p>
        ) : filteredTags.length > 0 ? (
          <>
            {/* Show only first N-1 tags when not expanded (to make room for show more button) */}
            {(expanded ? filteredTags : filteredTags.slice(0, Math.min(filteredTags.length, 9))).map(tag => (
              <button
                key={tag}
                className={`tag-button ${selectedTag === tag ? 'selected' : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
            
            {/* Show more button inside the container */}
            {filteredTags.length > 9 && (
              <button 
                className="show-more-button"
                onClick={toggleExpand}
              >
                {expanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </>
        ) : (
          <p className="no-tags-message">No matching tags found</p>
        )}
      </div>
    </div>
  )
}

export default TagSelector