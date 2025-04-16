# Contributing to RESTStop

Thanks for your interest in contributing. RESTStop is meant to be simple and useful, so we try to keep the codebase clean and easy to work with.

---

## Getting Started

1. Fork the repository
2. Clone your fork
3. Run `npm install`
4. Start the app with `npm start`

---

## How to Contribute

- **Bug fixes** – If you find something broken, feel free to fix it
- **Features** – Keep it focused. No bloat. If it adds real value, it’s welcome
- **Design/UI** – Small UI improvements are fine, but we're keeping it minimal on purpose

If you're unsure whether an idea fits, open an issue first.

---

## Submitting a Pull Request

1. Create a new branch from `main`. Make your branch name something descriptive. For example, if you're adding a settings feature, name your branch something like `add-settings-feature`.
2. Make your changes
3. Keep commits clean and descriptive
4. Submit a pull request with a clear explanation

Generally, try to keep your PR to a maximum of 10 commits.  You can utilize interactive rebase to squash/fixup related commits, thus reducing the amount of commits.
If possible, squashing down to 1 descriptive commit would be preferred (reducing the amount of commits to the main branch).  However, if your commits are logically presented a maintainer may not require you to do so.

---

## Rebasing is your friend

- To pull up-to-date code from the main branch into your branch, we prefer the use of rebasing.
- An example command flow from your branch:
1. `git fetch --all`
2. `git rebase origin/main`

From there, resolve any merge conflicts (if there are any), and follow the rebasing instructions presented to you.

---

## Code Style

- Use standard JS formatting
- Keep UI consistent with the existing layout (TailwindCSS)
- Don't overengineer — simpler is better

---

## LocalStorage Structure

If you're working on request history or settings, all persistent data is stored via `localStorage` for now. Keep things lightweight.

---

## Questions?

Open an issue or start a discussion. We’ll respond when we can.