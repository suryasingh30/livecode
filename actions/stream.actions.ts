"use server";

import { currentUser } from "@clerk/nextjs/server"; // Correct import for Clerk
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error("User is not logged in!");
  }
  if (!apiKey) {
    throw new Error("API key not found!");
  }
  if (!apiSecret) {
    throw new Error("API Secret key not found!");
  }

  const client = new StreamClient(apiKey, apiSecret);
  
  const validity = 60 * 60;

  const token = client.generateUserToken({
      user_id: user.id, // Clerk user ID
      validity_in_seconds: validity, // Token validity period (optional)
  });

  return token;
};
