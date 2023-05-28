import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export const userPrefs = createCookie("user-prefs", {
  expires: new Date("2027-01-01"),
  maxAge: 604_800,
});