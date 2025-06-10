<img src="https://raw.githubusercontent.com/christiet/obsidian-bookmark-plus/main/images/preview.jpg" alt="Preview">

# ⚡ Bookmark tab into Obsidian.
#### This extension adds a button to the address bar that allows users to create a "Bookmark" of their current tab into a specified document in Obsidian.

##### Fetches the Website Description if one is provided in the Head of HTML.

# 📃 Bookmark Example
> ## Kavita #self-hosted
> - *Lighting fast with a slick design, Kavita is a rocket fueled self-hosted digital library which supports a vast array of file formats. Install to start reading and share your server with your friends. book reader, self hosted, manga, comics, free, manhwa, e readers, electronic book readers, digital book reader, cartoon*
> - https://www.kavitareader.com/

## 📖 How to use 

1. Install the following Obsidian plugin:
   1. [**Obsidian Advanced URI**](https://github.com/Vinzent03/obsidian-advanced-uri)

2. Install the Extension from the browser extension store

3. Open **Add-ons Manager** or **Extensions** and click on "**Obsidian Bookmarks Plus**"
4. Click on Options in the menu
   * Fill out the **Vault name** - e.g. Obsidian Vault
   * Add values to **Document Path**. - you can have multiple paths, seperated by a return. Example paths could be Clippings/Bookmarks or Technology/Links
   _note that the target location must exist before you trying to use it_
5. Optionally add a template for the link format. This is basic markdown and the available options are:
   * title, description, tags, url
   * Example templates:
   ```
   default:
   ## {title} {tags}\n- *{description}*\n- {url}
   
   notion importer format:
   \n> [!info] {title} {tags}\n> {description}\n> {url}\n>
   ```
   BE WARNED:  There is no validation of templates, so don't do anything you don't understand!
6. Go on a **Website** you want to bookmark and click on the **Bookmark button** in the **Address bar**.

## Troubleshooting
If you don't get a link added, check the following:
1. Obsidian links are allowed - sometimes the popup for allowing links to be opened in Obsidian is hidden.
2. Check the path of your links file is correct. 

## 🍀 Supporters

**[!["Buy Patrik A Ramen"](https://raw.githubusercontent.com/patrikzudel/patrikzudel/main/ramen.png)](https://www.buymeacoffee.com/patrikzero)**

> If you like this project and would like to support it, feel free to buy Patrik a ramen! 🍜🍜🍜 It was his original plug-in that gave me the launchpad for this one.

> Or **Paypal:**

**[!["Buy Patrik A Ramen"](https://raw.githubusercontent.com/patrikzudel/patrikzudel/main/ramenpaypal.png)](https://ko-fi.com/patrikzudel)**


## ⌨️ Build
> `web-ext build --ignore-files ./images`

## ❤ Credits

- [ObsidianClip](https://github.com/ClarkAllen1556/obsidian_clip/tree/main) (Obsidian Clip by ClarkAllen1556)
- [Bookmarks-For-Obsidian](https://github.com/abhn/Bookmarks-For-Obsidian/tree/main) (Bookmarks-For-Obsidian by abhn)
- [PhosphorIcons](https://phosphoricons.com/) (Original logo and icon)
- [Patrik Žúdel](https://github.com/patrikzudel/firefox-obsidian-bookmark) - the original plugin that this is based on.
---

💻 by [Tony Christie](https://github.com/christiet)
