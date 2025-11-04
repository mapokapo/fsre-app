import LoginResponse from "@/lib/types/LoginResponse";
import { timeout } from "@/lib/utils";

/**
 * Logs in a student using an authentication code.
 *
 * @param authCode the authentication code the student received from the university administration system
 * @returns a promise that resolves to a LoginResponse containing the stateful authentication token
 */
export async function login(authCode: string): Promise<LoginResponse> {
  // TODO: implement real login logic here
  await timeout(1000); // Simulate network delay

  return {
    token: "mocked-authentication-token",
  };
}
