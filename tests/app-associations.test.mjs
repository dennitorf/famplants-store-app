import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

function loadRoute(name) {
  const source = readFileSync(new URL(`../src/app/.well-known/${name}/route.ts`, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const exports = {};
  new Function('exports', outputText)(exports);
  return exports;
}

test('Apple association advertises only catalog routes and the configured app', async () => {
  const previous = process.env.IOS_APP_ID;
  process.env.IOS_APP_ID = 'TESTTEAM.com.famplants.app';
  try {
    const response = loadRoute('apple-app-site-association').GET();
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /application\/json/);
    const body = await response.json();
    assert.equal(body.applinks.details[0].appID, 'TESTTEAM.com.famplants.app');
    assert.ok(body.applinks.details[0].paths.includes('/plants/*'));
    assert.ok(body.applinks.details[0].paths.includes('/products/*'));
  } finally {
    if (previous === undefined) delete process.env.IOS_APP_ID;
    else process.env.IOS_APP_ID = previous;
  }
});

test('Android refuses missing certificates and accepts multiple release fingerprints', async () => {
  const previous = process.env.ANDROID_APP_SHA256_FINGERPRINTS;
  const route = loadRoute('assetlinks.json');
  try {
    delete process.env.ANDROID_APP_SHA256_FINGERPRINTS;
    assert.equal(route.GET().status, 503);
    process.env.ANDROID_APP_SHA256_FINGERPRINTS = 'invalid';
    assert.equal(route.GET().status, 503);
    const fingerprint = Array(32).fill('AB').join(':');
    process.env.ANDROID_APP_SHA256_FINGERPRINTS = fingerprint;
    const response = route.GET();
    assert.equal(response.status, 200);
    const [statement] = await response.json();
    assert.deepEqual(statement.target.sha256_cert_fingerprints, [fingerprint]);
    assert.deepEqual(statement.relation, ['delegate_permission/common.handle_all_urls']);
  } finally {
    if (previous === undefined) delete process.env.ANDROID_APP_SHA256_FINGERPRINTS;
    else process.env.ANDROID_APP_SHA256_FINGERPRINTS = previous;
  }
});
