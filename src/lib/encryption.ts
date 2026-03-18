/**
 * Service for handling base64 encoding and decoding.
 * Provides consistent methods for dealing with base64 data across the app.
 */
export const EncryptionService = {
  /**
   * Encodes a string to base64.
   */
  base64Encode: (str: string | null | undefined): string => {
    if (!str) return "";
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      console.error("Base64 encoding failed:", e);
      return str;
    }
  },

  /**
   * Decodes a base64 string.
   */
  base64Decode: (str: string | null | undefined): string => {
    if (!str) return "";
    try {
      // Handle potential URL-safe base64 or padding issues
      const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
      return decodeURIComponent(escape(atob(base64)));
    } catch (e) {
      console.warn("Base64 decoding failed for:", str, e);
      return str;
    }
  },
};
