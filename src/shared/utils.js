/**
* Debug logging function that respects user preference
* @param {...any} args - Arguments to log (same as console.log)
*/
async function debug(...args) {
   const { obp_debug } = await browser.storage.local.get('obp_debug');
   
   if (obp_debug) {
       console.log(...args);
   }
}


window.debug = debug;
