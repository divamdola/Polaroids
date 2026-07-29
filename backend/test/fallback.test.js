import test from 'node:test';
import assert from 'node:assert/strict';

import { createFallbackUser, getFallbackProducts, getFallbackUsers } from '../src/utils/fallbackData.js';

test('fallback data exposes starter products and can create a local user', () => {
  const products = getFallbackProducts();
  assert.ok(Array.isArray(products));
  assert.ok(products.length > 0);

  const user = createFallbackUser({ name: 'Local Tester', email: 'local@example.com', password: 'secret' });

  assert.equal(user.email, 'local@example.com');
  assert.equal(getFallbackUsers().some((candidate) => candidate.email === 'local@example.com'), true);
});
