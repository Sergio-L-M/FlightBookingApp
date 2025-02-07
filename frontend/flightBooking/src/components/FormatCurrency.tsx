export function formatNumberWithCommas(amount: string, locale: string = "en-US"): string {
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount)) {
      console.error(`Invalid amount: ${amount}`);
      return amount; 
    }
  
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericAmount);
  }