# Contributing to Orb Oracle EVM Frontend

⭐ First off, thank you for considering contributing to this project! ⭐

We welcome contributions from everyone. By participating in this project, you agree to abide by our Code of Conduct.

## 💬 IMPORTANT: Discord Communication is Mandatory

**All project communication MUST happen on Discord. We do not pay attention to GitHub notifications.**

- Join the specific project channel **[#orb-oracle](https://discord.com/channels/995968619034984528/1504406274693922837)** on our Discord server before starting any work.
- Post your PR/issue updates in the specific **[#orb-oracle](https://discord.com/channels/995968619034984528/1504406274693922837)** channel (**MANDATORY**).
- All discussions, questions, and updates should be on Discord.
- GitHub is for code only - Discord is for communication.

**PRs without Discord updates will not be reviewed or may face delays.**

---

## 📖 Table of Contents

- [How Can I Contribute?](#how-can-i-contribute)
- [Coding with AI](#coding-with-ai)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Code Style Guidelines](#code-style-guidelines)
- [Community Guidelines](#community-guidelines)

---

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- Clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Environment details (Browser, OS, Node version, etc.)

### Suggesting Features

Feature suggestions are welcome! Please:

- Check if the feature has already been suggested
- Provide a clear description of the feature
- Explain why this feature would be useful
- Include mockups or examples of how the UI should look

### Contributing Code

1. **Submit an Issue First**: For features, bugs, or enhancements, create an issue first.
2. **Get Assigned**: Wait to be assigned before starting work.
3. **Submit Your PR**: Once assigned, create a PR addressing the issue.

---

## 🤖 Coding with AI

We accept the use of AI-powered tools (GitHub Copilot, ChatGPT, Claude, Cursor, Antigravity, etc.) for contributions, whether for code, tests, or documentation.

⚠️ However, transparency is required: if you use AI assistance, please mention it in your PR description. This helps maintainers during code review and ensure the quality of contributions.

What we expect:
- **Disclose AI usage**: A simple note like "Generated initial component layout with Claude" is sufficient.
- **Specify the scope**: Indicate which parts of your contribution involved AI assistance.
- **Review AI-generated content**: Ensure you understand and have verified any AI-generated code before submitting.

---

## 🚀 Getting Started

### Prerequisites

You must have **Node.js** (v18+) and a package manager (npm, yarn, or pnpm) installed.

### Setup

1. **Fork the Repository**
   (Click the 'Fork' button at the top right of the GitHub page)

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/OrbOracle-EVM-Frontend.git
   cd OrbOracle-EVM-Frontend
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/StabilityNexus/OrbOracle-EVM-Frontend.git
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```

---

## 🔄 Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feat/short-desc
# or
git checkout -b fix/short-desc
```

### 2. Make Your Changes
- Write clean, readable Next.js (App Router), React, and TypeScript code.
- Follow the project's styling guidelines (use Tailwind CSS and shadcn/ui).
- Ensure pages are responsive on mobile and desktop devices.

### 3. Verify Your Changes
Before committing, ensure your code has zero linting errors or compilation warnings:
```bash
# Run lint check
npm run lint

# Run TypeScript type check
npx tsc --noEmit
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: Add composed creation forms

Implement components for Multiplication and Division compositions
and connect creation forms to the ComposedOracleFactory contract."
```

**Commit Message Format:**
All commit messages must strictly adhere to the [Chris Beams Git Commit Guide](https://cbea.ms/git-commit/) (use the imperative mood, capitalize the subject line, wrap the body at 72 characters, and explain *what* and *why*).

Use the following prefixes:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `chore:` for maintenance tasks

### 5. Keep Your Branch Updated
```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push Your Changes
```bash
git push origin feat/short-desc
```

---

## 📤 Pull Request Guidelines

### Before Submitting

- [ ] Your code follows the project's formatting and style standards.
- [ ] TypeScript compilation check completes with no errors (`npx tsc --noEmit`).
- [ ] You've rebased with the latest upstream changes.
- [ ] You've disclosed any AI usage in the PR description.

### Submitting a Pull Request

1. Go to the original repository on GitHub.
2. Click "New Pull Request".
3. Select your fork and branch.
4. Fill out the PR template with a clear description and testing steps.

---

## 📝 Code Style Guidelines

### Frontend Standards
- **Next.js conventions:** Always use the Next.js 14 App Router structure.
- **Styling:** Follow a consistent theme using CSS variables and Tailwind classes. Avoid writing raw inline CSS.
- **TypeScript:** Enforce strict typing. Do not use `any` unless absolutely necessary, and provide appropriate interface types for React component props.
- **Components:** Write clean, modular, and reusable components. Group utility functions and constants into separate folders (`utils/`, `hooks/`).

---

## 🌟 Community Guidelines

### Progress Updates
- Post your PR in the project's Discord channel for visibility (**IMPORTANT**).
- Respond to review comments promptly.
- If you can no longer work on an issue, let maintainers know on Discord.

Thank you for contributing to Orb Oracle! Your efforts help make this project better for everyone. 🚀
