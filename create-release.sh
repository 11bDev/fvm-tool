#!/bin/bash
# VMC GNOME Extension - GitHub Setup and Release Script
# Run this script after authenticating with GitHub CLI

set -e

VERSION="1.0.0"

echo "=========================================="
echo "VMC GNOME Extension - GitHub Setup"
echo "=========================================="
echo ""

# Check if authenticated
if ! gh auth status &>/dev/null; then
    echo "❌ Not authenticated with GitHub CLI"
    echo ""
    echo "Please run:"
    echo "  gh auth login"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✓ Authenticated with GitHub CLI"
echo ""

# Create repository if it doesn't exist
if ! gh repo view &>/dev/null; then
    echo "Creating GitHub repository..."
    gh repo create vmc-gnome-extension \
        --public \
        --source=. \
        --description "Quick access to version manager cheat sheets for GNOME Shell" \
        --push
    echo "✓ Repository created and code pushed"
else
    echo "✓ Repository already exists"
    echo "Pushing latest changes..."
    git push origin main
fi

echo ""
echo "Building packages..."
./build-zip.sh
./build-deb.sh

echo ""
echo "Creating GitHub release v${VERSION}..."

# Create release with packages
gh release create "v${VERSION}" \
    --title "VMC v${VERSION} - Version Manager Cheat Sheets" \
    --notes "## 🎉 VMC GNOME Extension v${VERSION}

### Features
- ✨ Quick access to cheat sheets for 6 popular version managers
- 📋 One-click command copying to clipboard
- 🎨 Clean GNOME-style interface
- 📝 Helpful command descriptions for each tool

### Supported Version Managers
- **FVM** - Flutter Version Management
- **Mise** - Runtime Version Manager
- **Rbenv** - Ruby Version Manager
- **NVM** - Node.js Version Manager
- **pyenv** - Python Version Manager
- **SDKMAN!** - Java/JVM SDK Manager

### Installation

**For Debian/Ubuntu:**
\`\`\`bash
wget https://github.com/\$(gh repo view --json nameWithOwner -q .nameWithOwner)/releases/download/v${VERSION}/gnome-shell-extension-vmc_${VERSION}_all.deb
sudo dpkg -i gnome-shell-extension-vmc_${VERSION}_all.deb
gnome-extensions enable fvm-cs@tim.dev
\`\`\`

**For other distributions:**
\`\`\`bash
wget https://github.com/\$(gh repo view --json nameWithOwner -q .nameWithOwner)/releases/download/v${VERSION}/vmc-extension.zip
unzip vmc-extension.zip -d ~/.local/share/gnome-shell/extensions/
gnome-extensions enable fvm-cs@tim.dev
\`\`\`

### What's Changed
- Initial release with 6 version manager cheat sheets
- DEB package support for Debian/Ubuntu
- ZIP package for manual installation
- Comprehensive README and documentation

**Full Changelog**: https://github.com/\$(gh repo view --json nameWithOwner -q .nameWithOwner)/commits/v${VERSION}" \
    vmc-extension.zip \
    gnome-shell-extension-vmc_${VERSION}_all.deb

echo ""
echo "=========================================="
echo "✓ Release created successfully!"
echo "=========================================="
echo ""
echo "View your release at:"
gh repo view --web --branch main
echo ""
echo "Next steps:"
echo "1. Check the release page"
echo "2. Share with the community!"
echo "3. Consider submitting to GNOME Extensions website"
