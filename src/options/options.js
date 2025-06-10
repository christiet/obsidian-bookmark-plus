document
	.getElementById("obp_options")
	.addEventListener("submit", () => saveOptions());

browser.storage.local.get("obp_vault").then((resp) => {
	const { obp_vault } = resp;

	if (obp_vault !== undefined)
		document.getElementById("obp_vault").value =
			obp_vault;
});

browser.storage.local.get("obp_paths").then((resp) => {
	const { obp_paths} = resp;

	if (obp_paths!== undefined)
		document.getElementById("obp_paths").value = obp_paths;
});

browser.storage.local.get("obp_template").then((resp) => {
	const { obp_template } = resp;

	if (obp_template !== undefined) {
		document.getElementById("obp_template").value =
			obp_template;
	}
});

function saveOptions() {
	const vaultName = document.getElementById("obp_vault").value;
	const paths = document.getElementById("obp_paths").value;
	const template = document.getElementById("obp_template").value;

	browser.storage.local.set({ obp_vault: vaultName });
	browser.storage.local.set({ obp_paths: paths });
	browser.storage.local.set({ obp_template: template });
}
