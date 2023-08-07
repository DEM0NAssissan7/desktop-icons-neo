#!/usr/bin/gjs

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

const GnomeDesktop = imports.gi.GnomeDesktop;
const Gio = imports.gi.Gio;

let thumbnailFactory = GnomeDesktop.DesktopThumbnailFactory.new(GnomeDesktop.DesktopThumbnailSize.LARGE);

let file = Gio.File.new_for_path(ARGV[0]);
let fileUri = file.get_uri();

let fileInfo = file.query_info('standard::content-type,time::modified', Gio.FileQueryInfoFlags.NONE, null);
let modifiedTime = fileInfo.get_attribute_uint64('time::modified');
let thumbnailPixbuf = thumbnailFactory.generate_thumbnail(fileUri, fileInfo.get_content_type());
if (thumbnailPixbuf == null)
    thumbnailFactory.create_failed_thumbnail(fileUri, modifiedTime);
else
    thumbnailFactory.save_thumbnail(thumbnailPixbuf, fileUri, modifiedTime);
