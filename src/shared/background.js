debug("Background script loaded");

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    debug("Background received message:", message);
    
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
                debug("Tab could not be accessed or closed:", error);
            }
        }, message.delay || 1000);
    }
});