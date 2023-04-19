// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  SismoConnect,
  SismoConnectServerConfig,
  AuthType,
  SismoConnectVerifiedResult,
} from "@sismo-core/sismo-connect-server";


/************************************************ */
/********* A SIMPLE IN-MEMORY DATABASE ********** */
/************************************************ */
type UserType = {
  id: string;
};

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
  appId: "0x112a692a2005259c25f6094161007967",
  devMode: {
    enabled: true,
  },
};

// create a SismoConnect instance
const sismoConnect = SismoConnect(sismoConnectConfig);



/************************************************ */
/***************** THE API ROUTE **************** */
/************************************************ */

// this is the API route that is called by the SismoConnectButton on level 0
export default async function handler(req: NextApiRequest, res: NextApiResponse<UserType | void>) {
  const { response } = req.body;

  try {
    const result: SismoConnectVerifiedResult = await sismoConnect.verify(response, {
      auths: [{ authType: AuthType.VAULT }],
    });

    // the userId is an app-specific, anonymous identifier of a vault
    // userId = hash(userVaultSecret, appId).
    const user = {
      id: result.getUserId(AuthType.VAULT),
    };

    // store the user in the database
    userStore.setUser(user);

    res.status(200).send(user);
  } catch (e: any) {
    console.error(e);
    res.status(400).send(null);
  }
}
