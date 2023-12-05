#!/usr/bin/env zx
export async function packageAll() {
  await $`electron-forge package`;
}
