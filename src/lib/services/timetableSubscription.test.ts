import { beforeEach, describe, expect, mock, test } from "bun:test";

import type SubscriptionKey from "@/lib/types/SubscriptionKey";

const requests: { path: string; body: unknown }[] = [];
let subscriptionKey: SubscriptionKey | null = null;
let timeZone = "Europe/Sarajevo";

mock.module("@/lib/api/client", () => ({
  fetchClient: {
    POST: (path: string, { body }: { body: unknown }) => {
      requests.push({ path, body });
      return Promise.resolve({ error: undefined });
    },
  },
}));
mock.module("@/lib/state/timetableSubscriptionStore", () => ({
  useTimetableSubscriptionStore: {
    getState: () => ({
      subscriptionKey,
      setSubscriptionKey: (key: SubscriptionKey | null) => {
        subscriptionKey = key;
      },
    }),
  },
}));
mock.module("expo-localization", () => ({
  getCalendars: () => [{ timeZone }],
}));
mock.module("@react-native-firebase/messaging", () => ({
  getToken: () => Promise.resolve("unused"),
}));

const { refreshTimetableSubscription } =
  await import("./timetableSubscription");

const key: SubscriptionKey = {
  direction: null,
  department: "COMPUTER_SCIENCE",
  year: "SECOND",
  studyProgramId: -54,
  fcmToken: "old-token",
  timeZone: "Europe/Sarajevo",
};

describe("refreshTimetableSubscription", () => {
  beforeEach(() => {
    requests.length = 0;
    subscriptionKey = { ...key };
    timeZone = "Europe/Sarajevo";
  });

  test("does nothing while token and time zone are unchanged", async () => {
    await refreshTimetableSubscription("old-token");
    expect(requests).toEqual([]);
  });

  test("moves the subscription to a rotated token", async () => {
    await refreshTimetableSubscription("new-token");
    expect(requests).toEqual([
      {
        path: "/messaging/unsubscribe",
        body: { studyProgramId: -54, fcmToken: "old-token" },
      },
      {
        path: "/messaging/subscribe",
        body: {
          studyProgramId: -54,
          fcmToken: "new-token",
          timeZone: "Europe/Sarajevo",
        },
      },
    ]);
    expect(subscriptionKey?.fcmToken).toBe("new-token");
  });

  test("resubscribes with the new time zone", async () => {
    timeZone = "America/New_York";
    await refreshTimetableSubscription("old-token");
    expect(requests).toEqual([
      {
        path: "/messaging/subscribe",
        body: {
          studyProgramId: -54,
          fcmToken: "old-token",
          timeZone: "America/New_York",
        },
      },
    ]);
    expect(subscriptionKey?.timeZone).toBe("America/New_York");
  });

  test("records the token of subscriptions made by older app versions", async () => {
    subscriptionKey = {
      direction: null,
      department: "COMPUTER_SCIENCE",
      year: "SECOND",
      studyProgramId: -54,
    };
    await refreshTimetableSubscription("current-token");
    expect(requests.map(({ path }) => path)).toEqual(["/messaging/subscribe"]);
    expect(subscriptionKey).toMatchObject({
      fcmToken: "current-token",
      timeZone: "Europe/Sarajevo",
    });
  });
});
