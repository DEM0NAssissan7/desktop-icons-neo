Copyright 2021 Abdurahman Elmawi (cooper64doom@gmail.com)

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

Desktop Icons: Neo - Version 1.4.1 LTS

You are currently on the legacy branch. This is the version of the extension that uses older APIs that will work with older versions of GNOME. You would want to use this version if you use a distrobution like Ubuntu 20.04 that uses GNOME Shell 3.36. The main branch will not work as intended with that version of GNOME, so you can use this branch instead.

## Requirements

* GNOME Shell >= 3.32
* Nautilus >= 3.32

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
