# 🛡️ Contribution Protection

**Stop drive-by AI slop PRs.** Require contributors to open an issue first, get approved with a simple `lgtm` comment, then they can submit PRs.

## ⚡ One-Click Install

Run this in your repo root:

```bash
curl -sL https://raw.githubusercontent.com/hjanuschka/contribution-protection/main/install.sh | bash
```

**That's it.** Commit and push the generated files.

---

## 📝 Manual Install (2 sentences)

1. Copy `.github/workflows/pr-gate.yml`, `.github/workflows/approve-contributor.yml`, and `.github/APPROVED_CONTRIBUTORS` to your repo
2. Commit, push, done

---

## How It Works

```
New Contributor                     Maintainer
      │                                  │
      ├─── Opens Issue ─────────────────►│
      │    "I want to fix X"             │
      │                                  │
      │◄── Comments: lgtm ───────────────┤
      │    (auto-adds to approved list)  │
      │                                  │
      ├─── Opens PR ────────────────────►│
      │    ✅ Allowed!                   │
      │                                  │
```

**Without approval:** PR is auto-closed with a friendly message pointing them to open an issue first.

## Features

- ✅ Auto-closes PRs from unapproved contributors
- ✅ Maintainers comment `lgtm` on issues to approve
- ✅ Contributors are auto-added to approved list
- ✅ Bots (dependabot, etc.) are allowed through
- ✅ Collaborators with write access bypass the gate
- ✅ Customizable welcome message

## Files Created

```
.github/
├── workflows/
│   ├── pr-gate.yml              # Checks PRs, closes unapproved ones
│   └── approve-contributor.yml  # Handles 'lgtm' approval flow
├── APPROVED_CONTRIBUTORS        # List of approved usernames
```

## Customization

Edit `.github/APPROVED_CONTRIBUTORS` to pre-approve users:
```
# One GitHub username per line
alice
bob
```

Edit the message in `pr-gate.yml` to customize what unapproved contributors see.

## Required Permissions

The workflows need these GitHub Actions permissions (already configured):
- `contents: write` - To update APPROVED_CONTRIBUTORS
- `issues: write` - To comment on issues
- `pull-requests: write` - To close PRs and comment

## Credits

Based on the contribution workflow from [pi-mono](https://github.com/badlogic/pi-mono).

## License

MIT
