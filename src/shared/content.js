// Content script to extract page metadata
// Runs in page context, no CORS issues

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