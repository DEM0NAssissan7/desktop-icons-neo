# History of versions #

* Version 0.12.0
      * Don't fail if there is no TEMPLATES folder
      * Support Ctrl+A for 'select all'
      * Use "Home" as the name of the user's personal folder
      * Show mounted drives in the desktop
      * Re-read the desktop on error
      * Custom icons support
      * Detect changes in the size of the working area
      * Preserves the drop place for remote places
      * Better detection for focus loss

* Version 0.11.0 (2020/04/17)
      * Copy files instead of move when using DnD into another drive
      * Removed flicker when a file is created or removed
      * Fix DnD for Chrome and other programs
      * Template support
      * Allow to choose the align corner for the icons
      * Added "Select all" option
      * Added support for preview
      * Creates folders in the place where the mouse cursor is

* Version 0.10.0 (2020/02/22)
      * Added 'tiny' icon size
      * Doesn't allow to use an existing name when renaming or creating a new folder
      * Fixed the DnD positioning (finally)

* Version 0.9.1 (2020/02/06)
      * Now "Delete permanently" works again

* Version 0.9.0 (2020/01/31)
      * Fix bug that prevented it to work with Gnome Shell 3.30

* Version 0.8.0 (2020/01/19)
      * Fix memory leak when using the rubber band too fast
      * Add finally full support for multimonitor and HiDPI combined
      * Better precision in DnD

* Version 0.7.0 (2019/12/09)
      * Don't show ".desktop" in enabled .desktop files
      * Appearance more consistent with Nautilus
      * Allows to permanently delete files
      * When clicking on a text script, honors "executable-text-activation" setting and, if set, asks what to do
      * Honors "show-image-thumbnails" setting
      * .desktop files are now launched with the $HOME folder as the current folder
      * Allows to run script files with blank spaces in the file name
      * Shows an error if Nautilus is not available in the system
      * Shows an error if a file or folder can't be permanently deleted
      * Added note about configuration

* Version 0.6.0 (2019/10/29)
      * Fix icon distribution in the desktop
      * Show the "Name" field in the .desktop files
      * Better wrap of the names
      * Show a tooltip with the filename
      * Show a hand mouse cursor on "single click" policy
      * Add "delete permanently" option
      * Shift + Delete do "delete permanently"
      * Better detection of screen size change
      * Show symlink emblem also in .desktop files and in files with preview
      * Fix "symlink in all icons" bug
      * Ensure that all the emblems fit in the icon

* Version 0.5.0 (2019/10/15)
      * Fix right-click menu in trash not showing sometimes
      * Fix opening a file during New folder operation
      * Changed license to GPLv3 only

* Version 0.4.0 (2019/10/04)
      * Fix Drag'n'Drop in some special cases
      * Don't relaunch the desktop process when disabling and enabling fast
      * Temporary fix for X11 size

* Version 0.3.0 (2019/09/17)
      * Separate Wayland and X11 paths
      * When a file is dropped from another window, it is done at the cursor
      * Fixed bug when dragging several files into a Nautilus window

* Version 0.2.0 (2019/08/19)
      * Shows the full filename if selected
      * Use theme color for selections
      * Sends debug info to the journal
      * Now kills fine old, unneeded processes
      * Allows to launch the desktop app as standalone
      * Ensures that the desktop is kept at background when switching workspaces
      * Honors the Scale value (for retina-like monitors)
      * Hotkeys
      * Check if the desktop folder is writable by others
      * Now the settings window doesn't block the icons
      * Don't show hidden files

* Version 0.1.0 (2019/08/13)
      * First semi-working version version
      * Has everything supported by Desktop Icons, plus Drag'n'Drop
