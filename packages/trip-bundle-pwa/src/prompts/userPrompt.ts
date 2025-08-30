import UserPreferencesStore from '../store/userPreferences';
import IntegrationsStore from '../store/integrations';

export function getUserPrompt(
  userPreferencesStore: UserPreferencesStore,
  integrationsStore: IntegrationsStore
): string {
  const userPreferencesPrompt = userPreferencesStore.userPrompt;
  const integrationsContext = integrationsStore.integrationsPromptContext;

  return userPreferencesPrompt + integrationsContext;
}
