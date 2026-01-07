'use server'

import { cookies } from "next/headers";

export const getCookieValue = async (key: string) => {
  const cookie = await cookies();
  return cookie.get(key)?.value;
};

export const setCookieValue = async (key: string, value: string) => {
  const cookie = await cookies();
  cookie.set(key, value);
};

export const deleteCookieValue = async (key: string) => {
  const cookie = await cookies();
  cookie.delete(key);
};

