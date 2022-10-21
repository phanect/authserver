import type { SessionAdapter } from "lucia-sveltekit/adapter";
import { test, end, validate } from "./../../test.js";
import { User } from "./../../db.js";
import { Database } from "../../index.js";

const INVALID_INPUT = "INVALID_INPUT";

export const testSessionAdapter = async (
    adapter: SessionAdapter,
    db: Database,
    endProcess = true
) => {
    const clearAll = async () => {
        await db.clearSessions();
        await db.clearUsers();
    };
    await clearAll();
    await test("getSession()", "Return the correct session", async () => {
        const user = new User();
        const session = user.createSession();
        await db.insertUser(user.getSchema());
        await db.insertSession(session.getSchema());
        let returnedSession = await adapter.getSession(session.id);
        returnedSession = validate.isNotNull(
            returnedSession,
            "Target was not returned"
        );
        validate.isTrue(
            session.validateSchema(returnedSession),
            "Target is not the expected value",
            session.getSchema(),
            returnedSession
        );
        await clearAll();
    });
    await test(
        "getSession()",
        "Return null if session id is invalid",
        async () => {
            const session = await adapter.getSession(INVALID_INPUT);
            validate.isNull(session, "Target was not returned");
            await clearAll();
        }
    );
    await test(
        "getSessionsByUserId()",
        "Return the correct session",
        async () => {
            const user = new User();
            const session = user.createSession();
            await db.insertUser(user.getSchema());
            await db.insertSession(session.getSchema());
            const sessions = await adapter.getSessionsByUserId(session.userId);
            validate.includesSomeItem(
                sessions,
                session.validateSchema,
                "Target is not included in the returned value",
                session.getSchema()
            );
            await clearAll();
        }
    );
    await test(
        "getSessionsByUserId()",
        "Returns an empty array if no sessions exist",
        async () => {
            const sessions = await adapter.getSessionsByUserId(INVALID_INPUT);
            validate.isEqual(sessions.length, 0, "Target was not returned");
        }
    );
    await test(
        "setSession()",
        "Insert a user's session into session table",
        async () => {
            const user = new User();
            const session = user.createSession();
            await db.insertUser(user.getSchema());
            await adapter.setSession(session.id, {
                userId: session.userId,
                expires: session.expires,
                idlePeriodExpires: session.idlePeriodExpires,
            });
            const sessions = await db.getSessions();
            validate.includesSomeItem(
                sessions,
                session.validateSchema,
                "Target not found",
                session.getSchema()
            );
            await clearAll();
        }
    );
    await test(
        "deleteSessionsByUserId()",
        "Delete a user's session from session table",
        async () => {
            const user = new User();
            const session = user.createSession();
            await db.insertUser(user.getSchema());
            await db.insertSession(session.getSchema());
            await adapter.deleteSessionsByUserId(session.userId);
            const sessions = await db.getSessions();
            validate.notIncludesSomeItem(
                sessions,
                session.validateSchema,
                "Target was not deleted from user table",
                session.getSchema()
            );
            await clearAll();
        }
    );
    await test(
        "deleteSession()",
        "Delete a user's session from session table",
        async () => {
            const user = new User();
            const session = user.createSession();
            await db.insertUser(user.getSchema());
            await db.insertSession(session.getSchema());
            await adapter.deleteSession(session.id);
            const sessions = await db.getSessions();
            validate.notIncludesSomeItem(
                sessions,
                session.validateSchema,
                "Target does not exist in user table",
                session.getSchema()
            );
            await clearAll();
        }
    );
    await clearAll();
    if (!endProcess) return;
    end();
};
