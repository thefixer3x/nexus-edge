class CurrencyFormatter {
  /**
   * Converts a major unit amount (e.g., dollars) to a minor unit amount (e.g., cents).
   * @param majorUnitAmount The amount in major units (e.g., 10.50).
   * @param currencyCode The ISO 4217 currency code (e.g., "USD").
   * @returns The amount in minor units (e.g., 1050).
   */
  static toMinorUnit(majorUnitAmount: number, currencyCode: string): number {
    // For simplicity, assuming 2 decimal places for most currencies.
    // In a real-world scenario, this would need a more robust currency-specific logic.
    return Math.round(majorUnitAmount * 100);
  }

  /**
   * Converts a minor unit amount (e.g., cents) to a major unit amount (e.g., dollars).
   * @param minorUnitAmount The amount in minor units (e.g., 1050).
   * @param currencyCode The ISO 4217 currency code (e.g., "USD").
   * @returns The amount in major units (e.g., 10.50).
   */
  static toMajorUnit(minorUnitAmount: number, currencyCode: string): number {
    return minorUnitAmount / 100;
  }

  /**
   * Formats a major unit amount for display with currency symbol and appropriate decimal places.
   * @param majorUnitAmount The amount in major units (e.g., 10.50).
   * @param currencyCode The ISO 4217 currency code (e.g., "USD").
   * @param locale The locale for formatting (e.g., "en-US").
   * @returns The formatted currency string (e.g., "$10.50").
   */
  static format(majorUnitAmount: number, currencyCode: string, locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(majorUnitAmount);
  }
}

export default CurrencyFormatter;