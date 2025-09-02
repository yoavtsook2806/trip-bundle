/**
 * Storage for tracking if FTE (First Time Experience) was presented
 */

const FTE_PRESENTED_KEY = 'fteWasPresented';

/**
 * Check if FTE was already presented to the user
 */
export const getFteWasPresented = (): boolean => {
  try {
    const value = localStorage.getItem(FTE_PRESENTED_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error reading FTE presented status:', error);
    return false;
  }
};

/**
 * Mark FTE as presented
 */
export const markFteAsPresented = (): void => {
  try {
    localStorage.setItem(FTE_PRESENTED_KEY, 'true');
    console.log('✅ FTE marked as presented');
  } catch (error) {
    console.error('Error saving FTE presented status:', error);
  }
};

/**
 * Reset FTE presented status (for development/testing)
 */
export const resetFtePresented = (): void => {
  try {
    localStorage.removeItem(FTE_PRESENTED_KEY);
    console.log('🔄 FTE presented status reset');
  } catch (error) {
    console.error('Error resetting FTE presented status:', error);
  }
};
