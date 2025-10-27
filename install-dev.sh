#!/bin/bash
# FVMT GNOME Extension - Development Installation Script

set -e

EXTENSION_UUID="fvm-cs@tim.dev"
INSTALL_DIR="$HOME/.local/share/gnome-shell/extensions/$EXTENSION_UUID"

echo "=========================================="
echo "FVMT Development Installation"
echo "=========================================="
echo ""

# Create installation directory
echo "Creating installation directory..."
mkdir -p "$INSTALL_DIR"

# Copy extension files
echo "Copying extension files..."
cp extension.js "$INSTALL_DIR/"
cp metadata.json "$INSTALL_DIR/"
cp stylesheet.css "$INSTALL_DIR/"

echo "✓ Files copied to $INSTALL_DIR"
echo ""

# Check if extension is already enabled
if gnome-extensions list | grep -q "$EXTENSION_UUID"; then
    echo "Extension is already installed. Disabling and re-enabling..."
    gnome-extensions disable "$EXTENSION_UUID" 2>/dev/null || true
    sleep 1
fi

# Enable the extension
echo "Enabling extension..."
gnome-extensions enable "$EXTENSION_UUID"

echo ""
echo "=========================================="
echo "✓ Installation Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Restart GNOME Shell:"
echo "   - On Wayland: Log out and log back in"
echo "   - On X11: Press Alt+F2, type 'r', press Enter"
echo ""
echo "2. Look for 'FVMT' in your top panel"
echo ""
echo "To see logs (useful for debugging):"
echo "  journalctl -f -o cat /usr/bin/gnome-shell"
echo ""
echo "To uninstall:"
echo "  gnome-extensions disable $EXTENSION_UUID"
echo "  rm -rf $INSTALL_DIR"
