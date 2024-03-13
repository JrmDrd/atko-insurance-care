const { ManagementClient } = require("auth0");

const management = new ManagementClient({
  domain: 'atko-insurance.eu.auth0.com',
  clientId: 'uBSft2X3rqbnix5alIztstK24cVq0Xxz',
  clientSecret: '1Oz9cKGPflp-E3Sqoa5fmJHDG1L24mzVMbsah37S_I3v_eNglCqLFWS3WaZ6YN6E',
});

const getUser = async (userId) => {
  try {
    const user = await management.users.get({ id: userId });
    return user.data;
  } catch (e) {
    console.log(e);
  }
};

const getUsersByEmail = async (email) => {
    try {
        const users = await management.usersByEmail.getByEmail({email: email});
        return users.data;
    } catch (e) {
      console.log(e);
    }
};

const createUser = async(email, connection, user_metadata) => {
    try {
        let user = await management.users.create({email: email, connection: connection, user_metadata: user_metadata});
        return user;
    } catch (e) {
      console.log(e);
    }
}

const createUserWithPassword = async(email, connection, user_metadata, password) => {
  try {
      let user = await management.users.create({email: email, connection: connection, user_metadata: user_metadata, password: password});
      return user.data;
  } catch (e) {
    console.log(e);
  }
}

const linkUsers = async(userId, provider, connection, secondUserId) => {
  console.log('new user' +secondUserId);
  try {
    let user = await management.users.link({ id: userId }, {provider: provider, connection_id: connection, user_id: secondUserId});
    return user;
  } catch (e) {
    console.log(e);
  }
}

const convertProspect = async (prospectId, provider, connection, newClientId) => {
  try {
      let newClient = await management.users.create({email: email, connection: connection, user_metadata: user_metadata, password: 'DEMO92P@ss'});
      return user;
  } catch (e) {
    console.log(e);
  }
}

const updateUser = async (userId, payload) => {
  try {
    const user = await management.users.update({ id: userId }, payload);
    return user.data;
  } catch (e) {
    console.log(e);
  }
};

const deleteUser = async (userId) => {
  try {
    const user = await management.users.delete({ id: userId });
    return user;
  } catch (e) {
    console.log(e);
  }
};

const getOrganization = async (orgId, payload) => {
  try {
    const organizations = await management.organizations.get({ id: orgId });
    return organizations.data;
  } catch (e) {
    console.log(e);
  }
};

const getOrgMembers = async (orgId) => {
  try {
    const orgMembers = await management.organizations.getMembers({ id: orgId });
    return orgMembers.data;
  } catch (e) {
    console.log(e);
  }
};

const getOrgMemberRoles = async (orgId, userId) => {
  try {
    const roles = await management.organizations.getMemberRoles({ id: orgId, user_id: userId });
    return roles.data;
  } catch (e) {
    console.log(e);
  }
};

const deleteOrgMemberRoles = async (orgId, userId, roleIds) => {
  try {
    const res = await management.organizations.deleteMemberRoles({ id: orgId, user_id: userId }, { roles: roleIds });
    return res;
  } catch (e) {
    console.log(e);
  }
};

const addOrgMemberRoles = async (orgId, userId, roleIds) => {
  try {
    const res = await management.organizations.addMemberRoles({ id: orgId, user_id: userId }, { roles: roleIds });
    return res;
  } catch (e) {
    console.log(e);
  }
};

const createInvitation = async (orgId, memberDetails) => {
  try {
    const invitation = await management.organizations.createInvitation({ id: orgId }, memberDetails);
    return invitation;
  } catch (e) {
    console.log(e);
  }
};

const getInvitations = async (orgId, memberDetails) => {
  try {
    const invitationsRes = await management.organizations.getInvitations({ id: orgId });
    if (invitationsRes.status === 200) {
        return invitationsRes.data;
    }
    throw new Error(invitationsRes.error); // TODO handle this better
  } catch (e) {
    console.log(e);
  }
};

const accountLink = async(req, res, next) => {
  const {
    linking: { targetUserId },
  } = req.appSession;
  const { sub: authenticatedTargetUserId } = req.openidTokens.claims();
  if (authenticatedTargetUserId !== targetUserId) {
    debug(
      "Skipping account linking as the authenticated user(%s)  is different than target linking user (%s)",
      authenticatedTargetUserId,
      targetUserId
    );
    set(req, Errors.WrongAccount);
    return next();
  }
  
  debug(
    "User %s succesfully authenticated. Account linking with %s... ",
    authenticatedTargetUserId,
    targetUserId
  );
  const { id_token: targetIdToken } = req.openidTokens;
  const { sub: primaryUserId } = req.appSession.claims;
  
  try {
    await mergeMetadata(primaryUserId, authenticatedTargetUserId);
    await auth0Client.linkAccounts(primaryUserId, targetIdToken);
    debug("Accounts linked.");
  } catch (err) {
    debug("Linking failed %o", err);
  } finally {
    next();
  }
  }

module.exports = {
  getUser,
  getUsersByEmail,
  createUser,
  createUserWithPassword,
  updateUser,
  deleteUser,
  getOrganization,
  getOrgMembers,
  getOrgMemberRoles,
  addOrgMemberRoles,
  deleteOrgMemberRoles,
  createInvitation,
  getInvitations,
  accountLink,
  linkUsers
};
