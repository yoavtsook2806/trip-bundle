/**
 * Storage for tracking if FTE (First Time Experience) was completed
 * This replaces both fteWasPresented and hasCompletedFirstTimeExperience
 */

const FTE_COMPLETED_KEY = 'fteCompleted';

/**
 * Check if FTE was completed (GO button was pressed)
 */
export const getFteCompleted = (): boolean => {
  try {
    const value = localStorage.getItem(FTE_COMPLETED_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error reading FTE completion status:', error);
    return false;
  }
};

/**
 * Mark FTE as completed (GO button was pressed)
 */
export const markFteAsCompleted = (): void => {
  try {
    localStorage.setItem(FTE_COMPLETED_KEY, 'true');
    console.log('✅ FTE marked as completed');
  } catch (error) {
    console.error('Error saving FTE completion status:', error);
  }
};

/**
 * Reset FTE completion status (for development/testing)
 */
export const resetFteCompleted = (): void => {
  try {
    localStorage.removeItem(FTE_COMPLETED_KEY);
    console.log('🔄 FTE completion status reset');
  } catch (error) {
    console.error('Error resetting FTE completion status:', error);
  }
};
