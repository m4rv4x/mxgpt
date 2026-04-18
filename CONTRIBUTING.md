# Contributing to mxgpt

Thanks for taking the time to contribute! 🎉

## Ways to contribute

- 🐛 **Bug reports** — open an issue with steps to reproduce
- ✨ **Feature requests** — open an issue describing the use case
- 📖 **Docs** — typos, clarifications, new examples
- 💻 **Code** — pick an open issue or propose a new feature first

## Development

```bash
git clone https://github.com/m4rv4x/mxgpt.git
cd mxgpt

# Install
npm install

# Copy env and edit
cp .env.example .env

# Run dev
npm start
```

Or using Docker:

```bash
docker compose up
```

## PR checklist

- [ ] Code follows the existing style
- [ ] No secrets or credentials in the diff
- [ ] README updated if user-visible behavior changes
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `docs:`…)

## Reporting security issues

Don't open public issues for security reports — contact the maintainer
directly via a GitHub private security advisory.
