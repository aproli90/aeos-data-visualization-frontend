export class ChartError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context: Record<string, any> = {},
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'ChartError';
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ChartError);
    }

    // Format error message with context
    this.message = this.formatErrorMessage();
  }

  private formatErrorMessage(): string {
    const contextStr = Object.entries(this.context)
      .map(([key, value]) => `\n  ${key}: ${JSON.stringify(value)}`)
      .join('');

    let message = `[${this.code}] ${this.message}`;
    if (contextStr) {
      message += `\nContext:${contextStr}`;
    }
    if (this.cause) {
      message += `\nCause: ${this.cause.message}`;
    }
    return message;
  }

  public toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      cause: this.cause?.message,
      stack: this.stack
    };
  }
}