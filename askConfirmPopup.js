/* LICENSE INFORMATION
 * 
 * Desktop Icons: Neo - A desktop icons extension for GNOME with numerous features, 
 * customizations, and optimizations.
 * 
 * Copyright 2021 Abdurahman Elmawi (cooper64doom@gmail.com)
 * 
 * This project is based on Desktop Icons NG (https://gitlab.com/rastersoft/desktop-icons-ng),
 * a desktop icons extension for GNOME licensed under the GPL v3.
 * 
 * This project is free and open source software as described in the GPL v3.
 * 
 * This project (Desktop Icons: Neo) is licensed under the GPL v3. To view the details of this license, 
 * visit https://www.gnu.org/licenses/gpl-3.0.html for the necessary information
 * regarding this project's license.
 */

const Gtk = imports.gi.Gtk;
const Pango = imports.gi.Pango;
const Gettext = imports.gettext.domain('desktopicons-neo');

const _ = Gettext.gettext;

var AskConfirmPopup = class {

    constructor(text, secondaryText, parentWindow) {

        this._window = new Gtk.MessageDialog({window_position: Gtk.WindowPosition.CENTER_ON_PARENT,
                                              transient_for: parentWindow,
                                              message_type: Gtk.MessageType.WARNING,
                                              buttons: Gtk.ButtonsType.NONE,
                                              text: text,
                                              secondary_text: secondaryText});
        this._window.add_button(_("Cancel"), Gtk.ResponseType.CANCEL);
        let deleteButton = this._window.add_button(_("Delete"), Gtk.ResponseType.OK);
        deleteButton.get_style_context().add_class("destructive-action");
    }

    run() {
        this._window.show_all();
        let retval = this._window.run();
        this._window.hide();
        if (retval == Gtk.ResponseType.OK) {
            return true;
        } else {
            return false;
        }
    }
};
