/* DING: Desktop Icons New Generation for GNOME Shell
 *
 * Copyright (C) 2019 Sergio Costas (rastersoft@gmail.com)
 * Based on code original (C) Carlos Soriano
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const DBusUtils = imports.dbusUtils;
const DesktopIconsUtil = imports.desktopIconsUtil;
const Gettext = imports.gettext.domain('ding');

const _ = Gettext.gettext;

var AskRenamePopup = class {

    constructor(fileItem) {

        this._desktopPath = GLib.get_user_special_dir(GLib.UserDirectory.DIRECTORY_DESKTOP);
        this._fileItem = fileItem;
        this._popover = new Gtk.Popover({relative_to: fileItem.actor,
                                         modal: true});
        let contentBox = new Gtk.Grid({row_spacing: 6,
                                       column_spacing: 6,
                                       margin: 10});
        this._popover.add(contentBox);
        let label = new Gtk.Label({label: fileItem.isDirectory ? _("Folder name") : _("File name"),
                                   justify: Gtk.Justification.LEFT,
                                   halign: Gtk.Align.START});
        contentBox.attach(label, 0, 0, 2, 1);
        this._textArea = new Gtk.Entry();
        this._textArea.text = fileItem.fileName;
        contentBox.attach(this._textArea, 0, 1, 1, 1);
        this._button = new Gtk.Button({label: _("Rename")});
        contentBox.attach(this._button, 1, 1, 1, 1);
        this._button.connect('clicked', () => {
            this._do_rename();
        });
        this._textArea.connect('changed', () => {
            this._validate();
        });
        this._textArea.connect('activate', () => {
            if (this._button.sensitive) {
                this._do_rename();
            }
        });
        this._textArea.set_can_default(true);
        this._popover.set_default_widget(this._textArea);
        this._button.get_style_context().add_class("suggested-action");
        this._popover.show_all();
        this._validate();
        this._textArea.grab_focus_without_selecting();
        this._textArea.select_region(0, DesktopIconsUtil.getFileExtensionOffset(fileItem.fileName, fileItem.isDirectory));
    }

    _validate() {
        let text = this._textArea.text;
        let final_path = this._desktopPath + '/' + text;
        let final_file = Gio.File.new_for_commandline_arg(final_path);
        if ((text == '') || (-1 != text.indexOf('/')) || (text == this._fileItem.fileName) || final_file.query_exists(null)) {
            this._button.sensitive = false;
        } else {
            this._button.sensitive = true;
        }
    }

    _do_rename() {
        DBusUtils.NautilusFileOperationsProxy.RenameFileRemote(this._fileItem.file.get_uri(),
                                                               this._textArea.text,
            (result, error) => {
                if (error)
                    throw new Error('Error renaming file: ' + error.message);
            }
        );
    }
};
