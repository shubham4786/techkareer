import { env } from "@/env";
export function appendToBaseUrl( endpoint: string): string {
    return `${env.NEXT_PUBLIC_APIBASEURL}/${endpoint}`;
  }