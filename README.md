# 🛡️ Contribution Protection

**Stop drive-by AI slop PRs and support-question issues.** 

- Require contributors to open an issue first, get approved with a simple `lgtm` comment, then they can submit PRs
- AI-powered issue triage that classifies and handles support questions, bugs, and feature requests

## ⚡ One-Click Install

Run this in your repo root:

```bash
curl -sL https://raw.githubusercontent.com/hjanuschka/contribution-protection/main/install.sh | bash
```

**That's it.** Commit and push the generated files, then configure your API key.

---

## 📝 Manual Install

1. Copy the `.github/` folder to your repo
2. Configure an API key (see [API Key Setup](#api-key-setup))
3. Commit, push, done

---

## How It Works

### PR Protection Flow
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
```

**Without approval:** PR is auto-closed with a friendly message pointing them to open an issue first.

### Issue Triage Flow
```
New Issue                           AI Triage
      │                                  │
      ├─── Issue opened ────────────────►│
      │                                  │
      │    Analyzes content, classifies: │
      │    • support → close & redirect  │
      │    • bug → keep open             │
      │    • feature → label             │
      │    • unclear → ask for info      │
      │                                  │
      │◄── Takes configured action ──────┤
```

## Features

### PR Protection
- ✅ Auto-closes PRs from unapproved contributors
- ✅ Maintainers comment `lgtm` on issues to approve
- ✅ Contributors are auto-added to approved list
- ✅ Bots (dependabot, etc.) are allowed through
- ✅ Collaborators with write access bypass the gate

### Issue Triage (AI-Powered 🤖)
- ✅ Uses LLM to intelligently classify issues (support vs bug vs feature)
- ✅ Fully configurable actions per classification
- ✅ Custom prompts and instructions supported
- ✅ Works with multiple AI providers (Minimax, Anthropic, OpenAI, Google, etc.)
- ✅ Users can reopen if AI made a mistake

## Files Created

```
.github/
├── workflows/
│   ├── pr-gate.yml              # Checks PRs, closes unapproved ones
│   ├── approve-contributor.yml  # Handles 'lgtm' approval flow
│   └── triage-issues.yml        # AI-powered issue triage
├── scripts/
│   └── triage-issue.ts          # AI classification script (pi-core SDK)
├── APPROVED_CONTRIBUTORS        # List of approved usernames
```

---

## API Key Setup

The triage workflow uses [pi-core](https://github.com/badlogic/pi-mono) which supports many AI providers. Add **one** of these secrets to your repository:

### Recommended Providers (by cost)

| Provider | Secret Name | Get API Key |
|----------|-------------|-------------|
| **MiniMax** (cheapest) | `MINIMAX_API_KEY` | [minimaxi.com](https://www.minimaxi.com/) |
| **Google Gemini** | `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com/) |
| **Groq** (fast) | `GROQ_API_KEY` | [console.groq.com](https://console.groq.com/) |
| **OpenAI** | `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com/) |
| **Anthropic** | `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/) |

### All Supported Providers

| Provider | Environment Variable |
|----------|---------------------|
| Anthropic | `ANTHROPIC_API_KEY` |
| OpenAI | `OPENAI_API_KEY` |
| Google Gemini | `GEMINI_API_KEY` |
| MiniMax | `MINIMAX_API_KEY` |
| MiniMax (China) | `MINIMAX_CN_API_KEY` |
| Mistral | `MISTRAL_API_KEY` |
| Groq | `GROQ_API_KEY` |
| Cerebras | `CEREBRAS_API_KEY` |
| xAI | `XAI_API_KEY` |
| OpenRouter | `OPENROUTER_API_KEY` |
| Hugging Face | `HF_TOKEN` |

### Adding the Secret

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: e.g., `MINIMAX_API_KEY`
4. Value: Your API key
5. Click **Add secret**

---

## Configuration

### Triage Actions

Edit the `env` section in `.github/workflows/triage-issues.yml`:

```yaml
env:
  # What to do for each classification
  # Options: "ignore", "comment", "close", "comment_and_close", "label"
  ACTION_SUPPORT: "comment_and_close"  # Close support questions
  ACTION_BUG: "ignore"                  # Don't touch bugs
  ACTION_FEATURE: "label"               # Just add labels
  ACTION_UNCLEAR: "comment"             # Ask for more info
  
  # Labels to add (comma-separated)
  LABELS_SUPPORT: "support,auto-triaged"
  LABELS_BUG: ""
  LABELS_FEATURE: "enhancement,auto-triaged"
  LABELS_UNCLEAR: "needs-info,auto-triaged"
```

#### Action Options

| Action | Description |
|--------|-------------|
| `ignore` | Do nothing |
| `comment` | Post a comment based on classification |
| `close` | Close the issue silently |
| `comment_and_close` | Comment explaining why, then close |
| `label` | Just add the configured labels |

### Custom AI Instructions

Add extra instructions without replacing the entire prompt:

```yaml
env:
  EXTRA_INSTRUCTIONS: |
    - Issues mentioning "crash" should always be classified as bugs
    - Questions about pricing are support, not features
    - Be lenient with first-time contributors
```

### Custom Prompt (Advanced)

Replace the entire classification prompt:

```yaml
env:
  CUSTOM_PROMPT: |
    Analyze this GitHub issue:
    
    Title: {{title}}
    Body: {{body}}
    
    {{extra_instructions}}
    
    Respond with JSON only:
    {"classification": "support|bug|feature|unclear", "confidence": "high|medium|low", "reason": "...", "suggestedAction": "close|keep|needs_info"}
```

Placeholders:
- `{{title}}` - Issue title
- `{{body}}` - Issue body
- `{{extra_instructions}}` - Content from `EXTRA_INSTRUCTIONS`

### Pre-approve Contributors

Edit `.github/APPROVED_CONTRIBUTORS`:

```
# One GitHub username per line
alice
bob
dependabot[bot]
```

### Customize PR Gate Messages

Edit the message in `.github/workflows/pr-gate.yml` to customize what unapproved PR authors see.

---

## Manual Triage

You can manually trigger triage on any issue:

1. Go to **Actions** → **Triage Issues (AI-Powered)**
2. Click **Run workflow**
3. Enter the issue number
4. Click **Run workflow**

---

## Required Permissions

The workflows need these GitHub Actions permissions (already configured):

- `contents: write` - To update APPROVED_CONTRIBUTORS
- `issues: write` - To comment on and close issues
- `pull-requests: write` - To close PRs and comment

---

## Credits

- Based on the contribution workflow from [pi-mono](https://github.com/badlogic/pi-mono)
- AI triage powered by [pi-core SDK](https://github.com/badlogic/pi-mono)
- Inspired by feedback from [@ryanrhughes](https://github.com/ryanrhughes) on handling support issues

Thanks to [@badlogicgames](https://github.com/badlogicgames) and the pi community! 🙏

## License

MIT
