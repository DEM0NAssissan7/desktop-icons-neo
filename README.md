# Desktop Icons: Neo

![Desktop Icons: Neo picture](https://github.com/DEM0NAssissan7/desktop-icons-neo/blob/main/Desktop%20Icons:%20Neo.jpg)

## What is Desktop Icons: Neo?

**Desktop Icons: Neo** is an extension for GNOME. It is a fork of the **Desktop Icons NG** extension. It comes with a large host of new features, customizations, and bug fixes.


 * Customizable icon shapes
 * Fixed many many bugs
 * Performance improvements
 * General polish

Keep in mind that the extension is still an early beta and has many bugs. We try our hardest to fix every one.

## Current version

Version 1.1

## Requirements

* GNOME Shell >= 3.38
* Nautilus >= 3.38

## TO-DO

* Use file events instead of refreshing the whole desktop
* Add support for dropping text or browser URIs

## Internal architecture

The code is divided in two parts: a classic Gtk program that manages the whole desktop
(comprised by the files ding.js, askNamePopup.js, createThumbnail.js, dbusUtils.js, desktopGrid.js,
desktopIconsUtil.js, desktopManager.js, enums.js, fileItem.js and preferences.js), and a little
extension (extension.js) that have these roles:

 * Launch the desktop program at startup and relaunch it if it dies
 * Identify the desktop windows and keep it at the bottom of the windows stack, in all desktops

This last part is paramount in Wayland systems, because there an application can't set its role
as freely as in X11.

Of course, to avoid breaking the security model of Wayland, it is paramount to ensure that no other
program can pose as DING. In old versions, the process for identifying the window was quite convoluted,
passing an UUID through STDIN and putting it in the window title. But since Gnome Shell 3.38 there is
a new API that allows to check whether a window belongs to an specific process launched from an
extension, which makes the code much cleaner and straightforward.

The extension monitors all 'map' signals, and when a window from the DING process previously
launched is mapped, it knows that it is the desktop window. It stores that window object, sends it to
the bottom of the stack, and connects to three signals:

* raised: it is called every time the window is sent to the front, so in the callback, the extension
sends it again to the bottom.
* position-changed: although the window doesn't have titlebar, it still is possible to move it using
Alt+F7, or pressing Super and dragging it with the mouse, so this callback returns the window to the
right possition every time the user tries to move it.
* unmanaged: called when the window disappears. It deletes the UUID, and waits for the desktop program
to be killed (it will be relaunched again by the extension, and, of course, a new UUID will be used).

It also monitors other signals to ensure that the desktop receives the focus only when there are no
other windows in the current desktop, and to keep the icons in the right screen, no matter if the
user changes to another virtual desktop.

The extension also intercepts three Gnome Shell system calls, in order to hide the desktop windows
from the tab switcher and the Activities mode. These are 'Meta.Display.get_tab_list()',
'Shell.Global.get_window_actors()', and 'Meta.Workspace.list_windows()'.

## Launching the Desktop Icons application stand-alone

It is possible to launch the desktop icons application in stand-alone mode to do debugging and
testing, but, of course, it will behave as a classic Gtk program: there will be a window with its
titlebar, and the background won't be transparent (it could be, but since the idea is to do debug,
it is better this way). To do so, just launch './ding.js' from the repository directory. If it can't
find the schemas file, just enter the 'schemas' folder and type 'glib-compile-schemas .', and retry.

It accepts the following command line parameters:

* -P: specifies the working path. If not set, it will default to './', which means that all the other
files must be in the current path.
* -D: specifies a monitor. It is followed by another parameter in the form: X:Y:W:H:Z being each letter
      a number with, respectively:
    * X: the X coordinate of this monitor
    * Y: the Y coordinate of this monitor
    * W: the width in pixels of this monitor
    * H: the height in pixels of this monitor
    * Z: the zoom value for this monitor
  you can set several -D parameters in the same command line, one for each monitor. A single window
  will be created for each monitor. If no -D parameter is specified, it will create a single monitor
  with a size of 1280x720 pixels.
* -M: specifies which monitor is the primary index, to add there any new file icon.


## Manual installation

The easiest way of installing DIneo is to run the `local_install.sh` script. It performs the build steps
specified in the next section.


## Build with Meson

The project uses a build system called [Meson](https://mesonbuild.com/). You can install
in most Linux distributions as "meson". You also need "ninja" and xgettext.

It's possible to read more information in the Meson docs to tweak the configuration if needed.

For a regular use and local development these are the steps to build the
project and install it:

```bash
meson --prefix=$HOME/.local/ --localedir=share/gnome-shell/extensions/desktopicons-neo@rastersoft.com/locale .build
ninja -C .build install
```
It is strongly recommended to delete the destination folder
($HOME/.local/share/gnome-shell/extensions/ding@rastersoft.com) before doing this, to ensure that no old
data is kept.

## Export extension ZIP file for extensions.gnome.org

To create a ZIP file with the extension, run:

```bash
./export-zip.sh
```

This will create the file `desktopicons-neo@rastersoft.com.zip` with the extension, following the rules for publishing at extensions.gnome.org.

## Source code and contacting the author

Sergio Costas  
https://github.com/DEM0NAssissan7/desktop-icons-neo/
rastersoft@gmail.com
