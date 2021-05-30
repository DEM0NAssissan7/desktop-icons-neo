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

const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Meta = imports.gi.Meta;
const St = imports.gi.St;

const Main = imports.ui.main;

const ExtensionUtils = imports.misc.extensionUtils;
const Config = imports.misc.config;
const Mainloop = imports.mainloop;

const Me = ExtensionUtils.getCurrentExtension();
const EmulateX11 = Me.imports.emulateX11WindowType;

// This object will contain all the global variables
let data = {};

function init() {
    data.isEnabled = false;
    data.launchDesktopId = 0;
    data.currentProcess = null;
    data.reloadTime = 100;
    data.x11Manager = new EmulateX11.EmulateX11WindowType();
    // Ensure that there aren't "rogue" processes
    doKillAllOldDesktopProcesses();
}


/**
 * Enables the extension
 */
function enable() {
    // If the desktop is still starting up, we wait until it is ready
    if (Main.layoutManager._startingUp) {
        data.startupPreparedId = Main.layoutManager.connect('startup-complete', () => { innerEnable(true); });
    } else {
        innerEnable(false);
    }
}

/**
 * The true code that configures everything and launches the desktop program
 */
function innerEnable(removeId) {

    if (removeId) {
        Main.layoutManager.disconnect(data.startupPreparedId);
        data.startupPreparedId = null;
    }

    // under X11 we don't need to cheat, so only do all this under wayland
    if (Meta.is_wayland_compositor()) {
        data.x11Manager.enable();
    }

    /*
     * If the desktop geometry changes (because a new monitor has been added, for example),
     * we kill the desktop program. It will be relaunched automatically with the new geometry,
     * thus adapting to it on-the-fly.
     */
    data.monitorsChangedId = Main.layoutManager.connect('monitors-changed', () => {
        reloadIfSizesChanged();
    });
    /*
     * Any change in the workareas must be detected too, for example if the used size
     * changes.
     */
    data.workareasChangedId = global.display.connect('workareas-changed', () => {
        reloadIfSizesChanged();
    });

    data.desktopCoordinates = [];

    /*
     * This callback allows to detect a change in the working area (like when changing the Zoom value)
     */
    data.sizeChangedId = global.window_manager.connect('size-changed', () => {
        reloadIfSizesChanged();
    });

    data.isEnabled = true;
    if (data.launchDesktopId) {
        GLib.source_remove(data.launchDesktopId);
    }
    launchDesktop();
}

/**
 * Disables the extension
 */
function disable() {

    data.isEnabled = false;
    killCurrentProcess();
    data.x11Manager.disable();

    // disconnect signals only if connected
    if (data.startupPreparedId) {
        Main.layoutManager.disconnect(data.startupPreparedId);
    }
    if (data.monitorsChangedId) {
        Main.layoutManager.disconnect(data.monitorsChangedId);
    }
    if (data.workareasChangedId) {
        global.display.disconnect(data.workareasChangedId);
    }
    if (data.sizeChangedId) {
        global.window_manager.disconnect(data.sizeChangedId);
    }
}

function reloadIfSizesChanged() {
    if (data.desktopCoordinates.length != Main.layoutManager.monitors.length) {
        killCurrentProcess();
        return;
    }
    for(let monitorIndex = 0; monitorIndex < Main.layoutManager.monitors.length; monitorIndex++) {
        let ws = global.workspace_manager.get_workspace_by_index(0);
        let area = ws.get_work_area_for_monitor(monitorIndex);
        let area2 = data.desktopCoordinates[monitorIndex];
        let scale = Main.layoutManager.monitors[monitorIndex].geometry_scale;
        if ((area.x != area2.x) ||
            (area.y != area2.y) ||
            (area.width != area2.width) ||
            (area.height != area2.height) ||
            (scale != area2.zoom)) {
            killCurrentProcess();
            return;
        }
    }
}

/**
 * Kills the current desktop program
 */
function killCurrentProcess() {
    // If a reload was pending, kill it and program a new reload
    if (data.launchDesktopId) {
        GLib.source_remove(data.launchDesktopId);
        data.launchDesktopId = 0;
        if (data.isEnabled) {
            data.launchDesktopId = Mainloop.timeout_add(data.reloadTime, () => {
                data.launchDesktopId = 0;
                launchDesktop();
                return false;
            });
        }
    }

    // kill the desktop program. It will be reloaded automatically.
    if (data.currentProcess && data.currentProcess.subprocess) {
        data.currentProcess.subprocess.send_signal(15);
    }
}

/**
 * This function checks all the processes in the system and kills those
 * that are a desktop manager from the current user (but not others).
 * This allows to avoid having several ones in case gnome shell resets,
 * or other odd cases. It requires the /proc virtual filesystem, but
 * doesn't fail if it doesn't exist.
 */

function doKillAllOldDesktopProcesses() {

    let procFolder = Gio.File.new_for_path('/proc');
    if (!procFolder.query_exists(null)) {
        return;
    }

    let fileEnum = procFolder.enumerate_children('standard::*', Gio.FileQueryInfoFlags.NONE, null);
    let info;
    while ((info = fileEnum.next_file(null))) {
        let filename = info.get_name();
        if (!filename) {
            break;
        }
        let processPath = GLib.build_filenamev(['/proc', filename, 'cmdline']);
        let processUser = Gio.File.new_for_path(processPath);
        if (!processUser.query_exists(null)) {
            continue;
        }
        let [data, etag] = processUser.load_bytes(null);
        let contents = '';
        data = data.get_data();
        for (let i = 0; i < data.length; i++) {
            if (data[i] < 32) {
                contents += ' ';
            } else {
                contents += String.fromCharCode(data[i]);
            }
        }
        let path = 'gjs ' + GLib.build_filenamev([ExtensionUtils.getCurrentExtension().path, 'ding.js']);
        if (contents.startsWith(path)) {
            let proc = new Gio.Subprocess({argv: ['/bin/kill', filename]});
            proc.init(null);
            proc.wait(null);
        }
    }
}

/**
 * Launches the desktop program, passing to it the current desktop geometry for each monitor
 * and the path where it is stored. It also monitors it, to relaunch it in case it dies or is
 * killed. Finally, it reads STDOUT and STDERR and redirects them to the journal, to help to
 * debug it.
 */
function launchDesktop() {

    data.reloadTime = 100;
    let argv = [];
    argv.push(GLib.build_filenamev([ExtensionUtils.getCurrentExtension().path, 'ding.js']));
    // Specify that it must work as true desktop
    argv.push('-E');
    // The path. Allows the program to find translations, settings and modules.
    argv.push('-P');
    argv.push(ExtensionUtils.getCurrentExtension().path);

    let first = true;

    data.desktopCoordinates = [];
    argv.push('-M');
    argv.push(`${Main.layoutManager.primaryIndex}`);

    for(let monitorIndex = 0; monitorIndex < Main.layoutManager.monitors.length; monitorIndex++) {
        let ws = global.workspace_manager.get_workspace_by_index(0);
        let area = ws.get_work_area_for_monitor(monitorIndex);
        // send the working area of each monitor in the desktop
        argv.push('-D');
        let scale = Main.layoutManager.monitors[monitorIndex].geometry_scale;
        argv.push(`${area.x}:${area.y}:${area.width}:${area.height}:${scale}`);
        data.desktopCoordinates.push({x: area.x, y: area.y, width: area.width, height: area.height, zoom: scale})
        if (first || (area.x < data.minx)) {
            data.minx = area.x;
        }
        if (first || (area.y < data.miny)) {
            data.miny = area.y;
        }
        if (first || ((area.x + area.width) > data.maxx)) {
            data.maxx = area.x + area.width;
        }
        if (first || ((area.y + area.height) > data.maxy)) {
            data.maxy = area.y + area.height;
        }
        first = false;
    }

    data.currentProcess = new LaunchSubprocess(0, "DING", "-U");
    data.currentProcess.set_cwd(GLib.get_home_dir());
    data.currentProcess.spawnv(argv);
    data.x11Manager.set_wayland_client(data.currentProcess);

    /*
     * If the desktop process dies, wait 100ms and relaunch it, unless the exit status is different than
     * zero, in which case it will wait one second. This is done this way to avoid relaunching the desktop
     * too fast if it has a bug that makes it fail continuously, avoiding filling the journal too fast.
     */
    data.currentProcess.subprocess.wait_async(null, (obj, res) => {
        let b = obj.wait_finish(res);
        if (!data.currentProcess || obj !== data.currentProcess.subprocess) {
            return;
        }
        if (obj.get_if_exited()) {
            let retval = obj.get_exit_status();
            if (retval != 0) {
                data.reloadTime = 1000;
            }
        } else {
            data.reloadTime = 1000;
        }
        data.currentProcess = null;
        data.x11Manager.set_wayland_client(null);
        if (data.isEnabled) {
            if (data.launchDesktopId) {
                GLib.source_remove(data.launchDesktopId);
            }
            data.launchDesktopId = Mainloop.timeout_add(data.reloadTime, () => {
                data.launchDesktopId = 0;
                launchDesktop();
                return false;
            });
        }
    });
}

/**
 * This class encapsulates the code to launch a subprocess that can detect whether a window belongs to it
 * It only accepts to do it under Wayland, because under X11 there is no need to do these tricks
 *
 * It is compatible with https://gitlab.gnome.org/GNOME/mutter/merge_requests/754 to simplify the code
 *
 * @param {int} flags Flags for the SubprocessLauncher class
 * @param {string} process_id An string id for the debug output
 * @param {string} cmd_parameter A command line parameter to pass when running. It will be passed only under Wayland,
 *                          so, if this parameter isn't passed, the app can assume that it is running under X11.
 */
var LaunchSubprocess = class {

    constructor(flags, process_id, cmd_parameter) {
        this._process_id = process_id;
        this._cmd_parameter = cmd_parameter;
        this._UUID = null;
        this._flags = flags | Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_MERGE;
        this._launcher = new Gio.SubprocessLauncher({flags: this._flags});
        if (Meta.is_wayland_compositor()) {
            this._waylandClient = Meta.WaylandClient.new(this._launcher);
            if (Config.PACKAGE_VERSION == '3.38.0') {
                // workaround for bug in 3.38.0
                this._launcher.ref();
            }
        }
        this.subprocess = null;
        this.process_running = false;
    }

    spawnv(argv) {
        if (Meta.is_wayland_compositor()) {
            this.subprocess = this._waylandClient.spawnv(global.display, argv);
        } else {
            this.subprocess = this._launcher.spawnv(argv);
        }
        /* This is for GLib 2.68
        if (this._launcher.close) {
            this._launcher.close();
        }*/
        this._launcher = null;
        if (this.subprocess) {
                /*
                 * It reads STDOUT and STDERR and sends it to the journal using global.log(). This allows to
                 * have any error from the desktop app in the same journal than other extensions. Every line from
                 * the desktop program is prepended with the "process_id" parameter sent in the constructor.
                 */
            this.subprocess.communicate_utf8_async(null, null, (object, res) => {
                try {
                    let [d, stdout, stderr] = object.communicate_utf8_finish(res);
                    if (stdout.length != 0) {
                        global.log(`${this._process_id}: ${stdout}`);
                    }
                } catch(e) {
                    global.log(`${this._process_id}_Error: ${e}`);
                }
            });
            this.subprocess.wait_async(null, () => {
                this.process_running = false;
            });
            this.process_running = true;
        }
        return this.subprocess;
    }

    set_cwd(cwd) {
        this._launcher.set_cwd (cwd);
    }

    /**
     * Queries whether the passed window belongs to the launched subprocess or not.
     * @param {MetaWindow} window The window to check.
     */
    query_window_belongs_to (window) {
        if (!Meta.is_wayland_compositor()) {
            return false;
        }
        if (!this.process_running) {
            return false;
        }
        try {
            return (this._waylandClient.owns_window(window));
        } catch(e) {
            return false;
        }
    }

    show_in_window_list(window) {
        if (Meta.is_wayland_compositor() && this.process_running) {
            this._waylandClient.show_in_window_list(window);
        }
    }

    hide_from_window_list(window) {
        if (Meta.is_wayland_compositor() && this.process_running) {
            this._waylandClient.hide_from_window_list(window);
        }
    }
}
