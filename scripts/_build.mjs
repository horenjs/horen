#!/usr/bin/env zx
async function buildEipc() {
  await $`pnpm -F eipc build`;
}

async function buildMain() {
  await $`pnpm -F example-main build`;
}

async function buildViews() {
  await $`pnpm -F view-home build`;
  await $`pnpm -F view-setting build`;
}

export async function buildAll() {
  await buildEipc();
  await buildViews();
  await buildMain();
}
