import BackButton from "@/components/BackButton";
import {
  SismoConnectButton,
  SismoConnectClientConfig,
  SismoConnectResponse,
  AuthType,
} from "@sismo-core/sismo-connect-react";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export const sismoConnectConfig: SismoConnectClientConfig = {
  appId: "0x112a692a2005259c25f6094161007967",
  devMode: {
    // enable or disable dev mode here to create development groups and use the development vault.
    enabled: true,
  },
};

type UserType = {
  id: string;
};

export default function Level0RegisterUser() {
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [verifiedUser, setVerifiedUser] = useState<UserType>(null);

  async function verify(response: SismoConnectResponse) {
    // first we update the react state to show the loading state
    setVerifying(true);

    try {
      // We send the response to our backend to verify the proof
      const res = await axios.post(`/api/level-0-verify-user`, {
        response,
      });

      const user = res.data.user;

      // If the proof is valid, we update the user react state to show the user profile
      setVerifiedUser({
        id: user.id,
      });

    } catch (e) {
      // else if the proof is invalid, we show an error message
      setError("Invalid response");
      console.error(e);
    } finally {
      // We set the loading state to false to show the user profile 
      setVerifying(false);
    }
  };

  return ( <>
      <BackButton/>
      <div className="container">
        {!verifiedUser && (
          <>
            <h1 style={{ marginBottom: 10 }}>Share your anonymous id</h1>
            <p style={{ marginBottom: 40 }}>Level 0: request for a user id and save it in a database.</p>

            <SismoConnectButton
              config={sismoConnectConfig}
              auths={[{ authType: AuthType.VAULT }]}
              onResponse={(response: SismoConnectResponse) => verify(response)}
              verifying={verifying}
              callbackPath={"/level-0-register-user"}
            />
            <>{error}</>
          </>
        )}

        {verifiedUser && (
          <>
            <h1>Proof received</h1>
            <p style={{ marginBottom: 20 }}>
              The user has shared his anonymous userId and we saved it in our local database
            </p>
            <div className="profile-container">
              <div>
                <h2>User Profile</h2>
                <b>UserId:</b>
                <p>{verifiedUser?.id}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
