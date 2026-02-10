#!/bin/bash
# Contribution Protection Installer
# Run: curl -sL https://raw.githubusercontent.com/hjanuschka/contribution-protection/main/install.sh | bash

set -e

REPO_URL="https://raw.githubusercontent.com/hjanuschka/contribution-protection/main"

echo "🛡️  Installing Contribution Protection..."

# Create directories
mkdir -p .github/workflows
mkdir -p .github/scripts

# Download files
echo "📥 Downloading workflows..."
curl -sL "$REPO_URL/.github/workflows/pr-gate.yml" -o .github/workflows/pr-gate.yml
curl -sL "$REPO_URL/.github/workflows/approve-contributor.yml" -o .github/workflows/approve-contributor.yml
curl -sL "$REPO_URL/.github/workflows/triage-issues.yml" -o .github/workflows/triage-issues.yml
curl -sL "$REPO_URL/.github/scripts/triage-issue.ts" -o .github/scripts/triage-issue.ts

# Only create APPROVED_CONTRIBUTORS if it doesn't exist
if [ ! -f .github/APPROVED_CONTRIBUTORS ]; then
  echo "📝 Creating APPROVED_CONTRIBUTORS file..."
  curl -sL "$REPO_URL/.github/APPROVED_CONTRIBUTORS" -o .github/APPROVED_CONTRIBUTORS
else
  echo "📝 APPROVED_CONTRIBUTORS already exists, skipping..."
fi

echo ""
echo "✅ Done! Files created:"
echo "   .github/workflows/pr-gate.yml"
echo "   .github/workflows/approve-contributor.yml"
echo "   .github/workflows/triage-issues.yml"
echo "   .github/scripts/triage-issue.ts"
echo "   .github/APPROVED_CONTRIBUTORS"
echo ""
echo "Next steps:"
echo "  1. git add .github/"
echo "  2. git commit -m 'Add contribution protection'"
echo "  3. git push"
echo ""
echo "🎉 New contributors must now open an issue first!"
echo "   Approve them by commenting 'lgtm' on their issue."
echo ""
echo "📋 AI-powered issue triage enabled!"
echo "   Add MINIMAX_API_KEY (or other) to repo secrets."
echo "   Customize the prompt in .github/scripts/triage-issue.ts"
