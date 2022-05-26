Copyright 2021 Abdurahman Elmawi (cooper64doom@gmail.com)

# Goals for 2.0 (REMOVE BEFORE RELEASE)
* Port current Neo *newapi* tree into the latest DING version (as of May 26th 2022)
* Use/create a .diff file to make patching DING into Neo much easier
* Piggyback off of the hard working people who develop DING (but fully credit the project)

# Desktop Icons: Neo

### This project (Desktop Icons: Neo) is licensed under the GPL v3. To view the details of this license, visit https://www.gnu.org/licenses/gpl-3.0.html.

## What is Desktop Icons: Neo?

**Desktop Icons: Neo** is a desktop icons extension for GNOME. It is a fork of the [**Desktop Icons NG**](https://extensions.gnome.org/extension/2087/desktop-icons-ng-ding/) extension.

![Image of Desktop Icons: Neo](https://github.com/DEM0NAssissan7/desktop-icons-neo/blob/main/Desktop%20Icons:%20Neo.jpg)

## A few notable features include:
 
 * Heavily extensive icon and desktop customization
 * Performance improvements
 * General polish and bug fixes

Feel free to to fix/report any bugs you notice!

## Current Project version

Desktop Icons: Neo - Version 2.0 BETA 3

## System Requirements

* GNOME Shell >= 3.38
* Nautilus >= 3.38

## Setting permissions

If you are pulling directly from the master branch, you must set the permissions by doing these commands:

**GITHUB USERS: If you do not do this, it will FAIL completely. Permissions must be set.**

```bash
chmod +x set-permissions.sh
./set-permissions.sh
```

## Manual installation (easy)

The easiest way to install the extension (for development and local use) is by running:
```bash
./local_install.sh
```
It automatically performs  the commands from the next section.

It is recommended to delete the destination folder ($HOME/.local/share/gnome-shell/extensions/desktopicons-neo@darkdemon) before doing this to ensure that no old data is kept.

## Build with Meson

The project uses a build system called ['Meson'](https://mesonbuild.com/). You can install
in most Linux distributions as "meson". You also need "ninja" and xgettext, both of which are automatically installed with the 'meson' package in most package managers.

```bash
meson --prefix=$HOME/.local/ --localedir=share/gnome-shell/extensions/desktopicons-neo@darkdemon/locale .build
ninja -C .build install
```

It's possible to read more information in the Meson docs to tweak the configuration if needed.

## Export extension ZIP file for extensions.gnome.org

To create a ZIP file of the project certified for use on extensions.gnome.org, run:

```bash
./export-zip.sh
```

This will create the file `desktopicons-neo@darkdemon.zip` containing the extension. The zip file follows the rules for publishing at extensions.gnome.org.

## Source code and contacting the author

Abdurahman Elmawi

https://github.com/DEM0NAssissan7/desktop-icons-neo/

cooper64doom@gmail.com
