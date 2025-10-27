import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

// Cheat sheet data
const CHEAT_SHEETS = {
    'FVM': {
        title: 'Flutter Version Management (FVM)',
        categories: [
            {
                name: 'Installation & Setup',
                commands: [
                    { cmd: 'fvm install [version]', desc: 'Install a Flutter SDK version' },
                    { cmd: 'fvm install --setup', desc: 'Install and run Flutter setup' },
                ]
            },
            {
                name: 'Version Management',
                commands: [
                    { cmd: 'fvm use [version]', desc: 'Set Flutter version for project' },
                    { cmd: 'fvm use --force', desc: 'Set version, skip validation checks' },
                    { cmd: 'fvm use --pin', desc: 'Pin latest release of a channel' },
                    { cmd: 'fvm use --flavor [name]', desc: 'Set version for specific flavor' },
                    { cmd: 'fvm use --skip-setup', desc: 'Set version, skip SDK setup' },
                    { cmd: 'fvm use --skip-pub-get', desc: 'Set version, skip pub get' },
                    { cmd: 'fvm global [version]', desc: 'Set global Flutter version' },
                    { cmd: 'fvm global --force', desc: 'Set global, skip validation' },
                    { cmd: 'fvm global --unlink', desc: 'Remove global version setting' },
                ]
            },
            {
                name: 'Listing & Information',
                commands: [
                    { cmd: 'fvm list', desc: 'List installed Flutter versions' },
                    { cmd: 'fvm ls', desc: 'List installed versions (alias)' },
                    { cmd: 'fvm releases', desc: 'Show available Flutter releases' },
                    { cmd: 'fvm releases --channel beta', desc: 'Show beta channel releases' },
                    { cmd: 'fvm releases --channel dev', desc: 'Show dev channel releases' },
                    { cmd: 'fvm releases --channel all', desc: 'Show all channel releases' },
                ]
            },
            {
                name: 'Running Commands',
                commands: [
                    { cmd: 'fvm flutter [command]', desc: 'Run Flutter command with FVM' },
                    { cmd: 'fvm dart [command]', desc: 'Run Dart command with FVM' },
                    { cmd: 'fvm spawn [ver] [cmd]', desc: 'Run command with specific version' },
                    { cmd: 'fvm exec [command]', desc: 'Execute with project SDK' },
                    { cmd: 'fvm flavor [name] [cmd]', desc: 'Run with flavor-specific version' },
                ]
            },
            {
                name: 'Removal & Cleanup',
                commands: [
                    { cmd: 'fvm remove [version]', desc: 'Remove a Flutter version' },
                    { cmd: 'fvm remove --all', desc: 'Remove all cached versions' },
                    { cmd: 'fvm destroy', desc: 'Remove entire FVM cache' },
                    { cmd: 'fvm destroy --force', desc: 'Destroy cache without confirmation' },
                ]
            },
            {
                name: 'Configuration',
                commands: [
                    { cmd: 'fvm config', desc: 'View current configuration' },
                    { cmd: 'fvm config --cache-path [p]', desc: 'Set custom cache directory' },
                    { cmd: 'fvm config --flutter-url [url]', desc: 'Set Flutter repository URL' },
                    { cmd: 'fvm config --use-git-cache', desc: 'Enable Git cache' },
                    { cmd: 'fvm config --no-use-git-cache', desc: 'Disable Git cache' },
                    { cmd: 'fvm config --git-cache-path [p]', desc: 'Set Git cache directory' },
                    { cmd: 'fvm config --update-check', desc: 'Enable update notifications' },
                    { cmd: 'fvm config --no-update-check', desc: 'Disable update notifications' },
                ]
            },
            {
                name: 'Fork Management',
                commands: [
                    { cmd: 'fvm fork add [alias] [url]', desc: 'Add custom Flutter fork' },
                    { cmd: 'fvm fork remove [alias]', desc: 'Remove fork alias' },
                    { cmd: 'fvm fork list', desc: 'List configured forks' },
                ]
            },
            {
                name: 'Diagnostics',
                commands: [
                    { cmd: 'fvm doctor', desc: 'Show FVM environment diagnostics' },
                ]
            },
            {
                name: 'JSON API',
                commands: [
                    { cmd: 'fvm api list', desc: 'Get cached versions as JSON' },
                    { cmd: 'fvm api list --skip-size-calc', desc: 'List without size calculation' },
                    { cmd: 'fvm api releases', desc: 'Get available releases as JSON' },
                    { cmd: 'fvm api releases --limit [n]', desc: 'Limit release results' },
                    { cmd: 'fvm api releases --filter-ch [c]', desc: 'Filter releases by channel' },
                    { cmd: 'fvm api context', desc: 'Get FVM environment as JSON' },
                    { cmd: 'fvm api project', desc: 'Get project config as JSON' },
                    { cmd: 'fvm api project --path [p]', desc: 'Get config for specific path' },
                    { cmd: 'fvm api [cmd] --compress', desc: 'Output compact JSON' },
                ]
            }
        ]
    }
};

const FVMToolIndicator = GObject.registerClass(
class FVMToolIndicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'FVMT - FVM Tool');
        
        // Create panel button with text label for better visibility
        this.add_child(new St.Label({
            text: 'FVMT',
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'system-status-icon'
        }));
        
        // Connect to menu open event to refresh content
        this.menu.connect('open-state-changed', (menu, open) => {
            if (open) {
                this._showCheatSheet('FVM');
            }
        });
        
        // Show FVM cheat sheet initially
        this._showCheatSheet('FVM');
    }
    
    _getGlobalVersion() {
        try {
            // Try to read the FVM global version symlink
            const homeDir = GLib.get_home_dir();
            const globalPath = `${homeDir}/fvm/default`;
            
            // Check if the symlink exists
            const file = Gio.File.new_for_path(globalPath);
            if (file.query_exists(null)) {
                const symlinkInfo = file.query_info('standard::symlink-target', Gio.FileQueryInfoFlags.NONE, null);
                const target = symlinkInfo.get_symlink_target();
                
                // Extract version from symlink target (e.g., /home/user/fvm/versions/3.19.0 -> 3.19.0)
                if (target) {
                    const parts = target.split('/');
                    const version = parts[parts.length - 1];
                    return version;
                }
            }
        } catch (e) {
            // Silently fail if we can't read the global version
        }
        return null;
    }
    
    _getFlutterVersion(versionPath) {
        try {
            // Try to read the Flutter version from version file
            const versionFile = Gio.File.new_for_path(`${versionPath}/version`);
            if (versionFile.query_exists(null)) {
                const [success, contents] = versionFile.load_contents(null);
                if (success) {
                    const version = new TextDecoder().decode(contents).trim();
                    return version;
                }
            }
        } catch (e) {
            // Silently fail
        }
        return null;
    }
    
    _getInstalledVersions() {
        const versions = [];
        try {
            const homeDir = GLib.get_home_dir();
            const versionsPath = `${homeDir}/fvm/versions`;
            
            const versionsDir = Gio.File.new_for_path(versionsPath);
            if (versionsDir.query_exists(null)) {
                const enumerator = versionsDir.enumerate_children(
                    'standard::name,standard::type',
                    Gio.FileQueryInfoFlags.NONE,
                    null
                );
                
                let fileInfo;
                while ((fileInfo = enumerator.next_file(null)) !== null) {
                    if (fileInfo.get_file_type() === Gio.FileType.DIRECTORY) {
                        const versionName = fileInfo.get_name();
                        const versionPath = `${versionsPath}/${versionName}`;
                        const flutterVersion = this._getFlutterVersion(versionPath);
                        
                        // Store both the name and actual version
                        versions.push({
                            name: versionName,
                            version: flutterVersion
                        });
                    }
                }
            }
        } catch (e) {
            // Silently fail if we can't read versions
        }
        
        // Sort versions by name
        versions.sort((a, b) => a.name.localeCompare(b.name));
        return versions;
    }
    
    _showCheatSheet(tool) {
        const cheatSheet = CHEAT_SHEETS[tool];
        
        // Clear existing menu items
        this.menu.removeAll();
        
        // Add global version info at the top
        const globalVersion = this._getGlobalVersion();
        const installedVersions = this._getInstalledVersions();
        
        if (globalVersion) {
            // Find the actual Flutter version for the global
            const globalVersionObj = installedVersions.find(v => v.name === globalVersion);
            let displayText = `Global: ${globalVersion}`;
            if (globalVersionObj && globalVersionObj.version) {
                displayText = `Global: ${globalVersion} (${globalVersionObj.version})`;
            }
            
            const globalItem = new PopupMenu.PopupMenuItem(displayText);
            globalItem.reactive = false;
            this.menu.addMenuItem(globalItem);
        }
        
        // Add installed versions submenu
        if (installedVersions.length > 0) {
            const versionsSubmenu = new PopupMenu.PopupSubMenuMenuItem('Installed Versions');
            
            installedVersions.forEach(versionObj => {
                const isGlobal = versionObj.name === globalVersion;
                let displayText = versionObj.name;
                
                // Add actual version if available
                if (versionObj.version) {
                    displayText = `${versionObj.name} (${versionObj.version})`;
                }
                
                // Add checkmark for global version
                if (isGlobal) {
                    displayText += ' ✓';
                }
                
                const versionItem = new PopupMenu.PopupMenuItem(displayText);
                versionItem.reactive = false;
                versionsSubmenu.menu.addMenuItem(versionItem);
            });
            
            this.menu.addMenuItem(versionsSubmenu);
        }
        
        // Add separator
        if (globalVersion || installedVersions.length > 0) {
            this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        }
        
        // Add categorized commands as submenus
        cheatSheet.categories.forEach(category => {
            // Create submenu for each category
            const categorySubmenu = new PopupMenu.PopupSubMenuMenuItem(category.name);
            
            // Add commands in this category
            category.commands.forEach(command => {
                // Create container for command and description
                const item = new PopupMenu.PopupBaseMenuItem();
                
                // Create vertical box layout
                const vbox = new St.BoxLayout({
                    vertical: true,
                    style_class: 'popup-menu-item-content'
                });
                
                // Add command label
                const cmdLabel = new St.Label({
                    text: command.cmd,
                    style_class: 'fvm-cs-command',
                    style: 'font-family: monospace;'
                });
                vbox.add_child(cmdLabel);
                
                // Add description label
                const descLabel = new St.Label({
                    text: command.desc,
                    style_class: 'fvm-cs-description',
                    style: 'font-size: 0.85em; opacity: 0.7; margin-top: 2px;'
                });
                vbox.add_child(descLabel);
                
                item.add_child(vbox);
                
                // Add click handler to copy command to clipboard
                item.connect('activate', () => {
                    const clipboard = St.Clipboard.get_default();
                    clipboard.set_text(St.ClipboardType.CLIPBOARD, command.cmd);
                    Main.notify('FVMT', `Copied: ${command.cmd}`);
                });
                
                categorySubmenu.menu.addMenuItem(item);
            });
            
            this.menu.addMenuItem(categorySubmenu);
        });
    }
});

export default class FVMToolExtension extends Extension {
    enable() {
        this._indicator = new FVMToolIndicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }
    
    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }
}