// pages/api/token.js
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function token(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res);
    // Optionally, send the token to the client - be cautious with this approach
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});
