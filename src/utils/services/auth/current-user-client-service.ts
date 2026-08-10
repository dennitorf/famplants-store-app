let synchronization: Promise<void> | undefined;

export function ensureCurrentUserClient(): Promise<void> {
  if (!synchronization) {
    synchronization = fetch("/api/current-user", {
      credentials: "include",
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Current user synchronization failed (${response.status})`);
        }
      })
      .catch((error) => {
        synchronization = undefined;
        throw error;
      });
  }
  return synchronization;
}
