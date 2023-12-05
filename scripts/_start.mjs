#!/usr/bin/env zx
export function startView() {
  $`pnpm -F view-home start`;
  $`pnpm -F view-setting start`;
}

export function startMain() {
  $`pnpm -F example-main start`
}
