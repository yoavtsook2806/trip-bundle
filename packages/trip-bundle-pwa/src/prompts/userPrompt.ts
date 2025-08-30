import UserPreferencesStore from '../store/userPreferences';
import IntegrationsStore from '../store/integrations';

export function getUserPrompt(
  userPreferencesStore: UserPreferencesStore,
  integrationsStore: IntegrationsStore
): string {
  const userPreferencesPrompt = generateUserPreferencesPrompt(userPreferencesStore);
  const integrationsContext = generateIntegrationsPromptContext(integrationsStore);

  return userPreferencesPrompt + integrationsContext;
}

function generateUserPreferencesPrompt(userPreferencesStore: UserPreferencesStore): string {
  const prefs = userPreferencesStore.preferences;
  const promptParts: string[] = [];
  
  // Budget information
  promptParts.push(`Budget: ${prefs.budget.min}-${prefs.budget.max} ${prefs.budget.currency}`);
  
  // Duration
  promptParts.push(`Trip duration: ${prefs.duration.min}-${prefs.duration.max} days`);
  
  // Group size
  if (prefs.groupSize > 1) {
    promptParts.push(`Group size: ${prefs.groupSize} people`);
  }
  
  // Location preferences
  if (prefs.preferredCountries.length > 0) {
    promptParts.push(`Preferred countries: ${prefs.preferredCountries.join(', ')}`);
  }
  
  // Music genres
  if (prefs.musicGenres.length > 0) {
    promptParts.push(`Music genres: ${prefs.musicGenres.join(', ')}`);
  }
  
  // Sports interests
  if (prefs.sportsInterests.length > 0) {
    promptParts.push(`Sports interests: ${prefs.sportsInterests.join(', ')}`);
  }
  
  // Entertainment preferences
  if (prefs.entertainmentPreferences.length > 0) {
    const entertainmentSummary = prefs.entertainmentPreferences
      .map(pref => `${pref.value} (${pref.type}, weight: ${pref.weight})`)
      .join(', ');
    promptParts.push(`Entertainment preferences: ${entertainmentSummary}`);
  }
  
  // Travel dates
  if (prefs.travelDates?.flexible !== undefined) {
    if (prefs.travelDates.flexible) {
      promptParts.push('Travel dates are flexible');
    } else {
      promptParts.push('Travel dates are fixed (not flexible)');
    }
  }
  
  return promptParts.length > 0 
    ? `User preferences: ${promptParts.join('. ')}.`
    : '';
}

function generateIntegrationsPromptContext(integrationsStore: IntegrationsStore): string {
  const contextParts: string[] = [];

  if (integrationsStore.isSpotifyConnected && integrationsStore.spotifyPreferences) {
    const prefs = integrationsStore.spotifyPreferences;
    
    contextParts.push(`Music Preferences (from Spotify):
- Top Genres: ${prefs.topGenres.join(', ')}
- Top Artists: ${prefs.topArtists.slice(0, 5).map(a => a.name).join(', ')}
- Music Profile: ${prefs.musicProfile.energy > 0.7 ? 'High Energy' : prefs.musicProfile.energy > 0.4 ? 'Moderate Energy' : 'Low Energy'}, ${prefs.musicProfile.danceability > 0.7 ? 'Danceable' : 'Non-Danceable'}, ${prefs.musicProfile.valence > 0.7 ? 'Positive/Happy' : prefs.musicProfile.valence > 0.4 ? 'Neutral' : 'Melancholic'}
- Preferred Music Events: Concerts and festivals featuring ${prefs.topGenres.slice(0, 3).join(', ')} music`);
  }

  return contextParts.length > 0 
    ? `\n\nIntegrated Services Data:\n${contextParts.join('\n\n')}`
    : '';
}
