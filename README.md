# Desktop Icons: Neo

## What is Desktop Icons: Neo?

**Desktop Icons: Neo** is a desktop icons extension for GNOME. It is a fork of the [**Desktop Icons NG**](https://extensions.gnome.org/extension/2087/desktop-icons-ng-ding/) extension.

![Image of Desktop Icons: Neo](https://github.com/DEM0NAssissan7/desktop-icons-neo/blob/main/Desktop%20Icons:%20Neo.jpg)

## A few notable features include:
 
 * Heavily extensive icon and desktop customization
 * Performance improvements
 * General polish and bug fixes

Keep in mind that the extension is still an early beta and still has many bugs. Feel free to try to fix them and submit your code here!

## Current version

Version 1.2

## Requirements

* GNOME Shell >= 3.38
* Nautilus >= 3.38

## Setting permissions

If you are pulling directly from the master branch, you must set the permissions by doing these commands:

**GITHUB USERS: If you do not do this, it will FAIL completely. Permissions must be set.**

```bash
chmod +x set-permissions.sh
./set-permissions.sh
```

## Manual installation

The easiest way to install the extension (for development and local use) is by running:
```bash
./local_install.sh
```
It automatically performs  the commands from the next section.

It is recommended to delete the destination folder ($HOME/.local/share/gnome-shell/extensions/desktopicons-neo@darkdemon) before doing this to ensure that no old data is kept.

## Build with Meson

The project uses a build system called [Meson](https://mesonbuild.com/). You can install
in most Linux distributions as "meson". You also need "ninja" and xgettext, both of which are automatically installed with the 'meson' package in most package managers.

```bash
meson --prefix=$HOME/.local/ --localedir=share/gnome-shell/extensions/desktopicons-neo@darkdemon/locale .build
ninja -C .build install
```

It's possible to read more information in the Meson docs to tweak the configuration if needed.

## Export extension ZIP file for extensions.gnome.org

To create a ZIP file with the extension, run:

```bash
./export-zip.sh
```

This will create the file `desktopicons-neo@darkdemon.zip` containing the extension. The zip file follows the rules for publishing at extensions.gnome.org.

## Source code and contacting the author

Abdurahman Elmawi

https://github.com/DEM0NAssissan7/desktop-icons-neo/

cooper64doom@gmail.com
