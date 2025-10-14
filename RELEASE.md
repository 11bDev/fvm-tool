# GitHub Release Setup Guide

This guide will help you publish the VMC GNOME Extension to GitHub with releases.

## Prerequisites

- Git installed
- GitHub CLI (`gh`) installed
- A GitHub account

## Steps

### 1. Authenticate with GitHub CLI

Run the following command and follow the prompts:

```bash
gh auth login
```

Choose:
- GitHub.com
- HTTPS
- Yes (authenticate Git with your GitHub credentials)
- Login with a web browser (recommended)

### 2. Create Repository and Release

Once authenticated, simply run:

```bash
./create-release.sh
```

This script will:
- ✓ Create the GitHub repository
- ✓ Push your code
- ✓ Build the packages (ZIP and DEB)
- ✓ Create a v1.0.0 release
- ✓ Upload the packages to the release

### 3. Verify

The script will open your repository in the browser. Check:
- Code is pushed to `main` branch
- Release v1.0.0 is created with packages attached
- README is displayed correctly

## Manual Steps (Alternative)

If you prefer to do it manually:

### Create Repository

```bash
gh repo create vmc-gnome-extension \
    --public \
    --source=. \
    --description "Quick access to version manager cheat sheets for GNOME Shell" \
    --push
```

### Build Packages

```bash
./build-zip.sh
./build-deb.sh
```

### Create Release

```bash
gh release create v1.0.0 \
    --title "VMC v1.0.0 - Version Manager Cheat Sheets" \
    --notes "Initial release with 6 version manager cheat sheets" \
    vmc-extension.zip \
    gnome-shell-extension-vmc_1.0.0_all.deb
```

## After Release

### Share Your Extension

1. **GNOME Extensions Website**: Submit to https://extensions.gnome.org/
2. **Reddit**: Share on r/gnome and r/linux
3. **Social Media**: Tweet about it, share on Mastodon
4. **Dev.to/Hashnode**: Write a blog post about it

### Update README URLs

After creating the repository, update the README.md badge URLs with your actual GitHub username.

## Building RPM Package (Optional)

If you're on Fedora/RHEL or have `rpmbuild` installed:

```bash
# Install rpmbuild (Fedora/RHEL)
sudo dnf install rpm-build

# Build RPM
./build-rpm.sh

# Add to release
gh release upload v1.0.0 gnome-shell-extension-vmc-1.0.0-1.noarch.rpm
```

## Troubleshooting

### gh command not found

Install GitHub CLI:

**Ubuntu/Debian:**
```bash
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

**Fedora:**
```bash
sudo dnf install gh
```

### Authentication Issues

If authentication fails:
```bash
gh auth logout
gh auth login
```

### Repository Already Exists

If you get an error that the repository exists:
```bash
# Just push the code
git remote add origin https://github.com/YOUR_USERNAME/vmc-gnome-extension.git
git push -u origin main

# Then create the release
gh release create v1.0.0 ...
```

## Next Version Release

When releasing a new version:

1. Update version in:
   - `metadata.json`
   - `build-deb.sh`
   - `build-rpm.sh`
   - `build-zip.sh`
   - `create-release.sh`

2. Commit changes:
   ```bash
   git add .
   git commit -m "Bump version to X.Y.Z"
   git push
   ```

3. Build and release:
   ```bash
   ./build-zip.sh
   ./build-deb.sh
   gh release create vX.Y.Z --generate-notes \
       vmc-extension.zip \
       gnome-shell-extension-vmc_X.Y.Z_all.deb
   ```
