import { AccessToken } from "livekit-server-sdk";
// import { NextApiRequest, NextApiResponse } from "next";
let activeCalls = {};

export default async function handler(req, res) {
  const room = req.query.room;
  const username = req.query.username;
  if (req.method !== "GET") {
    return res.status(400).json({ error: "Invalid method" });
  } else if (!room) {
    return res.status(400).json({ error: 'Missing "room" query parameter' });
  } else if (!username) {
    return res.status(400).json({ error: 'Missing "username" query parameter' });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  const at = new AccessToken(apiKey, apiSecret, { identity: username });

  at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });
  res.status(200).json({ token: await at.toJwt() });
}