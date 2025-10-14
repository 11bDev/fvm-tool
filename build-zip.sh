#!/bin/bash
set -e

# VMC GNOME Extension - Release Package Builder
# This script creates a ZIP file for direct installation

VERSION="1.0.0"
PACKAGE_NAME="vmc-extension"
EXTENSION_UUID="fvm-cs@tim.dev"

echo "Creating release ZIP for VMC GNOME Extension v${VERSION}..."

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
EXTENSION_DIR="${TEMP_DIR}/${EXTENSION_UUID}"

mkdir -p ${EXTENSION_DIR}

# Copy extension files
echo "Copying extension files..."
cp extension.js ${EXTENSION_DIR}/
cp metadata.json ${EXTENSION_DIR}/
cp stylesheet.css ${EXTENSION_DIR}/

# Create ZIP file
cd ${TEMP_DIR}
zip -r "${PACKAGE_NAME}.zip" ${EXTENSION_UUID}
cd -

# Move ZIP to current directory
mv ${TEMP_DIR}/${PACKAGE_NAME}.zip .

# Cleanup
rm -rf ${TEMP_DIR}

echo "✓ Release ZIP created: ${PACKAGE_NAME}.zip"
echo ""
echo "To install:"
echo "  unzip ${PACKAGE_NAME}.zip -d ~/.local/share/gnome-shell/extensions/"
echo "  gnome-extensions enable ${EXTENSION_UUID}"
