// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  SismoConnect,
  SismoConnectConfig,
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
const sismoConnectConfig: SismoConnectConfig = {
  // you can create a new Sismo Connect app at https://factory.sismo.io
  appId: "0xdc8cf347fc27755ebab5c25ae7087b60"
};

const options = {
  verifier: {
    hydraS3: {
      commitmentMapperPubKeys: [
        "0x1a443bff214ac92facdfc3970109c14a82a5d2cd145821815e2be893dcebb498",
        "0x1ab0875076678bbd098fabb491ef24096bb44e5ffe4e7f97859fbec050f48a6f"
      ] as [string, string],
      registryRoot: "0x1536e0192bb402ea37b8834b3f29ca9d0002c902f659d3c49c7442f705fc7526"
    },
  }
}

// create a SismoConnect instance
const sismoConnect = SismoConnect({ config: sismoConnectConfig, options });

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
