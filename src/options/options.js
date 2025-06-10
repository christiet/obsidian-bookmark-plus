// Load vault name with default
browser.storage.local.get("obp_vault").then((resp) => {
	const { obp_vault } = resp;
	const vaultValue = obp_vault || "Obsidian Vault";
	document.getElementById("obp_vault").value = vaultValue;
});

browser.storage.local.get("obp_paths").then((resp) => {
	const { obp_paths } = resp;
	if (obp_paths !== undefined)
		document.getElementById("obp_paths").value = obp_paths;
});

browser.storage.local.get("obp_template").then((resp) => {
	const { obp_template } = resp;
	if (obp_template !== undefined) {
		document.getElementById("obp_template").value = obp_template;
	}
});

browser.storage.local.get("obp_debug").then((resp) => {
	const { obp_debug } = resp;
	document.getElementById("obp_debug").checked = obp_debug || false;
});

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

// Auto-save on changes
document.getElementById("obp_vault").addEventListener("input", saveOptions);
document.getElementById("obp_paths").addEventListener("input", saveOptions);
document.getElementById("obp_template").addEventListener("input", saveOptions);
document.getElementById("obp_debug").addEventListener("change", saveOptions);
