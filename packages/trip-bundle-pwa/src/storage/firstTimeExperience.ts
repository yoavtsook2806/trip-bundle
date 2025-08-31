// First Time Experience storage module
// Handles the fteWasPresented flag independently from user preferences

// Storage key for FTE localStorage
const FTE_STORAGE_KEY = 'tripbundle_fte_was_presented';

/**
 * Storage class for First Time Experience state
 */
export class FirstTimeExperienceStorage {
  
  /**
   * Get FTE presentation status from storage
   */
  static async getFteWasPresented(): Promise<boolean> {
    try {
      const stored = localStorage.getItem(FTE_STORAGE_KEY);
      return stored === 'true';
    } catch (error) {
      console.error('Error getting FTE status from storage:', error);
      return false; // Default to not presented
    }
  }
  
  /**
   * Set FTE presentation status in storage
   */
  static async setFteWasPresented(presented: boolean): Promise<boolean> {
    try {
      localStorage.setItem(FTE_STORAGE_KEY, presented.toString());
      
      // Dispatch custom event for reactive updates
      window.dispatchEvent(new CustomEvent('fteStatusUpdated', {
        detail: { fteWasPresented: presented }
      }));
      
      return true;
    } catch (error) {
      console.error('Error setting FTE status in storage:', error);
      return false;
    }
  }
  
  /**
   * Clear FTE status from storage (reset to not presented)
   */
  static async clearFteStatus(): Promise<boolean> {
    try {
      localStorage.removeItem(FTE_STORAGE_KEY);
      
      // Dispatch clear event
      window.dispatchEvent(new CustomEvent('fteStatusCleared'));
      
      return true;
    } catch (error) {
      console.error('Error clearing FTE status:', error);
      return false;
    }
  }
}

export default FirstTimeExperienceStorage;
