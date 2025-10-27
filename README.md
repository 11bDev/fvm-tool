# FVMT - FVM Tool

<div align="center">

**Quick access to FVM (Flutter Version Management) commands for GNOME Shell**

[![GNOME Shell](https://img.shields.io/badge/GNOME%20Shell-40%2B-blue?logo=gnome)](https://www.gnome.org/)
[![License](https://img.shields.io/badge/license-GPL--3.0-green)](LICENSE)
[![Release](https://img.shields.io/github/v/release/11bDev/fvm-tool)](https://github.com/11bDev/fvm-tool/releases)

</div>

---

## ✨ Features

- 🚀 **Quick Access**: Panel button for instant access to FVM commands
- 📊 **Version Display**: See your global FVM version at a glance
- 📋 **Installed Versions**: View all installed Flutter versions with version numbers
- 📁 **Organized Categories**: 51 commands grouped into 9 logical categories
- 🖱️ **One-Click Copy**: Click any command to copy it to clipboard
- 🎨 **Theme Support**: Automatically matches your GNOME theme (light/dark mode)
- ⚡ **Live Updates**: Menu refreshes automatically to show newly installed versions
- 📝 **Command Descriptions**: Each command includes helpful description

## 📦 Installation

### Quick Install

**For Debian/Ubuntu:**
```bash
wget https://github.com/11bDev/fvm-tool/releases/latest/download/gnome-shell-extension-fvmt_2.0.0_all.deb
sudo dpkg -i gnome-shell-extension-fvmt_2.0.0_all.deb
gnome-extensions enable fvm-cs@tim.dev
```

**For Fedora/RHEL:**
```bash
wget https://github.com/11bDev/fvm-tool/releases/latest/download/gnome-shell-extension-fvmt-2.0.0-1.noarch.rpm
sudo rpm -i gnome-shell-extension-fvmt-2.0.0-1.noarch.rpm
gnome-extensions enable fvm-cs@tim.dev
```

**Manual Installation:**
```bash
wget https://github.com/11bDev/fvm-tool/releases/latest/download/fvmt-extension.zip
mkdir -p ~/.local/share/gnome-shell/extensions/fvm-cs@tim.dev
unzip fvmt-extension.zip -d ~/.local/share/gnome-shell/extensions/fvm-cs@tim.dev/
gnome-extensions enable fvm-cs@tim.dev
```

After installation, **restart GNOME Shell**:
- **Wayland**: Log out and log back in
- **X11**: Press `Alt + F2`, type `r`, press Enter

## 🚀 Usage

1. Look for **FVMT** in your top panel
2. Click to open the menu
3. View your global version and installed versions at the top
4. Expand any category to see commands
5. Click a command to copy it to clipboard
6. Paste in your terminal and use!

## 📚 Command Categories

All 51 FVM commands organized into:

- **Installation & Setup** - Install Flutter SDK versions
- **Version Management** - Set and manage versions for projects
- **Listing & Information** - View available and installed versions
- **Running Commands** - Execute Flutter/Dart commands with FVM
- **Removal & Cleanup** - Remove versions and clean cache
- **Configuration** - Manage FVM settings
- **Fork Management** - Work with custom Flutter repositories
- **Diagnostics** - Troubleshoot FVM setup
- **JSON API** - Integration with other tools

## 🔧 Requirements

- GNOME Shell 40-49
- FVM installed (optional - extension works without it but won't show version info)

## 🛠️ Development

See [INSTALL.md](INSTALL.md) for development setup and testing instructions.

```bash
git clone https://github.com/11bDev/fvm-tool.git
cd fvm-tool
./install-dev.sh
```

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📄 License

GPL-3.0 License - see [LICENSE](LICENSE) file for details.

## 🙏 Credits

Built for the Flutter development community using [FVM](https://fvm.app/) by Leo Farias.

## 📞 Support

- 🐛 [Report Issues](https://github.com/11bDev/fvm-tool/issues)
- 💡 [Request Features](https://github.com/11bDev/fvm-tool/issues/new)

---

<div align="center">

Made with ❤️ for Flutter developers

</div>
