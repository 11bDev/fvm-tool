# Installation and Testing Guide

## Quick Install for Development

### Step 1: Install the Extension

Run the development installation script:

```bash
chmod +x install-dev.sh
./install-dev.sh
```

This will:
- Copy files to `~/.local/share/gnome-shell/extensions/fvm-cs@tim.dev/`
- Enable the extension
- Show you next steps

### Step 2: Restart GNOME Shell

**On X11 (most common):**
1. Press `Alt + F2`
2. Type `r`
3. Press `Enter`

**On Wayland:**
1. Log out
2. Log back in

### Step 3: Verify Installation

Look for **FVMT** in your top panel (usually on the right side). Click it to see the menu!

## Testing the Extension

### What to Test

1. **Panel Button**: Check that "FVMT" appears in the top panel
2. **Global Version**: Open menu and verify it shows your current FVM global version
3. **Installed Versions**: Expand the "Installed Versions" submenu to see all versions
4. **Categories**: Check that all command categories are visible and organized
5. **Copy Commands**: Click any command to copy it to clipboard (you should see a notification)
6. **Test Clipboard**: Paste (`Ctrl+V`) in a terminal to verify the command was copied

### Viewing Logs (for debugging)

If something doesn't work, check the logs:

```bash
journalctl -f -o cat /usr/bin/gnome-shell
```

This will show real-time logs from GNOME Shell, including any errors from the extension.

### Making Changes

After editing the code:

1. Run `./install-dev.sh` again to copy updated files
2. Restart GNOME Shell (as described above)
3. Test your changes

## Quick Reload During Development

For faster testing on X11:

```bash
./install-dev.sh && (sleep 1; killall -3 gnome-shell)
```

This installs and automatically restarts GNOME Shell.

## Uninstalling

To remove the extension:

```bash
gnome-extensions disable fvm-cs@tim.dev
rm -rf ~/.local/share/gnome-shell/extensions/fvm-cs@tim.dev
```

Then restart GNOME Shell.

## Troubleshooting

### Extension doesn't appear
- Make sure GNOME Shell version is 40-49 (check with `gnome-shell --version`)
- Check if extension is enabled: `gnome-extensions list --enabled`
- Look for errors in logs: `journalctl -f -o cat /usr/bin/gnome-shell`

### "Global: [version]" not showing
- Make sure you have FVM installed: `which fvm`
- Set a global version: `fvm global stable` or `fvm global 3.19.0`
- Check that `~/fvm/default` symlink exists

### "Installed Versions" is empty
- Make sure you have installed at least one Flutter version: `fvm install stable`
- Check that `~/fvm/versions/` directory exists and has subdirectories

### Commands not copying to clipboard
- Check notifications - you should see "Copied: [command]"
- Try pasting in a terminal to verify
- Check logs for errors

## Testing Without FVM Installed

The extension will still work and show all commands even if FVM is not installed. You just won't see:
- Global version indicator
- Installed versions submenu

This is normal behavior - the extension gracefully handles the absence of FVM.
