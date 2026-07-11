---
name: react-native-worklets @babel/generator pnpm isolation fix
description: Build failure caused by react-native-worklets plugin unable to find @babel/generator due to pnpm strict isolation. Fix uses packageExtensions.
---

# react-native-worklets missing @babel/generator in pnpm

## The rule
`react-native-worklets@0.5.1`'s Babel plugin calls `require('@babel/generator')` internally but does not declare it as a dependency. pnpm's strict isolation means it cannot find it even though it is installed elsewhere in the store.

**Fix:** add a `packageExtensions` block to `pnpm-workspace.yaml`:
```yaml
packageExtensions:
  "react-native-worklets":
    dependencies:
      "@babel/generator": "*"
```
Then run `pnpm install` to update the lockfile and commit both files.

**Why:** pnpm only links packages that are declared in a package's own dependency graph. `@babel/generator` is a transitive dep of `@babel/core` but is not re-exported as a direct dep by `react-native-worklets`, so the require fails at Metro bundle time (both locally and in the cloud build).

**How to apply:** Any time the build logs show `Cannot find module '@babel/generator'` from inside the worklets plugin require stack, this is the fix. Do not add a global `@babel/generator` override — `packageExtensions` is the correct scoped approach.
