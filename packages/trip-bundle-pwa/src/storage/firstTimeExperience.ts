const FTE_COMPLETED_KEY = 'trip-bundle-fte-completed';

/**
 * Mark first-time experience as completed (Go button was pressed)
 */
export const markFirstTimeExperienceCompleted = (): void => {
  localStorage.setItem(FTE_COMPLETED_KEY, 'true');
  console.log('🎯 First-time experience marked as completed');
};

/**
 * Check if first-time experience was completed (Go button was pressed)
 */
export const hasCompletedFirstTimeExperience = (): boolean => {
  const completed = localStorage.getItem(FTE_COMPLETED_KEY);
  const result = completed === 'true';
  console.log('🎯 Checking FTE completion status:', result);
  return result;
};

/**
 * Reset first-time experience completion status
 */
export const resetFirstTimeExperience = (): void => {
  localStorage.removeItem(FTE_COMPLETED_KEY);
  console.log('🎯 First-time experience reset');
};
