import assert from "node:assert/strict";
import { generateId } from "../../src/libs/crypto.ts";
import type { Adapter } from "../../src/libs/database.ts";
import type { IcedGateSession } from "../../src/db/schema/session.ts";
import type { IcedGateUser } from "../../src/db/schema/user.ts";

export const databaseUser: IcedGateUser = {
  id: generateId(15),
  username: generateId(15),
  githubId: null,
};

export async function testAdapter(adapter: Adapter) {
  console.log("\n\x1B[38;5;63;1m[start]  \x1B[0mRunning adapter tests\x1B[0m\n");
  const databaseSession: IcedGateSession = {
    userId: databaseUser.id,
    id: generateId(40),
    // get random date with 0ms
    expiresAt: new Date(Math.floor(Date.now() / 1000) * 1000 + 10_000),
    fresh: false,
  };

  await test("getSessionAndUser() returns [ undefined, undefined ] on invalid session id", async () => {
    const result = await adapter.getSessionAndUser(databaseSession.id);
    assert.deepStrictEqual(result, [ undefined, undefined ]);
  });

  await test("getUserSessions() returns empty array on invalid user id", async () => {
    const result = await adapter.getUserSessions(databaseUser.id);
    assert.deepStrictEqual(result, []);
  });

  await test("setSession() creates session and getSessionAndUser() returns created session and associated user", async () => {
    await adapter.setSession(databaseSession);
    const result = await adapter.getSessionAndUser(databaseSession.id);
    assert.deepStrictEqual(result, [ databaseSession, databaseUser ]);
  });

  await test("deleteSession() deletes session", async () => {
    await adapter.deleteSession(databaseSession.id);
    const result = await adapter.getUserSessions(databaseSession.userId);
    assert.deepStrictEqual(result, []);
  });

  await test("updateSessionExpiration() updates session", async () => {
    await adapter.setSession(databaseSession);
    databaseSession.expiresAt = new Date(databaseSession.expiresAt.getTime() + 10_000);
    await adapter.updateSessionExpiration(databaseSession.id, databaseSession.expiresAt);
    const result = await adapter.getSessionAndUser(databaseSession.id);
    assert.deepStrictEqual(result, [ databaseSession, databaseUser ]);
  });

  await test("deleteExpiredSessions() deletes all expired sessions", async () => {
    const expiredSession: IcedGateSession = {
      userId: databaseUser.id,
      id: generateId(40),
      fresh: false,
      expiresAt: new Date(Math.floor(Date.now() / 1000) * 1000 - 10_000),
    };
    await adapter.setSession(expiredSession);
    await adapter.deleteExpiredSessions();
    const result = await adapter.getUserSessions(databaseSession.userId);
    assert.deepStrictEqual(result, [ databaseSession ]);
  });

  await test("deleteUserSessions() deletes all user sessions", async () => {
    await adapter.deleteUserSessions(databaseSession.userId);
    const result = await adapter.getUserSessions(databaseSession.userId);
    assert.deepStrictEqual(result, []);
  });

  console.log("\n\x1B[32;1m[success]  \x1B[0mAdapter passed all tests\n");
}

async function test(name: string, runTest: () => Promise<void>): Promise<void> {
  console.log(`\x1B[38;5;63;1m► \x1B[0m${ name }\x1B[0m`);
  try {
    await runTest();
    console.log("  \x1B[32m✓ Passed\x1B[0m\n");
  } catch (error) {
    console.log("  \x1B[31m✓ Failed\x1B[0m\n");
    throw error;
  }
}