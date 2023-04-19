// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  SismoConnect,
  SismoConnectServerConfig,
  AuthType,
  SismoConnectVerifiedResult,
} from "@sismo-core/sismo-connect-server";

const sismoConnectConfig: SismoConnectServerConfig = {
  appId: "0x112a692a2005259c25f6094161007967",
  devMode: {
    enabled: true,
  },
};

const userStore = new Map<string, string>();

const sismoConnect = SismoConnect(sismoConnectConfig);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    userName: string;
    userId: string;
  } | void>
) {
  const { response } = req.body;

  try {
    const result: SismoConnectVerifiedResult = await sismoConnect.verify(response, {
      claims: [{ groupId: "0x682544d549b8a461d7fe3e589846bb7b" }],
      auths: [{ authType: AuthType.VAULT }],
      signature: {
        message: "",
        isSelectableByUser: true,
      },
    });

    // the userId is an app-specific, anonymous identifier of a vault
    // userId = hash(userVaultSecret, appId).
    const userId = result.getUserId(AuthType.VAULT);
    const signedMessage = result.getSignedMessage();

    // save the user name (signedMessage) in the user store DB
    userStore.set(userId, signedMessage);

    res.status(200).send({
      userId: userId,
      userName: signedMessage,
    });
  } catch (e: any) {
    console.error(e);
    res.status(400).send(null);
  }
}
