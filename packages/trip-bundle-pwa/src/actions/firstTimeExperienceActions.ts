import FirstTimeExperienceStore from '../store/firstTimeExperience';
import { FirstTimeExperienceStorage } from '../storage/firstTimeExperience';

/**
 * Actions class for First Time Experience functionality
 * Handles coordination between store and storage for FTE state
 */
export class FirstTimeExperienceActions {
  private fteStore: FirstTimeExperienceStore;
  private fteStorage: typeof FirstTimeExperienceStorage;

  constructor(
    fteStore: FirstTimeExperienceStore,
    fteStorage: typeof FirstTimeExperienceStorage = FirstTimeExperienceStorage
  ) {
    this.fteStore = fteStore;
    this.fteStorage = fteStorage;
  }

  /**
   * Get FTE presentation status
   */
  async getFteWasPresented(): Promise<boolean> {
    try {
      this.fteStore.setLoading(true);
      const presented = await this.fteStorage.getFteWasPresented();
      this.fteStore.setFteWasPresented(presented);
      return presented;
    } catch (error) {
      console.error('Error getting FTE status:', error);
      return false;
    } finally {
      this.fteStore.setLoading(false);
    }
  }

  /**
   * Set FTE presentation status
   */
  async setFteWasPresented(presented: boolean): Promise<boolean> {
    try {
      this.fteStore.setLoading(true);
      const success = await this.fteStorage.setFteWasPresented(presented);
      if (success) {
        this.fteStore.setFteWasPresented(presented);
      }
      return success;
    } catch (error) {
      console.error('Error setting FTE status:', error);
      return false;
    } finally {
      this.fteStore.setLoading(false);
    }
  }

  /**
   * Reset FTE status (mark as not presented)
   */
  async resetFteStatus(): Promise<boolean> {
    try {
      this.fteStore.setLoading(true);
      const success = await this.fteStorage.clearFteStatus();
      if (success) {
        this.fteStore.reset();
      }
      return success;
    } catch (error) {
      console.error('Error resetting FTE status:', error);
      return false;
    } finally {
      this.fteStore.setLoading(false);
    }
  }

  /**
   * Initialize FTE data from storage
   */
  async initializeFteData(): Promise<void> {
    try {
      console.log('⚙️ [INIT_FTE] Loading FTE status from storage...');
      const presented = await this.fteStorage.getFteWasPresented();
      this.fteStore.setFteWasPresented(presented);
      console.log('⚙️ [INIT_FTE] FTE status loaded:', { fteWasPresented: presented });
    } catch (error) {
      console.error('⚙️ [INIT_FTE] Error initializing FTE data:', error);
    }
  }

  /**
   * Get current FTE status from store (synchronous)
   */
  getCurrentFteStatus(): boolean {
    return this.fteStore.fteWasPresented;
  }

  /**
   * Check if FTE should be shown (synchronous)
   */
  shouldShowFte(): boolean {
    return this.fteStore.shouldShowFte;
  }

  /**
   * Check if FTE is currently loading
   */
  isLoading(): boolean {
    return this.fteStore.isLoading;
  }
}

/**
 * Initialize FTE data from storage and sync with store
 */
export async function initFirstTimeExperienceData(
  fteStore: FirstTimeExperienceStore,
  fteStorage: typeof FirstTimeExperienceStorage = FirstTimeExperienceStorage
): Promise<void> {
  try {
    console.log('⚙️ [INIT_FTE] Loading FTE status from storage...');
    const presented = await fteStorage.getFteWasPresented();
    fteStore.setFteWasPresented(presented);
    console.log('⚙️ [INIT_FTE] FTE status initialized:', { fteWasPresented: presented });
  } catch (error) {
    console.error('⚙️ [INIT_FTE] Error initializing FTE data:', error);
  }
}

export default FirstTimeExperienceActions;
