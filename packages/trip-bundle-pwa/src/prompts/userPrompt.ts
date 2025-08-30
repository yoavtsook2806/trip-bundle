import { UserPreferencesHelpers, IntegrationsHelpers } from '../storage';

export async function getUserPrompt(): Promise<string> {
  const [userPreferencesPrompt, integrationsContext] = await Promise.all([
    UserPreferencesHelpers.generateUserPrompt(),
    IntegrationsHelpers.generateIntegrationsPromptContext()
  ]);

  return userPreferencesPrompt + integrationsContext;
}
