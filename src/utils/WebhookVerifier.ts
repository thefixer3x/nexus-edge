import crypto from 'crypto';

class WebhookVerifier {
  /**
   * Verifies a webhook signature using HMAC-SHA256.
   * @param payload The raw payload of the webhook request.
   * @param signature The signature provided in the webhook header.
   * @param secret The secret key used to generate the signature.
   * @param signatureHeaderName The name of the header containing the signature (e.g., 'x-hub-signature').
   * @param algorithm The HMAC algorithm to use (e.g., 'sha256').
   * @param prefix The prefix of the signature (e.g., 'sha256=').
   * @returns True if the signature is valid, false otherwise.
   */
  static verifyHmacSha256(
    payload: string | Buffer,
    signature: string,
    secret: string,
    signatureHeaderName: string = 'x-hub-signature',
    algorithm: string = 'sha256',
    prefix: string = 'sha256='
  ): boolean {
    const hmac = crypto.createHmac(algorithm, secret);
    hmac.update(payload);
    const expectedSignature = prefix + hmac.digest('hex');

    // Use a constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  }

  /**
   * Verifies if a webhook event is recent based on a timestamp.
   * This helps prevent replay attacks.
   * @param timestamp The timestamp from the webhook event (e.g., Unix timestamp in seconds or milliseconds).
   * @param toleranceMs The maximum allowed difference in milliseconds between the current time and the webhook timestamp.
   * @returns True if the timestamp is within the tolerance, false otherwise.
   */
  static verifyTimestamp(timestamp: number, toleranceMs: number = 300000): boolean { // 5 minutes tolerance
    const currentTime = Date.now();
    return Math.abs(currentTime - timestamp) <= toleranceMs;
  }

  /**
   * A generic verification method that combines signature and timestamp verification.
   * @param payload The raw payload of the webhook request.
   * @param signature The signature provided in the webhook header.
   * @param secret The secret key used to generate the signature.
   * @param timestamp The timestamp from the webhook event.
   * @param options Optional configuration for verification.
   * @param options.signatureHeaderName The name of the header containing the signature (default: 'x-hub-signature').
   * @param options.algorithm The HMAC algorithm to use (default: 'sha256').
   * @param options.prefix The prefix of the signature (default: 'sha256=').
   * @param options.timestampToleranceMs The maximum allowed difference in milliseconds for timestamp (default: 300000).
   * @returns True if both signature and timestamp are valid, false otherwise.
   */
  static verifyWebhook(
    payload: string | Buffer,
    signature: string,
    secret: string,
    timestamp: number,
    options?: {
      signatureHeaderName?: string;
      algorithm?: string;
      prefix?: string;
      timestampToleranceMs?: number;
    }
  ): boolean {
    const sigHeaderName = options?.signatureHeaderName || 'x-hub-signature';
    const algo = options?.algorithm || 'sha256';
    const pref = options?.prefix || 'sha256=';
    const tsTolerance = options?.timestampToleranceMs || 300000;

    const isSignatureValid = WebhookVerifier.verifyHmacSha256(payload, signature, secret, sigHeaderName, algo, pref);
    const isTimestampValid = WebhookVerifier.verifyTimestamp(timestamp, tsTolerance);

    return isSignatureValid && isTimestampValid;
  }
}

export default WebhookVerifier;