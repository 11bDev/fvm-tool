import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

// Cheat sheet data
const CHEAT_SHEETS = {
    'FVM': {
        title: 'Flutter Version Management (FVM)',
        commands: [
            { cmd: 'fvm install', desc: 'Install a Flutter version' },
            { cmd: 'fvm use [version]', desc: 'Use a specific Flutter version' },
            { cmd: 'fvm global [version]', desc: 'Set global Flutter version' },
            { cmd: 'fvm list', desc: 'List installed Flutter versions' },
            { cmd: 'fvm releases', desc: 'List available Flutter releases' },
            { cmd: 'fvm remove [version]', desc: 'Remove a Flutter version' },
            { cmd: 'fvm which', desc: 'Show current Flutter version path' },
            { cmd: 'fvm doctor', desc: 'Run Flutter doctor' },
            { cmd: 'fvm flutter [command]', desc: 'Run Flutter command with FVM' },
            { cmd: 'fvm dart [command]', desc: 'Run Dart command with FVM' }
        ]
    },
    'Mise': {
        title: 'Runtime Version Manager (Mise)',
        commands: [
            { cmd: 'mise install', desc: 'Install tools from .mise.toml' },
            { cmd: 'mise install [tool@version]', desc: 'Install specific tool version' },
            { cmd: 'mise use [tool@version]', desc: 'Set tool version for project' },
            { cmd: 'mise global [tool@version]', desc: 'Set global tool version' },
            { cmd: 'mise list', desc: 'List installed tool versions' },
            { cmd: 'mise list-all [tool]', desc: 'List all available versions' },
            { cmd: 'mise current', desc: 'Show current tool versions' },
            { cmd: 'mise outdated', desc: 'Show outdated tools' },
            { cmd: 'mise upgrade', desc: 'Upgrade all tools to latest' },
            { cmd: 'mise uninstall [tool@version]', desc: 'Uninstall tool version' },
            { cmd: 'mise which [tool]', desc: 'Show path to tool executable' },
            { cmd: 'mise exec [tool@version] -- [cmd]', desc: 'Execute command with specific version' }
        ]
    },
    'Rbenv': {
        title: 'Ruby Version Manager (Rbenv)',
        commands: [
            { cmd: 'rbenv install [version]', desc: 'Install Ruby version' },
            { cmd: 'rbenv versions', desc: 'List installed Ruby versions' },
            { cmd: 'rbenv version', desc: 'Show current Ruby version' },
            { cmd: 'rbenv global [version]', desc: 'Set global Ruby version' },
            { cmd: 'rbenv local [version]', desc: 'Set local Ruby version' },
            { cmd: 'rbenv shell [version]', desc: 'Set shell Ruby version' },
            { cmd: 'rbenv uninstall [version]', desc: 'Uninstall Ruby version' },
            { cmd: 'rbenv rehash', desc: 'Rehash rbenv shims' },
            { cmd: 'rbenv which [command]', desc: 'Show path to executable' },
            { cmd: 'rbenv whence [command]', desc: 'List versions with command' },
            { cmd: 'rbenv install --list', desc: 'List available Ruby versions' },
            { cmd: 'rbenv exec [version] [command]', desc: 'Execute command with version' }
        ]
    },
    'NVM': {
        title: 'Node Version Manager (NVM)',
        commands: [
            { cmd: 'nvm install [version]', desc: 'Install Node.js version' },
            { cmd: 'nvm install node', desc: 'Install latest Node.js version' },
            { cmd: 'nvm install --lts', desc: 'Install latest LTS version' },
            { cmd: 'nvm use [version]', desc: 'Use specific Node.js version' },
            { cmd: 'nvm use node', desc: 'Use latest installed version' },
            { cmd: 'nvm use --lts', desc: 'Use latest LTS version' },
            { cmd: 'nvm ls', desc: 'List installed Node.js versions' },
            { cmd: 'nvm ls-remote', desc: 'List available remote versions' },
            { cmd: 'nvm current', desc: 'Show current Node.js version' },
            { cmd: 'nvm alias default [version]', desc: 'Set default Node.js version' },
            { cmd: 'nvm uninstall [version]', desc: 'Uninstall Node.js version' },
            { cmd: 'nvm which [version]', desc: 'Show path to Node.js executable' }
        ]
    },
    'pyenv': {
        title: 'Python Version Manager (pyenv)',
        commands: [
            { cmd: 'pyenv install [version]', desc: 'Install Python version' },
            { cmd: 'pyenv install --list', desc: 'List available Python versions' },
            { cmd: 'pyenv versions', desc: 'List installed Python versions' },
            { cmd: 'pyenv version', desc: 'Show current Python version' },
            { cmd: 'pyenv global [version]', desc: 'Set global Python version' },
            { cmd: 'pyenv local [version]', desc: 'Set local Python version' },
            { cmd: 'pyenv shell [version]', desc: 'Set shell Python version' },
            { cmd: 'pyenv uninstall [version]', desc: 'Uninstall Python version' },
            { cmd: 'pyenv rehash', desc: 'Rehash pyenv shims' },
            { cmd: 'pyenv which [command]', desc: 'Show path to executable' },
            { cmd: 'pyenv whence [command]', desc: 'List versions with command' },
            { cmd: 'pyenv virtualenv [version] [name]', desc: 'Create virtual environment' }
        ]
    },
    'SDKMAN': {
        title: 'Software Development Kit Manager (SDKMAN!)',
        commands: [
            { cmd: 'sdk install [candidate] [version]', desc: 'Install SDK version' },
            { cmd: 'sdk install [candidate]', desc: 'Install latest stable version' },
            { cmd: 'sdk use [candidate] [version]', desc: 'Use SDK version in current shell' },
            { cmd: 'sdk default [candidate] [version]', desc: 'Set default SDK version' },
            { cmd: 'sdk list [candidate]', desc: 'List available versions' },
            { cmd: 'sdk list', desc: 'List all available SDKs' },
            { cmd: 'sdk current [candidate]', desc: 'Show current SDK version' },
            { cmd: 'sdk current', desc: 'Show all current versions' },
            { cmd: 'sdk upgrade [candidate]', desc: 'Upgrade SDK to latest version' },
            { cmd: 'sdk uninstall [candidate] [version]', desc: 'Uninstall SDK version' },
            { cmd: 'sdk version', desc: 'Show SDKMAN version' },
            { cmd: 'sdk update', desc: 'Update SDKMAN itself' }
        ]
    }
};

const FVMCheatSheetIndicator = GObject.registerClass(
class FVMCheatSheetIndicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'FVM Cheat Sheets');
        
        // Create panel button with text label for better visibility
        this.add_child(new St.Label({
            text: 'VMC',
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'system-status-icon'
        }));
        
        // Create main menu items
        this._createMenuItems();
    }
    
    _createMenuItems() {
        // Add main menu items for each tool
        Object.keys(CHEAT_SHEETS).forEach(tool => {
            const menuItem = new PopupMenu.PopupMenuItem(tool);
            menuItem.connect('activate', () => this._showCheatSheet(tool));
            this.menu.addMenuItem(menuItem);
        });
    }
    
    _showCheatSheet(tool) {
        const cheatSheet = CHEAT_SHEETS[tool];
        
        // Clear existing submenu items
        this.menu.removeAll();
        
        // Add back button
        const backItem = new PopupMenu.PopupMenuItem('← Back to Tools');
        backItem.connect('activate', () => this._showMainMenu());
        this.menu.addMenuItem(backItem);
        
        // Add separator
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        
        // Add title
        const titleItem = new PopupMenu.PopupMenuItem(cheatSheet.title);
        titleItem.actor.style = 'font-weight: bold; font-size: 1.1em;';
        titleItem.reactive = false;
        this.menu.addMenuItem(titleItem);
        
        // Add separator
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        
        // Add command items
        cheatSheet.commands.forEach(command => {
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
                style: 'font-family: monospace; font-weight: bold;'
            });
            vbox.add_child(cmdLabel);
            
            // Add description label
            const descLabel = new St.Label({
                text: command.desc,
                style_class: 'fvm-cs-description',
                style: 'font-size: 0.85em; color: #888; margin-top: 2px;'
            });
            vbox.add_child(descLabel);
            
            item.add_child(vbox);
            
            // Add click handler to copy command to clipboard
            item.connect('activate', () => {
                const clipboard = St.Clipboard.get_default();
                clipboard.set_text(St.ClipboardType.CLIPBOARD, command.cmd);
                Main.notify('FVM-CS', `Copied: ${command.cmd}`);
            });
            
            this.menu.addMenuItem(item);
        });
    }
    
    _showMainMenu() {
        // Properly destroy all menu items
        let items = this.menu._getMenuItems();
        for (let item of items) {
            item.destroy();
        }
        
        // Recreate main menu
        this._createMenuItems();
    }
});

export default class FVMCheatSheetExtension extends Extension {
    enable() {
        this._indicator = new FVMCheatSheetIndicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }
    
    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }
}