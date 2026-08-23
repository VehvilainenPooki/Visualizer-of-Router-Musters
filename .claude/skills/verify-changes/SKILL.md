---
name: verify-changes
description: Verify a completed task or plan in VoRM by type-checking, never by running or fetching the app. Must always apply when a task or plan is marked done.
---

# Verify changes

When a task or plan in this repo (VoRM) is complete, verify it by type-checking only.

## Steps

Run these from the `VoRM` directory, in order:

1. If the change touches routes under `src/client/routes`, or anything else the route tree (`src/client/routeTree.gen.ts`) depends on, run `npm run build` first. `vite build` regenerates the route tree as a side effect via the tanstack router plugin. Build artifacts are gitignored, so there's nothing to check before running it.
2. Run `npm run tsc`. This is the pass/fail gate. Treat any error it reports as unresolved work if it was caused by your changes. If you are not sure if an error is from your changes you can ask the user if they want to fix the error.
3. Give a concise summary of the changes to the user.

Skip step 1 when the change plainly cannot affect the route tree or compiled server output (a doc-only edit, a CSS tweak, a comment). When unsure, run it anyway, it's cheap.

## Never do this

Never verify a change by running the app, starting a dev server, or fetching/curling a running instance to see if it works. Type-checking (`npm run tsc`) is the only verification step for completed work here. If the user separately asks you to run or demo the app, that's a distinct request, not part of finishing a task.
