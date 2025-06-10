async function clipPage(url, title, tags, description, vaultPath) {
	console.log("clipPage called with:", {
		url,
		title,
		tags,
		description,
		vaultPath,
	});

	const { obp_vault } = await browser.storage.local.get("obp_vault");

	console.log("Retrieved vault name:", obp_vault);

	if (!obp_vault || !vaultPath) {
		console.log(
			"Missing settings - vault name:",
			obp_vault,
			"vault path:",
			vaultPath
		);
		browser.runtime.openOptionsPage();
		return;
	}

	const { obp_template } = await browser.storage.local.get("obp_template");
	console.log("Retrieved template:", obp_template);

	const defaultTemplate = `\n> [!info] {title} {tags}\n> {description}\n> {url}\n>`;
	const bookmarkTemplate = obp_template || defaultTemplate;
	console.log("Using template:", bookmarkTemplate);

	let str = bookmarkTemplate
		.replace("{title}", title)
		.replace("{url}", url)
		.replace("{description}", description)
		.replace("{tags}", tags)
		.replace(/\\n/g, "\n");
	console.log("Processed bookmark string:", str);

	let newStr = encodeURIComponent(str);
	console.log("Encoded string length:", newStr.length);

	const obsidianURI = `obsidian://advanced-uri?vault=${encodeURIComponent(
		obp_vault
	)}&filepath=${encodeURIComponent(vaultPath)}&data=${newStr}&mode=append`;
	console.log("Generated Obsidian URI:", obsidianURI);

	try {
		const tab = await browser.tabs.create({ url: obsidianURI, active: false });
		console.log("Created tab with ID:", tab.id);

		Promise.resolve().then(() => {
			console.log("Attempting to close tab:", tab.id);
			browser.tabs.remove(tab.id).catch((error) => {
				console.log("Error closing tab:", error);
			});
			console.log("Closed tab:", tab.id);
		});
		console.log("clipPage completed successfully");
	} catch (error) {
		console.error("Error creating tab:", error);
	} finally {
		window.close();
	}
}

async function loadDocumentPaths() {
	console.log("loadDocumentPaths called");

	const { obp_paths } = await browser.storage.local.get("obp_paths");

	console.log("Retrieved paths from storage:", obp_paths);

	if (!obp_paths) {
		console.log("No document paths configured");
		return;
	}

	const paths = obp_paths
		.split("\n")
		.map((path) => path.trim())
		.filter((path) => path.length > 0);

	console.log("Processed paths:", paths);

	const select = document.querySelector("#path-select");
	console.log("Select element found:", !!select);

	// Clear existing options
	select.innerHTML = "";

	// Add each path as an option
	paths.forEach((path, index) => {
		console.log(`Adding path ${index}:`, path);
		const option = document.createElement("option");
		option.value = path;
		option.textContent = path;
		select.appendChild(option);
	});

	// First path is selected by default
	if (paths.length > 0) {
		select.value = paths[0];
		console.log("Set default path to:", paths[0]);
	}
}

window.addEventListener("DOMContentLoaded", async () => {
	console.log("DOMContentLoaded event fired");

	let url, title;

	console.log("Querying active tab...");
	await browser.tabs
		.query({ currentWindow: true, active: true })
		.then((tabs) => {
			url = tabs[0].url;
			title = tabs[0].title;
			console.log("Got tab info - URL:", url, "Title:", title);
		}, console.error);

	let description = "";
	document.querySelector("#description").placeholder = "Loading...";

	console.log("Fetching page content for description...");
	await fetch(url)
		.then((response) => response.text())
		.then((html_string) => {
			let parser = new DOMParser();
			let doc = parser.parseFromString(html_string, "text/html");
			let metaDescription = doc.querySelector('meta[name="description"]');
			if (metaDescription) {
				description = metaDescription.getAttribute("content");
				console.log("Found meta description:", description);
			} else {
				description = "";
				console.log("No meta description found");
			}
		})
		.catch((err) => {
			description = "";
			console.log("Failed to fetch page content:", err);
		});

	document.querySelector("#description").placeholder = "No description...";
	document.querySelector("#description").value = description;
	document.querySelector("#title").value = title;
	console.log("Set form values");

	console.log("Loading document paths...");
	await loadDocumentPaths();

	// Check settings BEFORE setting up event listeners
	console.log("Checking settings...");
	const { obp_vault } = await browser.storage.local.get("obp_vault");
	const { obp_paths } = await browser.storage.local.get("obp_paths");

	console.log("Settings check - vault name:", obp_vault, "paths:", obp_paths);

	if (!obp_vault || !obp_paths) {
		console.log("Settings missing! Opening options page...");
		browser.runtime.openOptionsPage();
		return; // Exit early, don't set up event listeners
	}

	console.log("Settings OK, setting up event listeners...");

	// Only set up event listeners if settings are valid
	function addBookmarkToObsidian() {
		console.log("Add bookmark button clicked");

		const tags = document.querySelector("#tags").value;
		const title = document.querySelector("#title").value;
		const desc = document.querySelector("#description").value;
		const selectedPath = document.querySelector("#path-select").value;

		console.log("Form values:", { tags, title, desc, selectedPath });

		clipPage(url, title, tags, desc, selectedPath);
	}

	document
		.querySelector("#submit-bookmark")
		.addEventListener("click", addBookmarkToObsidian);

	document.querySelector("#tags").addEventListener("keyup", ({ key }) => {
		if (key === "Enter") {
			console.log("Enter key pressed in tags field");
			addBookmarkToObsidian();
		}
	});

	console.log("Event listeners set up successfully");
});
