/**
 * Returns a random 10 letter string of characters
 * @returns string
 */

export function generateEventCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

export function generateUUID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

export function formatDateToMonthDayYear(dateString: string): string | null {
    // Regular expression to validate the YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
    if (!dateRegex.test(dateString)) {
      console.error("Invalid date format. Please use YYYY-MM-DD.");
      return null;
    }
  
    const [year, month, day] = dateString.split('-').map(Number);
  
    // Create a Date object. Month is 0-indexed in JavaScript Date.
    const date = new Date(year, month - 1, day);
  
    // Check if the date is valid (e.g., handles "2023-02-30" gracefully)
    if (isNaN(date.getTime())) {
      console.error("Invalid date provided.");
      return null;
    }
  
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
  
    return date.toLocaleDateString('en-US', options);
  }
  