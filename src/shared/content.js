// Content script to extract page metadata
// Runs in page context, no CORS issues

async function getPageMetadata() {
    debug("Content script: Getting page metadata");

    const metadata = {
        title: document.title,
        url: window.location.href,
        description: ""
    };

    // Get meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metadata.description = metaDescription.getAttribute("content") || "";
        debug("Content script: Found meta description:", metadata.description);
    } else {
        debug("Content script: No meta description found");
    }

    // Could add more metadata here in future:
    // - favicon: document.querySelector('link[rel="icon"]')?.href
    // - og:image: document.querySelector('meta[property="og:image"]')?.content
    // - keywords: document.querySelector('meta[name="keywords"]')?.content

    return metadata;
}

// Listen for messages from popup
browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    debug("Content script: Received message:", request);

    if (request.action === "getMetadata") {
        try {
            const metadata = await getPageMetadata();
            debug("Content script: Sending metadata:", metadata);
            return metadata;
        } catch (error) {
            console.error("Content script: Error getting metadata:", error);
            return {
                title: document.title,
                url: window.location.href,
                description: ""
            };
        }
    }
});