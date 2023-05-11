// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  SismoConnect,
  SismoConnectServerConfig,
  AuthType,
  SismoConnectVerifiedResult,
  ClaimType,
} from "@sismo-core/sismo-connect-server";
import { devGroups } from "../../../config";

/************************************************ */
/********* A SIMPLE IN-MEMORY DATABASE ********** */
/************************************************ */

type UserType = {
  id: string;
  name: string;
  twitterId: string;
};

// this is a simple in-memory user store
class MyLocalDataBase {
  private userStore = new Map<string, UserType>();

  public getUser(userId: string): UserType | undefined {
    return this.userStore.get(userId);
  }

  public setUser(user: UserType): void {
    this.userStore.set(user.id, user);
  }
}
const userStore = new MyLocalDataBase();

/************************************************ */
/************* CONFIGURE SISMO CONNECT ********** */
/************************************************ */

// define the SismoConnect configuration
const sismoConnectConfig: SismoConnectServerConfig = {
  // you can create a new Sismo Connect app at https://factory.sismo.io
  appId: "0xf4977993e52606cfd67b7a1cde717069",
  devMode: {
    enabled: true,
  },
};

// create a SismoConnect instance
const sismoConnect = SismoConnect(sismoConnectConfig);

/************************************************ */
/***************** THE API ROUTE **************** */
/************************************************ */

// this is the API route that is called by the SismoConnectButton
export default async function handler(req: NextApiRequest, res: NextApiResponse<UserType | void>) {
  const { response } = req.body;

  try {
    const result: SismoConnectVerifiedResult = await sismoConnect.verify(response, {
      auths: [
        { authType: AuthType.VAULT },
        {
          authType: AuthType.TWITTER,
          isOptional: true,
          isSelectableByUser: true, // enable the user to selectively share its twitter ids
        },
      ],
      claims: [
        { groupId: devGroups[0].groupId },
        {
          groupId: devGroups[1].groupId,
          isOptional: true,
          claimType: ClaimType.GTE,
          value: 2,
        },
      ],
      signature: {
        message: "",
        isSelectableByUser: true,
      },
    });

    const user = {
      // the userId is an app-specific, anonymous identifier of a vault
      // userId = hash(userVaultSecret, appId).
      id: result.getUserId(AuthType.VAULT),
      name: result.getSignedMessage(),
      twitterId: result.getUserId(AuthType.TWITTER),
    };

    // save the user in the user store DB
    userStore.setUser(user);

    res.status(200).send(user);
  } catch (e: any) {
    console.error(e);
    res.status(400).send(null);
  }
}
