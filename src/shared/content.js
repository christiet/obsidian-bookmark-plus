// Content script to extract page metadata
// Runs in page context, no CORS issues

// DIAGNOSTIC: Log immediately when script loads
debug("Content Script: Script loaded on", window.location.href);
debug("Content Script: Debug function available");

// DIAGNOSTIC: Test browser API availability
if (typeof browser === 'undefined') {
    debug("Content Script: ERROR - browser API not available");
} else {
    debug("Content Script: browser API available");
}

// DIAGNOSTIC: Test runtime availability
if (!browser.runtime) {
    debug("Content Script: ERROR - browser.runtime not available");
} else {
    debug("Content Script: browser.runtime available");
}

async function getPageMetadata() {
    debug("Content script: Getting page metadata");

    const metadata = {
        title: document.title,
        url: window.location.href,
        description: "",
        keywords: "",
        author: "",
        "og:title": "",
        "og:description": "", 
        "og:image": "",
        "og:site_name": "",
        "og:type": "",
        favicon: "",
        canonical: ""
    };

    // Basic meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metadata.description = metaDescription.getAttribute("content") || "";
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
        metadata.keywords = metaKeywords.getAttribute("content") || "";
    }

    const metaAuthor = document.querySelector('meta[name="author"]');
    if (metaAuthor) {
        metadata.author = metaAuthor.getAttribute("content") || "";
    }

    // Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        metadata["og:title"] = ogTitle.getAttribute("content") || "";
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
        metadata["og:description"] = ogDescription.getAttribute("content") || "";
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
        metadata["og:image"] = ogImage.getAttribute("content") || "";
    }

    const ogSiteName = document.querySelector('meta[property="og:site_name"]');
    if (ogSiteName) {
        metadata["og:site_name"] = ogSiteName.getAttribute("content") || "";
    }

    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) {
        metadata["og:type"] = ogType.getAttribute("content") || "";
    }

    // Favicon
    const favicon = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
    if (favicon) {
        metadata.favicon = favicon.getAttribute("href") || "";
    }

    // Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
        metadata.canonical = canonical.getAttribute("href") || "";
    }

    debug("Content script: Extracted metadata:", metadata);
    return metadata;
}

// DIAGNOSTIC: Enhanced message listener with error handling
browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    debug("Content Script: Received message:", request);

    if (request.action === "getMetadata") {
        try {
            const metadata = await getPageMetadata();
            debug("Content Script: Sending metadata:", metadata);
            return metadata;
        } catch (error) {
            debug("Content Script: ERROR getting metadata:", error.message);
            debug("Content Script: Error stack:", error.stack);
            return {
                title: document.title,
                url: window.location.href,
                description: "",
                error: error.message
            };
        }
    }
});

// DIAGNOSTIC: Test message sending capability
setTimeout(() => {
    debug("Content Script: Testing runtime.sendMessage capability...");
    try {
        browser.runtime.sendMessage({action: "diagnostic_ping", url: window.location.href})
            .then(() => {
                debug("Content Script: Diagnostic ping successful");
            })
            .catch((error) => {
                debug("Content Script: Diagnostic ping failed:", error.message);
            });
    } catch (error) {
        debug("Content Script: Cannot send diagnostic ping:", error.message);
    }
}, 1000);