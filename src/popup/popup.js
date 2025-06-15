async function clipPage(url, title, tags, description, vaultPath, metadata) {
	debug("clipPage called with:", {
		url,
		title,
		tags,
		description,
		vaultPath,
	});

	const { obp_vault } = await browser.storage.local.get("obp_vault");

	debug("Retrieved vault name:", obp_vault);

	if (!obp_vault || !vaultPath) {
		debug(
			"Missing settings - vault name:",
			obp_vault,
			"vault path:",
			vaultPath
		);
		browser.runtime.openOptionsPage();
		return;
	}

	const { obp_template } = await browser.storage.local.get("obp_template");
	debug("Retrieved template:", obp_template);

	const defaultTemplate = `\n> [!info] {title} {tags}\n> {description}\n> {url}\n>`;
	const bookmarkTemplate = obp_template || defaultTemplate;
	debug("Using template:", bookmarkTemplate);

	let str = bookmarkTemplate
		.replace("{title}", title)
		.replace("{url}", url)
		.replace("{description}", description)
		.replace("{tags}", tags)
		.replace(/\\n/g, "\n");

	// Add new metadata fields with fallbacks
	if (metadata) {
		str = str
			.replace("{keywords}", metadata.keywords || "")
			.replace("{author}", metadata.author || "")
			.replace("{og:title}", metadata["og:title"] || metadata.title || "")
			.replace("{og:description}", metadata["og:description"] || metadata.description || "")
			.replace("{og:image}", metadata["og:image"] || "")
			.replace("{og:site_name}", metadata["og:site_name"] || "")
			.replace("{og:type}", metadata["og:type"] || "")
			.replace("{favicon}", metadata.favicon || "")
			.replace("{canonical}", metadata.canonical || "");
	}
	// After all the template processing, add a newline
	str = str + '\n';
	debug("Processed bookmark string:", str);

	let newStr = encodeURIComponent(str);
	debug("Encoded string length:", newStr.length);

	const obsidianURI = `obsidian://advanced-uri?vault=${encodeURIComponent(
		obp_vault
	)}&filepath=${encodeURIComponent(vaultPath)}&data=${newStr}&mode=append`;
	debug("Generated Obsidian URI:", obsidianURI);

	try {
		const tab = await browser.tabs.create({ url: obsidianURI, active: false });
		debug("Created tab with ID:", tab.id);

		// Ask background script to close tab after delay
		browser.runtime.sendMessage({
			action: "closeTabAfterDelay",
			tabId: tab.id,
			delay: 2000,
		});

		debug("clipPage completed successfully");
		window.close();
	} catch (error) {
		console.error("Error creating tab:", error);
		window.close();
	}
}

async function loadDocumentPaths() {
	debug("loadDocumentPaths called");

	const { obp_paths } = await browser.storage.local.get("obp_paths");

	debug("Retrieved paths from storage:", obp_paths);

	if (!obp_paths) {
		debug("No document paths configured");
		return;
	}

	const paths = obp_paths
		.split("\n")
		.map((path) => path.trim())
		.filter((path) => path.length > 0);

	debug("Processed paths:", paths);

	const select = document.querySelector("#path-select");
	debug("Select element found:", !!select);

	// Clear existing options
	select.innerHTML = "";

	// Add each path as an option
	paths.forEach((path, index) => {
		debug(`Adding path ${index}:`, path);
		const option = document.createElement("option");
		option.value = path;
		option.textContent = path;
		select.appendChild(option);
	});

	// First path is selected by default
	if (paths.length > 0) {
		select.value = paths[0];
		debug("Set default path to:", paths[0]);
	}
}

window.addEventListener("DOMContentLoaded", async () => {
	debug("DOMContentLoaded event fired");

	let url, title;

	debug("Querying active tab...");
	await browser.tabs
		.query({ currentWindow: true, active: true })
		.then((tabs) => {
			url = tabs[0].url;
			title = tabs[0].title;
			debug("Got tab info - URL:", url, "Title:", title);
		}, console.error);

	let description = "";
	let metadata = null;
	document.querySelector("#description").placeholder = "Loading...";

	debug("Getting metadata from content script...");
	try {
		// Send message to content script to get metadata
		const response = await browser.tabs.sendMessage(
			(await browser.tabs.query({ currentWindow: true, active: true }))[0].id,
			{ action: "getMetadata" }
		);
		
		if (response) {
			metadata = response;
			description = response.description || "";
			debug("Got metadata from content script:", metadata);
		} else {
			debug("No metadata received from content script");
		}
	} catch (error) {
		console.error("Failed to get metadata from content script:", error);
		description = "";
	}

	document.querySelector("#description").placeholder = "No description...";
	document.querySelector("#description").value = description;
	document.querySelector("#title").value = title;
	debug("Set form values");

	debug("Loading document paths...");
	await loadDocumentPaths();

	// Check settings BEFORE setting up event listeners
	debug("Checking settings...");
	const { obp_vault } = await browser.storage.local.get("obp_vault");
	const { obp_paths } = await browser.storage.local.get("obp_paths");

	debug("Settings check - vault name:", obp_vault, "paths:", obp_paths);

	if (!obp_vault || !obp_paths) {
		debug("Settings missing! Opening options page...");
		browser.runtime.openOptionsPage();
		return; // Exit early, don't set up event listeners
	}

	debug("Settings OK, setting up event listeners...");

	// Only set up event listeners if settings are valid
	function addBookmarkToObsidian() {
		debug("Add bookmark button clicked");

		const tags = document.querySelector("#tags").value;
		const title = document.querySelector("#title").value;
		const desc = document.querySelector("#description").value;
		const selectedPath = document.querySelector("#path-select").value;

		debug("Form values:", { tags, title, desc, selectedPath });

		clipPage(url, title, tags, desc, selectedPath, metadata);
	}

	document
		.querySelector("#submit-bookmark")
		.addEventListener("click", addBookmarkToObsidian);

	document.querySelector("#tags").addEventListener("keyup", ({ key }) => {
		if (key === "Enter") {
			debug("Enter key pressed in tags field");
			addBookmarkToObsidian();
		}
	});

	debug("Event listeners set up successfully");
});