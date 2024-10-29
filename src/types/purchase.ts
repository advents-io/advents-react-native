/**
 * Represents a purchase event in the Advents SDK.
 * Used to track monetary transactions within the application.
 */
export interface Purchase {
  /**
   * The monetary value of the purchase.
   * Must be a positive number representing the amount in the app's currency.
   * @example 29.99
   */
  value: number
}
