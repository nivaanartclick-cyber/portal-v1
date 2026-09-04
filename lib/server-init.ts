/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let initialized = false;

export async function ensureInitialized(): Promise<void> {
  if (initialized) return;
  const { initializeDataStore } = await import('@/db/index');
  await initializeDataStore();
  initialized = true;
}
