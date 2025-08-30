import { UserPreferencesHelpers } from '../storage';

export async function getUserPrompt(): Promise<string> {
  return await UserPreferencesHelpers.generateUserPrompt();
}
