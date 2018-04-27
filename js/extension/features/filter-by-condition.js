/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * ---------------------------------------------------------------------------
 * Overview
 * ---------------------------------------------------------------------------
 *
 * This feature will hide all items below a specifed condition in the Marketplace.
 *
 * The script is initiated with the code that follows the `DOM manipulation` comment block.
 *
 * 1.) The URL is examined to see if the user is in the Marketplace.
 * 2.) localStorage is queried for an `itemCondition` item.
 * 3.) The value of `itemCondition` is used to truncate the length of the `conditions` array which
 * is then iterated over and any remaining values in the array are used to remove items in
 * those conditions from the DOM.
 */

resourceLibrary.ready(() => {
// TODO: viewing a profile for feedback will cause this script to throw an error
  let
      href = window.location.href,
      itemCondition = JSON.parse(localStorage.getItem('itemCondition')),
      hasRemovedItems = false,
      sellPage = href.match(/sell\/list/g),
      sellerPage = href.match(/seller/g),
      sellRelease = href.match(/sell\/release/g),
      wantsPage = href.match(/sell\/mywants/g);


  /**
   * Find all instances of selected items in list and hide them
   *
   * @method hideItems
   * @return {undefined}
   */
  // TODO: rename this to something like filterByCondition
  window.hideItems = function hideItems() {

    // BUGFIX: allows this feature to work when the user has not enabled the marketplace highlights
    [...document.getElementsByClassName('condition-label-mobile')].forEach(elem => elem.remove());

    if ( itemCondition ) {

      let conditions = ['Poor (P)',
                        'Fair (F)',
                        'Good (G)',
                        'Good Plus (G+)',
                        'Very Good (VG)',
                        'Very Good Plus (VG+)',
                        'Near Mint (NM or M-)',
                        'Mint (M)'];

      // Truncate conditions array based on localStorage value
      conditions.length = Number(itemCondition);

      // Remove offending items from the DOM based on whatever's left in the conditions array
      conditions.forEach(condition => {

        // Create array of media conditions
        let elems = [...document.querySelectorAll('td.item_description p.item_condition .condition-label-desktop:first-child + span')];

        elems.forEach(el => {

          if ( el.textContent.trim() === condition ) {

            el.parentElement.parentElement.parentElement.remove();
            hasRemovedItems = true;
          }
        });

        if ( hasRemovedItems ) {

          let key = ['Poor (P)',
                     'Fair (F)',
                     'Good (G)',
                     'Good Plus (G+)',
                     'Very Good (VG)',
                     'Very Good Plus (VG+)',
                     'Near Mint (NM or M-)',
                     'Mint (M)'];

          // Update page with filter notice
          [...document.querySelectorAll('.pagination_total')].forEach(e => {
            e.textContent = `Filtering items below: ${key[conditions.length]}`;
          });
        }
      });

      // Show message if all results have been removed
      if ( !document.getElementsByClassName('shortcut_navigable').length ) {

        let html = `<tr class="shortcut_navigable">
                      <th>
                        Discogs Enhancer has removed all Marketplace results because they do not meet your filter critera.
                        If you do not want this effect please adjust the "Filter By Condition" setting in Discogs Enhancer.
                      </th>
                    </tr>`;

        document.querySelector('#pjax_container tbody').innerHTML = html;

        [...document.querySelectorAll('.pagination_total')].forEach(e => {
          e.textContent = 'All results have been removed.';
        });
      }
    } else {

      return;
    }
  };

  // ========================================================
  // DOM manipulation
  // ========================================================

  if ( sellPage || sellRelease || sellerPage || wantsPage ) {

    // hide items when page first loads
    window.hideItems();

    // Call hideItems on prev/next clicks
    let pagination = [...document.querySelectorAll('ul.pagination_page_links a[class^="pagination_"]')];

    pagination.forEach(elem => {

      elem.addEventListener('click', () => {

        resourceLibrary.xhrSuccess(window.hideItems);
      });
    });
  }
});
