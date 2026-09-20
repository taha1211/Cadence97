# Repository search with tgrep

Cadence97 uses [Microsoft's tgrep](https://github.com/microsoft/tgrep) for indexed
local code search. It is a development tool, not an application dependency.
Version **1.0.9** was installed for this checkout at `~/.local/bin/tgrep`, which is
already on this machine's PATH.

## This machine's background service

This checkout has a macOS user LaunchAgent named `local.cadence97.tgrep`. It starts
at login and restarts the watcher if it exits. Agents should reuse it rather than
launching another server. Its machine-local configuration and logs are:

- `~/Library/LaunchAgents/local.cadence97.tgrep.plist`
- `~/Library/Logs/Cadence97/tgrep.log`

From the repository root, inspect the watcher with `tgrep status .`. If recovery is
needed, inspect the log and the service before restarting it:

```sh
launchctl print "gui/$(id -u)/local.cadence97.tgrep"
launchctl kickstart -k "gui/$(id -u)/local.cadence97.tgrep"
```

To stop the service for this login session:

```sh
launchctl bootout "gui/$(id -u)/local.cadence97.tgrep"
```

To load it again if it has been stopped:

```sh
launchctl bootstrap "gui/$(id -u)" "$HOME/Library/LaunchAgents/local.cadence97.tgrep.plist"
```

The service stores this checkout's absolute path. If the repository is moved,
update its `ProgramArguments` before loading it again. To remove the service,
unload it first and then remove that specific plist. These machine-local settings
are not shipped to other contributors or attached to application startup.

## Install on another machine

Use `brew install tgrep` when it is available in your Homebrew catalog. Otherwise,
download the appropriate binary from the
[official releases](https://github.com/microsoft/tgrep/releases), verify its SHA-256
against the published release checksum, and install it in a directory on PATH.
Use version 1.0.9 or newer for the examples below.

This machine uses the Apple Silicon `aarch64-apple-darwin` binary from
[v1.0.9](https://github.com/microsoft/tgrep/releases/tag/v1.0.9). Its archive SHA-256 is:

```text
f58acdf6102b2c51130ff5a63e1d29cd4feb3ed79f12fbba57ef5cc3ae297bc3
```

## Start or reuse a watcher on another machine

Run these commands from the repository root. First check for an existing server:

```sh
tgrep --version
tgrep status .
```

If no server is running, start one in a dedicated terminal:

```sh
tgrep serve .
```

Or leave it running in the background:

```sh
mkdir -p .tgrep
nohup tgrep serve . > .tgrep/server.log 2>&1 < /dev/null &
```

The server builds the index automatically, watches edits, and shares the index
with subsequent search commands. Do not run a second server for the same checkout.
Check `tgrep status .` for indexing progress and watcher health. If startup fails,
read `.tgrep/server.log`. The `.tgrep/` directory contains local index data, server
metadata, and logs, and is excluded from Git.

This manual background process lasts until stopped or the machine restarts; it
does not install a login service. Some managed agent shells also terminate detached
children, so use a dedicated terminal or a user service if that happens. After a
reboot, check status and start it again. To stop a foreground server, press Ctrl-C.
For a manually started background server, obtain its PID from `tgrep status .` and
send that specific process `kill <PID>`. Use `launchctl bootout` instead for this
machine's managed service, since it would otherwise restart automatically.

If your environment cannot keep a server alive, use `tgrep index .`. This creates
a snapshot, which must be rebuilt after changes that later searches need to see.
Do not rebuild the index on every query or attach indexing to application startup,
commit hooks, or CI.

## Search examples

Keep flags before `--` and put the explicit search path after the pattern. The
separator also prevents a word such as `serve` from being treated as a subcommand.
Use the repository root as the path when using its shared index.

```sh
# Locate files containing a literal symbol.
tgrep -F -l -- 'DocBreadcrumb' .

# Read matching code with two lines of context, scoped to desktop pages.
tgrep -F -C 2 -g 'packages/frontend/core/src/desktop/**' -- 'DocBreadcrumb' .

# Find searchable TypeScript and TSX file paths.
tgrep --files -t ts .

# Include eligible hidden configuration files.
tgrep --hidden -F -l -- 'lint-staged' .

# Search the current filesystem directly after an edit or branch switch.
tgrep --no-index -F -C 2 -- 'DocBreadcrumb' packages/frontend/core/src/desktop
```

An index can briefly miss a new or changed file, even when status reports indexing
complete. Use a narrowly scoped `--no-index` search when freshness matters or a
result is unexpectedly absent. Without a watcher, searches do not refresh the
snapshot. Running `index` separately does not refresh a server's in-memory state.

Normal searches respect ignore rules, hidden-file filters, binary detection, and
file-size limits. `--no-index` bypasses the index, not those filters. For an ignored
file you know you need, pass that file explicitly; avoid unrestricted whole-tree
scans that sweep in `node_modules` and build artifacts.

In 1.0.9, positive globs filter the indexed corpus. To deliberately reinclude
ignored files with a positive glob, also use `--no-index`. Likewise, use
`--no-index` with traversal flags such as `--follow`, `--one-file-system`, and
`--ignore-file` when their behavior is required.

Exit codes are `0` for a match, `1` for no match, and `2` for an error. Read stderr
for fallback warnings or failures. Use `rg` or `grep` if tgrep is unavailable or
does not support the required operation; consult the installed `tgrep --help`
before assuming every ripgrep flag behaves identically.

This setup adds no tests, benchmarks, lint rules, or CI checks. New automated
checks still require the owner's approval under [AGENTS.md](../AGENTS.md).
