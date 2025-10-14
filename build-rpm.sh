#!/bin/bash
set -e

# VMC GNOME Extension - RPM Package Builder
# This script builds a .rpm package for Fedora/RHEL systems

VERSION="1.0.0"
RELEASE="1"
PACKAGE_NAME="gnome-shell-extension-vmc"
EXTENSION_UUID="fvm-cs@tim.dev"
BUILD_DIR="build/rpm"
RPM_BUILD_ROOT="${BUILD_DIR}/BUILDROOT"
INSTALL_DIR="usr/share/gnome-shell/extensions/${EXTENSION_UUID}"

echo "Building RPM package for VMC GNOME Extension v${VERSION}..."

# Clean previous build
rm -rf ${BUILD_DIR}
mkdir -p ${BUILD_DIR}/{BUILD,RPMS,SOURCES,SPECS,SRPMS}
mkdir -p ${RPM_BUILD_ROOT}/${INSTALL_DIR}

# Copy extension files to buildroot
echo "Copying extension files..."
cp extension.js ${RPM_BUILD_ROOT}/${INSTALL_DIR}/
cp metadata.json ${RPM_BUILD_ROOT}/${INSTALL_DIR}/
cp stylesheet.css ${RPM_BUILD_ROOT}/${INSTALL_DIR}/

# Create spec file
cat > ${BUILD_DIR}/SPECS/${PACKAGE_NAME}.spec << EOF
Name:           ${PACKAGE_NAME}
Version:        ${VERSION}
Release:        ${RELEASE}%{?dist}
Summary:        Version Manager Cheat Sheets for GNOME Shell
License:        GPL-3.0
URL:            https://github.com/tim/vmc-gnome-extension
BuildArch:      noarch
Requires:       gnome-shell >= 40

%description
Quick access panel extension that provides cheat sheets for popular
version management tools including FVM, Mise, Rbenv, NVM, pyenv, and SDKMAN!

Features:
- One-click command copying to clipboard
- Support for 6 popular version managers
- Clean, intuitive GNOME-style interface
- Helpful command descriptions

%install
mkdir -p %{buildroot}/${INSTALL_DIR}
cp -r ${RPM_BUILD_ROOT}/${INSTALL_DIR}/* %{buildroot}/${INSTALL_DIR}/

%files
/${INSTALL_DIR}/extension.js
/${INSTALL_DIR}/metadata.json
/${INSTALL_DIR}/stylesheet.css

%post
echo "VMC GNOME Extension installed successfully!"
echo "Please log out and log back in, then enable the extension with:"
echo "  gnome-extensions enable fvm-cs@tim.dev"

%changelog
* $(date +"%a %b %d %Y") Tim <tim@example.com> - ${VERSION}-${RELEASE}
- Initial release
- Support for FVM, Mise, Rbenv, NVM, pyenv, and SDKMAN!
EOF

# Build the RPM
echo "Building RPM package..."
rpmbuild --define "_topdir ${PWD}/${BUILD_DIR}" \
         --define "_builddir ${PWD}/${BUILD_DIR}/BUILD" \
         --buildroot="${PWD}/${RPM_BUILD_ROOT}" \
         -bb ${BUILD_DIR}/SPECS/${PACKAGE_NAME}.spec

# Copy the built RPM to the root directory
cp ${BUILD_DIR}/RPMS/noarch/${PACKAGE_NAME}-${VERSION}-${RELEASE}.*.rpm ./${PACKAGE_NAME}-${VERSION}-${RELEASE}.noarch.rpm 2>/dev/null || \
cp ${BUILD_DIR}/RPMS/noarch/${PACKAGE_NAME}-${VERSION}-${RELEASE}.noarch.rpm . 2>/dev/null || true

echo "✓ RPM package created: ${PACKAGE_NAME}-${VERSION}-${RELEASE}.noarch.rpm"
echo ""
echo "To install:"
echo "  sudo rpm -i ${PACKAGE_NAME}-${VERSION}-${RELEASE}.noarch.rpm"
