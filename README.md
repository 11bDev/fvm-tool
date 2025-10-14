# VMC - Version Manager Cheat Sheets

<div align="center">

**Quick access to cheat sheets for popular version management tools**

[![GNOME Shell](https://img.shields.io/badge/GNOME%20Shell-40%2B-blue?logo=gnome)](https://www.gnome.org/)
[![License](https://img.shields.io/badge/license-GPL--3.0-green)](LICENSE)
[![Release](https://img.shields.io/github/v/release/tim/vmc-gnome-extension)](https://github.com/tim/vmc-gnome-extension/releases)

</div>

---

## ✨ Features

- 🚀 **Quick Access**: Panel button ("VMC") for instant access to cheat sheets
- 📋 **One-Click Copy**: Click any command to copy it to your clipboard
- 🔧 **Six Popular Tools**: FVM, Mise, Rbenv, NVM, pyenv, and SDKMAN!
- 🎨 **Clean UI**: Simple, intuitive interface that fits perfectly with GNOME design
- 📝 **Command Descriptions**: Each command includes a helpful description
- 📱 **Notifications**: Visual feedback when commands are copied
- ⚡ **Lightweight**: Minimal resource usage

## 📦 Installation

### Quick Install (Recommended)

#### Option 1: Download Pre-built Package

**For Debian/Ubuntu:**
```bash
wget https://github.com/tim/vmc-gnome-extension/releases/latest/download/gnome-shell-extension-vmc.deb
sudo dpkg -i gnome-shell-extension-vmc.deb
```

**For Fedora/RHEL:**
```bash
wget https://github.com/tim/vmc-gnome-extension/releases/latest/download/gnome-shell-extension-vmc.rpm
sudo rpm -i gnome-shell-extension-vmc.rpm
```

After installation:
1. Log out and log back in (or restart GNOME Shell: `Alt + F2`, type `r`, press Enter on X11)
2. Enable the extension:
   ```bash
   gnome-extensions enable fvm-cs@tim.dev
   ```

#### Option 2: Manual Installation

1. Download the latest release:
   ```bash
   wget https://github.com/tim/vmc-gnome-extension/releases/latest/download/vmc-extension.zip
   ```

2. Extract to your GNOME extensions directory:
   ```bash
   mkdir -p ~/.local/share/gnome-shell/extensions/fvm-cs@tim.dev
   unzip vmc-extension.zip -d ~/.local/share/gnome-shell/extensions/fvm-cs@tim.dev/
   ```

3. Restart GNOME Shell:
   - **Wayland**: Log out and log back in
   - **X11**: Press `Alt + F2`, type `r`, press Enter

4. Enable the extension:
   ```bash
   gnome-extensions enable fvm-cs@tim.dev
   ```

### From Source

```bash
git clone https://github.com/tim/vmc-gnome-extension.git
cd vmc-gnome-extension
mkdir -p ~/.local/share/gnome-shell/extensions/fvm-cs@tim.dev
cp -r extension.js metadata.json stylesheet.css ~/.local/share/gnome-shell/extensions/fvm-cs@tim.dev/
gnome-extensions enable fvm-cs@tim.dev
```

Then restart GNOME Shell (log out/in on Wayland, or `Alt+F2` → `r` on X11).

## 🚀 Usage

1. **Access the Extension**: Look for "VMC" in your top panel (usually on the right side)
2. **Select a Tool**: Click "VMC" to see the menu with all version managers
3. **View Cheat Sheet**: Click on any tool (FVM, Mise, Rbenv, NVM, pyenv, SDKMAN!) to see its commands
4. **Copy Commands**: Click on any command to copy it to your clipboard - you'll see a notification
5. **Navigate Back**: Use the "← Back to Tools" option to return to the main menu

### Example Workflow

```
Click VMC → Select "NVM" → Click "nvm install --lts" → Command copied! → Paste in terminal
```

## 📚 Supported Tools & Commands

### 🦋 FVM (Flutter Version Management)
Manage Flutter SDK versions for your Flutter projects
- Install, use, and switch Flutter versions
- Global and project-specific version management
- Run Flutter/Dart commands with specific versions

### ⚙️ Mise (Runtime Version Manager)
Universal tool version manager (successor to asdf)
- Multi-language runtime management
- Project and global configuration
- Install and manage multiple tools at once

### 💎 Rbenv (Ruby Version Manager)
Manage Ruby versions
- Install and switch Ruby versions
- Local, global, and shell-specific versions
- Shim management for Ruby executables

### 📗 NVM (Node Version Manager)
The most popular Node.js version manager
- Install multiple Node.js versions
- LTS version support
- Switch between Node versions per shell

### 🐍 pyenv (Python Version Manager)
Manage Python versions and virtual environments
- Install any Python version
- Virtual environment integration
- Global, local, and shell version switching

### ☕ SDKMAN! (Software Development Kit Manager)
Manage JVM-based SDKs (Java, Gradle, Maven, Kotlin, Scala, etc.)
- Install and manage multiple JDK versions
- Support for many JVM tools
- Easy version switching

## 🔧 Compatibility

- **GNOME Shell**: Versions 40, 41, 42, 43, 44, 45, 46, 47, 48, 49+
- **Operating Systems**: Any Linux distribution with GNOME Shell
  - Ubuntu 20.04+
  - Fedora 34+
  - Debian 11+
  - Arch Linux
  - Pop!_OS 20.04+
  - And more!

## 🐛 Troubleshooting

### Extension not appearing in panel
```bash
# Check if extension is enabled
gnome-extensions list --enabled | grep fvm-cs

# If not listed, enable it
gnome-extensions enable fvm-cs@tim.dev

# Check for errors
gnome-extensions info fvm-cs@tim.dev
```

### Extension shows ERROR state
```bash
# Check GNOME Shell logs
journalctl -f -o cat /usr/bin/gnome-shell

# Try disabling and re-enabling
gnome-extensions disable fvm-cs@tim.dev
gnome-extensions enable fvm-cs@tim.dev
```

### Commands not copying to clipboard
- Ensure you have a clipboard manager installed
- Try clicking the command again
- Verify GNOME Shell has clipboard access

### Extension not loading after GNOME update
1. Check if your GNOME Shell version is compatible
2. Restart GNOME Shell (log out/in on Wayland)
3. Reinstall the extension if needed

### Getting Help
- Check [Issues](https://github.com/tim/vmc-gnome-extension/issues) for similar problems
- Create a new issue with GNOME Shell version and error logs

## 🛠️ Development

### Project Structure
```
fvm-cs@tim.dev/
├── extension.js      # Main extension logic and cheat sheet data
├── metadata.json     # Extension metadata and compatibility
├── stylesheet.css    # UI styling
└── README.md         # This file
```

### Adding New Version Managers

To add a new version manager to the cheat sheet:

1. Edit `extension.js` and add a new entry to the `CHEAT_SHEETS` object:

```javascript
'ToolName': {
    title: 'Tool Full Name',
    commands: [
        { cmd: 'command here', desc: 'What it does' },
        // ... more commands
    ]
}
```

2. Reload the extension:
```bash
gnome-extensions disable fvm-cs@tim.dev
gnome-extensions enable fvm-cs@tim.dev
```

### Testing Changes

1. Edit files in `~/.local/share/gnome-shell/extensions/fvm-cs@tim.dev/`
2. Restart GNOME Shell (log out/in or `Alt+F2` → `r`)
3. Check logs for errors:
```bash
journalctl -f -o cat /usr/bin/gnome-shell
```

### Building Packages

```bash
# Build DEB package
./build-deb.sh

# Build RPM package
./build-rpm.sh
```

## 🤝 Contributing

Contributions are welcome! Here are some ideas:

- 🆕 Add more version management tools (asdf, tfenv, goenv, rustup, etc.)
- 🎨 Improve UI/UX design
- ⌨️ Add keyboard shortcuts
- 🔍 Add search functionality for commands
- 🌍 Add internationalization (i18n) support
- 📱 Better mobile/touch support
- ✨ Add command examples with actual values

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- GNOME Shell developers for the excellent extension API
- All the version manager tool developers (FVM, Mise, Rbenv, NVM, pyenv, SDKMAN!)
- The GNOME community for inspiration and support

## 📮 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/tim/vmc-gnome-extension/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tim/vmc-gnome-extension/discussions)
- **Author**: Tim

## ⭐ Star History

If you find this extension useful, please consider giving it a star on GitHub!

---

<div align="center">

Made with ❤️ for the GNOME community

**[Report Bug](https://github.com/tim/vmc-gnome-extension/issues)** · **[Request Feature](https://github.com/tim/vmc-gnome-extension/issues)**

</div>