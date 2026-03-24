# BladeMart Git Workflow

This document defines a clean public GitHub workflow for contributors and maintainers.

## 1. Branching Model

- `main`: stable, release-ready branch
- `develop`: integration branch for upcoming work (optional but recommended)
- Feature branches: `feature/<short-name>`
- Bugfix branches: `fix/<short-name>`
- Chore/docs branches: `chore/<short-name>`, `docs/<short-name>`
- Hotfix branches: `hotfix/<short-name>` (cut from `main`)

## 2. Branch Naming Conventions

- `feature/auth-jwt-refresh`
- `feature/product-filtering`
- `fix/checkout-session-validation`
- `docs/readme-setup-refresh`
- `hotfix/stripe-webhook-signature`

Use lowercase kebab-case.

## 3. Standard Contribution Flow

1. Sync local repository:

```bash
git checkout main
git pull origin main
```

2. Create a branch:

```bash
git checkout -b feature/<short-name>
```

3. Make focused changes and commit in logical chunks.
4. Push branch:

```bash
git push -u origin feature/<short-name>
```

5. Open a Pull Request into `develop` (or directly into `main` if no `develop` branch is used).
6. Wait for CI, address review comments, and merge.

## 4. Commit Message Conventions

Use Conventional Commits where possible:

- `feat(scope): ...`
- `fix(scope): ...`
- `docs(scope): ...`
- `test(scope): ...`
- `chore(scope): ...`
- `refactor(scope): ...`

Examples:

- `feat(checkout): validate stock before creating Stripe session`
- `fix(auth): return 401 on invalid token`
- `docs(readme): update local setup instructions`

## 5. Pull Request Guidelines

A PR should:

- Have a clear title and summary
- Reference related issue/task when available
- Include testing notes (manual and automated)
- Be scoped to one concern when possible
- Pass all CI checks before merge

## 6. Suggested Repository Settings (GitHub)

Enable branch protection for `main`:

- Require pull request before merging
- Require status checks to pass
- Require up-to-date branch before merging
- Block force pushes
- Block branch deletion

Optional for `develop`:

- Require pull request
- Require status checks

## 7. Release Flow

If using `develop`:

1. Merge completed work into `develop` via PRs.
2. Validate integration in `develop`.
3. Create PR from `develop` to `main`.
4. Merge and tag release.

```bash
git checkout main
git pull origin main
git tag -a v1.0.0 -m "v1.0.0"
git push origin v1.0.0
```

If not using `develop`, merge feature branches directly to `main` through PRs and tag releases at milestones.

## 8. Hotfix Flow

1. Branch from `main`:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/<short-name>
```

2. Implement fix, commit, and push.
3. Open PR to `main` and merge after review.
4. Tag patch release (example: `v1.0.1`).
5. If `develop` exists, merge hotfix back into `develop`.

## 9. Suggested .gitignore Practice

Never commit:

- `.env` files
- API keys and secrets
- local build artifacts
- editor-specific local state

## 10. Fast Command Reference

```bash
# Start feature work
git checkout main
git pull origin main
git checkout -b feature/new-capability

# Commit and push
git add .
git commit -m "feat(scope): concise summary"
git push -u origin feature/new-capability

# Keep branch updated
git fetch origin
git rebase origin/main
```
