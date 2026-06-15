/**
 * Represents a color with red, green, blue, and alpha components, from 0 to 255.
 */
export default class Color {
  constructor(
    private readonly red: number,
    private readonly green: number,
    private readonly blue: number,
    private readonly alpha: number = 255
  ) {}

  /**
   * Converts the color to a hex string.
   * @returns The hex string representation of the color.
   */
  toHex(): string {
    const toTwoDigits = (value: number) => value.toString(16).padStart(2, "0");
    return `#${toTwoDigits(this.red)}${toTwoDigits(this.green)}${toTwoDigits(this.blue)}${toTwoDigits(this.alpha)}`;
  }

  /**
   * Creates a Color instance from a hex color string. If alpha value is not provided, defaults to fully opaque (1).
   *
   * @param hex - The hex color string (e.g., "#RGB" 6-digit or 8-digit with alpha).
   * @returns A new Color instance.
   */
  static fromHex(hex: string): Color {
    const normalized = hex.replace("#", "");
    if (normalized.length === 8) {
      const bigint = Number.parseInt(normalized, 16);
      const red = (bigint >> 24) & 255;
      const green = (bigint >> 16) & 255;
      const blue = (bigint >> 8) & 255;
      const alpha = bigint & 255;
      return new Color(red, green, blue, alpha);
    }

    const bigint = Number.parseInt(normalized, 16);
    const red = (bigint >> 16) & 255;
    const green = (bigint >> 8) & 255;
    const blue = bigint & 255;
    return new Color(red, green, blue, 255);
  }

  static denormalizeValue(value: number): number {
    return Math.round(value * 255);
  }

  /**
   * Adjusts the alpha (opacity) of the color.
   *
   * @param alpha - The alpha value (0 = transparent, 1 = opaque).
   * @returns A new Color instance with the adjusted alpha.
   */
  withAlpha(alphaNormalized: number): Color {
    return new Color(
      this.red,
      this.green,
      this.blue,
      Color.denormalizeValue(alphaNormalized)
    );
  }

  /**
   * Converts the color to a string representation.
   * @returns The string representation of the color.
   */
  toString(): string {
    return this.toHex();
  }
}
