import test from 'node:test';
import assert from 'node:assert/strict';

import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

test('backend package exists', () => {
  assert.equal(packageJson.name, 'polaroids-backend');
});
