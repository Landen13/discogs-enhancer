/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This will append a small icon to the nav bar that
 * when clicked will show a random item from the user's
 * collection. The functionality is identical to the
 * Random Item feature in the collection page but
 * makes it accessable from the nav bar.
 */

rl.ready(() => {
  // ========================================================
  // Functions
  // ========================================================
  /**
   * Requests a random item from the user's collection
   * @returns {assignment}
   */
  async function getRandomItem() {

    let action = 'Action.RandomItem=Random%2BItem',
        headers = { 'content-type': 'application/x-www-form-urlencoded' },
        url = `https://www.discogs.com/user/${user}/collection`,
        initObj = {
          body: action,
          credentials: 'include',
          headers: headers,
          method: 'POST'
        },
        response = await fetch(url, initObj),
        location = response.url;

    window.location.href = location;
  }

  // ========================================================
  // CSS
  // ========================================================
  let rules = `
      .rotate {
        animation: rotation .77s ease-in;
      }

      @keyframes rotation {
        from { transform: rotate(0deg); }
        to { transform: rotate(359deg); }
      }`;

  // ========================================================
  // DOM Setup
  // ========================================================
  let user = rl.username(),
      iconSize = '14px',
      icon = `<li style="position: relative;">
                <a class="nav_group_control de-random-item needs_delegated_tooltip"
                   rel="tooltip"
                   title="Random Item"
                   data-placement="bottom"
                   arial-label="Random Item"
                   style="font-size: ${iconSize}; margin-top: 2px;">
                  <span style="cursor: pointer; pointer-events:none;">
                    <span style="color: white; pointer-events:none;">\u267A</span>
                  </span>
                </a>
              </li>`;


  if ( user ) {
    rl.attachCss('random-item', rules);
    document.getElementById('activity_menu').insertAdjacentHTML('beforeend', icon);
    document.querySelector('.de-random-item').addEventListener('click', event => {
      event.target.classList.add('rotate');
      getRandomItem();
    });
  }
});
/**
// ========================================================
A fine white ash covered me. The great white light took me in.
I knew happiness, for a moment. I was going towards the eternal light
"but you come back". Yes it was my body,
it wasn't my time you see. The picture of a man was beside me
just before he slipped away he looked me in the eye he said
"Take the pictures" "Take the pictures"
We were going towards the eternal light
but I had to bring back the living pictures.
They saw it. The pictures saw it.
Light, white the colour. How could all these things be true?
If they hadn't, the living pictures saw it all...
My eyes will forget but they never will
never...
ever...
https://www.discogs.com/Microwave-Prince-Volume-3/release/32837
// ========================================================
*/
