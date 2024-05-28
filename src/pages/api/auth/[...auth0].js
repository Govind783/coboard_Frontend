import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        getLoginState(req, _res) {
          // FLOW IF ITS A NORMAL USER WITH A NORMAL LOGIN
          const state = {
            returnTo: '/Workspace',
          };

          // if the user has come via invite 
          if (req.query.invitingToSourceUuid) {
            state.invitingToSourceUuid = req.query.invitingToSourceUuid; // board uuid or workspace uuid
            state.invitersUuid = req.query.invitersUuid; // who has invited
            state.inviteToSource = req.query.inviteToSource; // wether it is board or workspace
            state.inviteUuid = req.query.inviteUuid; // invite uuid -> send this to backend and remove it from the cache object
            state.nameOfBoartOrWorkspace = req.query.nameOfBoartOrWorkspace; // name of board or workspace that user2 has been invited to
            
            state.workSpaceUuid = req.query.workSpaceUuid; // workspace uuid ---> need them specifically when inviting to board
            state.worksapceName = req.query.worksapceName; // workspace name ---> need them specifically when inviting to board
            // Optionally, modify the returnUrl based on the presence of inviteUuid and user1Uuid
            state.returnTo = `/invite/Complete?inviteUuid=${req.query.inviteUuid}&invitingToSourceUuid=${req.query.invitingToSourceUuid}&invitersUuid=${req.query.invitersUuid}&inviteToSource=${req.query.inviteToSource}&nameOfBoartOrWorkspace=${req.query.nameOfBoartOrWorkspace}&workSpaceUuid=${req.query.workSpaceUuid}&worksapceName=${req.query.worksapceName}`;
          }
          return {
            ...state,
            state: Buffer.from(JSON.stringify(state)).toString('base64'),
          };
        },
      });
    } catch (error) {
      res.status(error.status || 500).end(error.message);
    }
  },
});
