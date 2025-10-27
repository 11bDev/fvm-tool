#!/bin/bash
set -e

# FVMT GNOME Extension - DEB Package Builder
# This script builds a .deb package for Debian/Ubuntu systems

VERSION="2.0.0"
PACKAGE_NAME="gnome-shell-extension-fvmt"
EXTENSION_UUID="fvm-cs@tim.dev"
BUILD_DIR="build/deb"
INSTALL_DIR="usr/share/gnome-shell/extensions/${EXTENSION_UUID}"

echo "Building DEB package for FVMT GNOME Extension v${VERSION}..."

# Clean previous build
rm -rf ${BUILD_DIR}
mkdir -p ${BUILD_DIR}/DEBIAN
mkdir -p ${BUILD_DIR}/${INSTALL_DIR}

# Copy extension files
echo "Copying extension files..."
cp extension.js ${BUILD_DIR}/${INSTALL_DIR}/
cp metadata.json ${BUILD_DIR}/${INSTALL_DIR}/
cp stylesheet.css ${BUILD_DIR}/${INSTALL_DIR}/

# Create DEBIAN/control file
cat > ${BUILD_DIR}/DEBIAN/control << EOF
Package: ${PACKAGE_NAME}
Version: ${VERSION}
Section: gnome
Priority: optional
Architecture: all
Depends: gnome-shell (>= 40)
Maintainer: Tim <tim@example.com>
Description: FVM Tool - Flutter Version Management Cheat Sheet for GNOME Shell
 Quick access panel extension that provides a cheat sheet for FVM
 (Flutter Version Management) commands.
 .
 Features:
  - One-click command copying to clipboard
  - FVM command reference with descriptions
  - Clean, intuitive GNOME-style interface
  - Lightweight and focused on FVM
Homepage: https://github.com/11bDev/fvm-tool
EOF

# Create postinst script
cat > ${BUILD_DIR}/DEBIAN/postinst << 'EOF'
#!/bin/bash
set -e

echo "FVMT GNOME Extension installed successfully!"
echo "Please log out and log back in, then enable the extension with:"
echo "  gnome-extensions enable fvm-cs@tim.dev"

exit 0
EOF

chmod 755 ${BUILD_DIR}/DEBIAN/postinst

# Build the package
echo "Building package..."
dpkg-deb --build ${BUILD_DIR} ${PACKAGE_NAME}_${VERSION}_all.deb

echo "✓ DEB package created: ${PACKAGE_NAME}_${VERSION}_all.deb"
echo ""
echo "To install:"
echo "  sudo dpkg -i ${PACKAGE_NAME}_${VERSION}_all.deb"
