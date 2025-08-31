import { makeAutoObservable } from 'mobx';

/**
 * MobX store for First Time Experience state
 * Manages the fteWasPresented flag independently from user preferences
 */
class FirstTimeExperienceStore {
  fteWasPresented = false;
  isLoading = false;
  lastUpdated?: Date;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Set FTE presentation status
   */
  setFteWasPresented(presented: boolean) {
    this.fteWasPresented = presented;
    this.updateTimestamp();
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  /**
   * Reset FTE status to not presented
   */
  reset() {
    this.fteWasPresented = false;
    this.lastUpdated = undefined;
  }

  /**
   * Update timestamp
   */
  private updateTimestamp() {
    this.lastUpdated = new Date();
  }

  /**
   * Computed getter for whether FTE should be shown
   */
  get shouldShowFte() {
    return !this.fteWasPresented;
  }
}

export default FirstTimeExperienceStore;
