
/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

resourceLibrary.ready(() => {

  let
      debug = resourceLibrary.options.debug(),
      language = resourceLibrary.language(),
      now = Date.now(),
      twoHours = (60 * 1000) * 120,
      userCurrency = resourceLibrary.getPreference('userCurrency'),
      exchangeRates = resourceLibrary.getPreference('exchangeRates') || setExchangeRates();

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Sets the default currency object values
   * @return {object}
   */
  function setExchangeRates() {

    let obj = {
      currency: null,
      data: null
    };
    // Save it...
    resourceLibrary.setPreference('exchangeRates', obj);
    updateRates();
    // Get it again because reasons
    return resourceLibrary.getPreference('exchangeRates');
  }

  /**
   * Updates the exchange rates from Fixer.io
   * @return {object}
   */
  async function updateRates() {

    let url = `https://discogs-enhancer.com/rates?base=${userCurrency}`;

    try {

      let response = await fetch(url),
          data = await response.json();

      exchangeRates.data = data;

      // Set last saved currency
      // If different from userCurrency it will trigger exchange rates update
      exchangeRates.currency = userCurrency;
      exchangeRates.data.lastChecked = now;

      if ( debug ) {

        console.log('*** Fresh rates ***');
        console.log(`Last update: ${exchangeRates.data.date} language: ${language} Currency: ${userCurrency}`);
        console.log('rates:', exchangeRates.data.rates);
      }

      // Save object to localStorage
      resourceLibrary.setPreference('exchangeRates', exchangeRates);
      exchangeRates = resourceLibrary.getItem('userPreferences').exchangeRates;

    } catch (err) {
      return console.log('Could not get currency exchange rates.', err);
    }
  }

  // ========================================================
  // Update functionality
  // ========================================================

  switch ( true ) {
    // if there's no rates prop it could
    // mean possible data corruption
    case !exchangeRates:
    case exchangeRates && !exchangeRates.data:
    case typeof exchangeRates.data !== 'object':

      // kill it with fire
      resourceLibrary.setPreference('exchangeRates', null);
      exchangeRates = setExchangeRates();
      break;

    // Data is stale or user has changed currency
    case now > exchangeRates.data.lastChecked + twoHours:
    case userCurrency !== exchangeRates.currency:

      // Remove old prices.
      // This will trigger a user alert if something tries to access
      // these rates before they have been returned from fixer.io
      exchangeRates.data = null;

      if ( debug ) {
        console.log(' ');
        console.log('Getting fresh rates... One moment please.');
      }

      updateRates();
      break;

    default:

      if ( debug ) {

        console.log(' ');
        console.log(`Using cached rates: ${exchangeRates.data.date} language: ${language} Currency: ${userCurrency}`);
        console.log('rates:', exchangeRates.data);
      }

      break;
  }
});
