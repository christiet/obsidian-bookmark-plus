// Unified background script that works in both Firefox (background page) and Chrome (service worker)

// Detect if we're in a service worker (Chrome/Edge) vs background page (Firefox)
const isServiceWorker = typeof importScripts === 'function';

if (isServiceWorker) {
    // Chrome/Edge service worker - import scripts but handle window references
    try {
        // Import browser-polyfill first
        importScripts('/assets/browser-polyfill.min.js');
        
        // Provide a global object that utils.js can attach to instead of window
        self.window = self; // Make window reference work in service worker
        
        // Now import utils.js
        importScripts('/src/shared/utils.js');
    } catch (error) {
        console.error("Failed to import scripts:", error);
    }
} else {
    // Firefox background page - scripts are already loaded via manifest
    // No action needed, browser-polyfill and utils.js are already available
}

// DIAGNOSTIC: Log background script initialization
debug("Background Script: Initializing...");
debug("Background Script: Environment:", isServiceWorker ? "Service Worker" : "Background Page");

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    debug("Background Script: Received message:", message, "from sender:", sender);
    
    // DIAGNOSTIC: Handle diagnostic ping
    if (message.action === "diagnostic_ping") {
        debug("Background Script: Received diagnostic ping from:", message.url);
        return Promise.resolve({status: "pong"});
    }
    
    if (message.action === "closeTabAfterDelay") {
        debug("Setting timeout to close tab:", message.tabId);
        setTimeout(async () => {
            try {
                debug("Attempting to close tab:", message.tabId);
                
                // Check if user has approved protocol handler before
                const { obp_protocol_approved } = await browser.storage.local.get('obp_protocol_approved');
                debug("Protocol handler previously approved:", !!obp_protocol_approved);
                
                if (!obp_protocol_approved) {
                    debug("First time user - leaving tab open and setting approval flag");
                    // Set flag for future bookmarks
                    await browser.storage.local.set({ obp_protocol_approved: true });
                    debug("Protocol approval flag set - future tabs will auto-close");
                } else {
                    debug("Returning user - safe to close tab quickly");
                    await browser.tabs.remove(message.tabId);
                    debug("Background: Closed tab", message.tabId);
                }
            } catch (error) {
                console.error("Background Script: Tab could not be accessed or closed:", error);
                debug("Tab could not be accessed or closed:", error);
            }
        }, message.delay || 1000);
    }
});

// DIAGNOSTIC: Log background script ready
debug("Background Script: Ready and listening for messages");