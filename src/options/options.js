// Default constants for maintenance
const DEFAULT_VAULT = "Obsidian Vault";
const DEFAULT_PATHS = "Bookmarks";
const DEFAULT_TEMPLATE = `\n> [!info] {title} {tags}\n> {description}\n> {url}\n>`;
const DEFAULT_DEBUG = false;

// Save debouncing
let saveTimeout;

function showSaveMessage() {
	const messageDiv = document.getElementById("save-message");
	messageDiv.textContent = "Settings saved";
	messageDiv.classList.add("show");
	
	// Hide after 2 seconds
	setTimeout(() => {
		messageDiv.classList.remove("show");
	}, 2000);
}

function saveOptions() {
	const vaultName = document.getElementById("obp_vault").value;
	const paths = document.getElementById("obp_paths").value;
	const template = document.getElementById("obp_template").value;
	const debugEnabled = document.getElementById("obp_debug").checked;

	browser.storage.local.set({ obp_vault: vaultName });
	browser.storage.local.set({ obp_paths: paths });
	browser.storage.local.set({ obp_template: template });
	browser.storage.local.set({ obp_debug: debugEnabled });
}

function debouncedSave() {
	// Save immediately
	saveOptions();
	
	// Debounce save message - clear previous timeout and set new one
	clearTimeout(saveTimeout);
	saveTimeout = setTimeout(() => {
		showSaveMessage();
	}, 1000); // Show save message 1 second after last change
}

// Load vault name with default
browser.storage.local.get("obp_vault").then((resp) => {
	const { obp_vault } = resp;
	const vaultValue = obp_vault || DEFAULT_VAULT;
	document.getElementById("obp_vault").value = vaultValue;
	
	// If no value was stored, save the default
	if (!obp_vault) {
		browser.storage.local.set({ obp_vault: DEFAULT_VAULT });
	}
});

browser.storage.local.get("obp_paths").then((resp) => {
	const { obp_paths } = resp;
	const pathsValue = obp_paths || DEFAULT_PATHS;
	document.getElementById("obp_paths").value = pathsValue;
	
	// If no value was stored, save the default
	if (obp_paths === undefined) {
		browser.storage.local.set({ obp_paths: DEFAULT_PATHS });
	}
});

browser.storage.local.get("obp_template").then((resp) => {
	const { obp_template } = resp;
	const templateValue = obp_template || DEFAULT_TEMPLATE;
	document.getElementById("obp_template").value = templateValue;
	
	// If no value was stored, save the default
	if (obp_template === undefined) {
		browser.storage.local.set({ obp_template: DEFAULT_TEMPLATE });
	}
});

browser.storage.local.get("obp_debug").then((resp) => {
	const { obp_debug } = resp;
	const debugValue = obp_debug !== undefined ? obp_debug : DEFAULT_DEBUG;
	document.getElementById("obp_debug").checked = debugValue;
	
	// If no value was stored, save the default
	if (obp_debug === undefined) {
		browser.storage.local.set({ obp_debug: DEFAULT_DEBUG });
	}
});

// Auto-save on changes with debounced save message
document.getElementById("obp_vault").addEventListener("input", debouncedSave);
document.getElementById("obp_paths").addEventListener("input", debouncedSave);
document.getElementById("obp_template").addEventListener("input", debouncedSave);
document.getElementById("obp_debug").addEventListener("change", debouncedSave);