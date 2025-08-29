import React, { useState } from 'react';
import { SearchFormProps } from '../types';
import { CITIES } from '../constants/cities';
import './SearchForm.css';

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading = false }) => {
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Filter cities based on input - prioritize exact matches and starts-with matches
  const filteredCities = CITIES.filter(cityData =>
    cityData.name.toLowerCase().includes(city.toLowerCase()) ||
    cityData.country.toLowerCase().includes(city.toLowerCase())
  ).sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const searchTerm = city.toLowerCase();
    
    // Exact match first
    if (aName === searchTerm) return -1;
    if (bName === searchTerm) return 1;
    
    // Starts with match second
    if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
    if (bName.startsWith(searchTerm) && !aName.startsWith(searchTerm)) return 1;
    
    // Alphabetical order
    return aName.localeCompare(bName);
  }).slice(0, 8); // Show more suggestions

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!city.trim() || !startDate || !endDate) {
      alert('Please fill in all fields');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date must be before end date');
      return;
    }

    onSearch(city.trim(), startDate, endDate);
    setShowSuggestions(false);
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentSuggestions = city.length === 0 ? CITIES.slice(0, 8) : filteredCities;
    
    if (!showSuggestions || currentSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < currentSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : currentSuggestions.length - 1
        );
        break;
      case 'Enter':
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          handleCitySelect(currentSuggestions[selectedSuggestionIndex].name);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    // If end date is before start date, adjust it
    if (endDate && date > endDate) {
      setEndDate(date);
    }
  };

  return (
    <div className="search-form-container">
      <form className="search-form" onSubmit={handleSubmit}>
        {/* City Input */}
        <div className="form-group city-input-group">
          <label htmlFor="city">📍 City</label>
          <div className="input-container">
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setShowSuggestions(true);
                setSelectedSuggestionIndex(-1);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                // Delay hiding suggestions to allow for clicks
                setTimeout(() => {
                  setShowSuggestions(false);
                  setSelectedSuggestionIndex(-1);
                }, 150);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type city name or click to see all cities..."
              required
              disabled={isLoading}
            />
            
            {/* City Suggestions */}
            {showSuggestions && (city.length === 0 ? CITIES.slice(0, 8) : filteredCities).length > 0 && (
              <div className="city-suggestions">
                {(city.length === 0 ? CITIES.slice(0, 8) : filteredCities).map((cityData, index) => (
                  <div
                    key={index}
                    className={`city-suggestion ${selectedSuggestionIndex === index ? 'selected' : ''}`}
                    onClick={() => handleCitySelect(cityData.name)}
                  >
                    {cityData.flagUrl && (
                      <img 
                        src={cityData.flagUrl} 
                        alt={`${cityData.country} flag`}
                        className="suggestion-flag"
                      />
                    )}
                    <span className="suggestion-text">
                      <strong>{cityData.name}</strong>, {cityData.country}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Date Inputs */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">📅 Start Date</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              min={today}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">📅 End Date</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || today}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="search-btn"
          disabled={isLoading || !city.trim() || !startDate || !endDate}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Searching Events...
            </>
          ) : (
            <>
              🔍 Search Events
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
