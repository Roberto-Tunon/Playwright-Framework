/**
 * Logger utility for enhanced console output
 * Provides structured logging with visual indicators
 */

export class Logger {
  /**
   * Info log - general information
   * @param message - Log message
   * @param data - Optional data to log (will be stringified)
   */
  static info(message: string, data?: any): void {
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    console.log(`ℹ️  ${message}${dataStr}`);
  }

  /**
   * Success log - operation completed successfully
   * @param message - Success message
   */
  static success(message: string): void {
    console.log(`✅ ${message}`);
  }

  /**
   * Warning log - non-critical issue
   * @param message - Warning message
   */
  static warning(message: string): void {
    console.log(`⚠️  ${message}`);
  }

  /**
   * Error log - critical error occurred
   * @param message - Error message
   * @param error - Optional error object
   */
  static error(message: string, error?: any): void {
    const errorMsg = error?.message || (typeof error === 'string' ? error : '');
    console.error(`❌ ${message}${errorMsg ? `: ${errorMsg}` : ''}`);
  }

  /**
   * Section header - visually separate test sections
   * @param title - Section title
   */
  static section(title: string): void {
    const line = '='.repeat(60);
    console.log(`\n${line}\n📌 ${title}\n${line}\n`);
  }

  /**
   * Step log - log individual test steps
   * @param step - Step number
   * @param description - Step description
   */
  static step(step: number, description: string): void {
    console.log(`\n📍 Step ${step}: ${description}`);
  }

  /**
   * Debug log - detailed debug information
   * @param message - Debug message
   * @param context - Additional context data
   */
  static debug(message: string, context?: any): void {
    if (process.env.DEBUG) {
      const ctxStr = context ? ` ${JSON.stringify(context)}` : '';
      console.log(`🐛 DEBUG: ${message}${ctxStr}`);
    }
  }

  /**
   * Divider - print a visual divider
   */
  static divider(): void {
    console.log('─'.repeat(60));
  }
}