#!/bin/bash
# FVMT GNOME Extension - GitHub Setup and Release Script
# Run this script after authenticating with GitHub CLI

set -e

VERSION="2.0.0"

echo "=========================================="
echo "FVMT GNOME Extension - GitHub Setup"
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
    gh repo create fvm-tool \
        --public \
        --source=. \
        --description "FVMT - Quick access to FVM (Flutter Version Management) cheat sheet for GNOME Shell" \
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
    --title "FVMT v${VERSION} - FVM Tool" \
    --notes "## 🎉 FVMT GNOME Extension v${VERSION}

### Features
- ✨ Quick access to FVM (Flutter Version Management) cheat sheet
- 📋 One-click command copying to clipboard
- 🎨 Clean GNOME-style interface
- 📝 Helpful command descriptions
- ⚡ Lightweight and focused on FVM

### What's New in v2.0.0
- Simplified to focus exclusively on FVM
- Renamed from VMC to FVMT (FVM Tool)
- Direct access to FVM commands without nested menus
- Updated panel button to show 'FVMT'
- Improved performance with streamlined UI

### Installation

**For Debian/Ubuntu:**
\`\`\`bash
wget https://github.com/\$(gh repo view --json nameWithOwner -q .nameWithOwner)/releases/download/v${VERSION}/gnome-shell-extension-fvmt_${VERSION}_all.deb
sudo dpkg -i gnome-shell-extension-fvmt_${VERSION}_all.deb
gnome-extensions enable fvm-cs@tim.dev
\`\`\`

**For other distributions:**
\`\`\`bash
wget https://github.com/\$(gh repo view --json nameWithOwner -q .nameWithOwner)/releases/download/v${VERSION}/fvmt-extension.zip
unzip fvmt-extension.zip -d ~/.local/share/gnome-shell/extensions/
gnome-extensions enable fvm-cs@tim.dev
\`\`\`

**Full Changelog**: https://github.com/\$(gh repo view --json nameWithOwner -q .nameWithOwner)/commits/v${VERSION}" \
    fvmt-extension.zip \
    gnome-shell-extension-fvmt_${VERSION}_all.deb

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
