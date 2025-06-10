debug("Background script loaded");

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    debug("Background received message:", message);
    
    if (message.action === "closeTabAfterDelay") {
        debug("Setting timeout to close tab:", message.tabId);
        setTimeout(async () => {
            try {
                debug("Attempting to close tab:", message.tabId);
                await browser.tabs.remove(message.tabId);
                debug("Background: Closed tab", message.tabId);
            } catch (error) {
                console.log("Background: Error closing tab", error);
            }
        }, message.delay || 2000);
    }
});