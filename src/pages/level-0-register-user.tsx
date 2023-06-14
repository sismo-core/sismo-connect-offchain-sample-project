import BackButton from "@/components/BackButton";
import {
  SismoConnectButton,
  SismoConnectConfig,
  SismoConnectResponse,
  AuthType,
} from "@sismo-core/sismo-connect-react";
import axios from "axios";
import { useState } from "react";

export const sismoConnectConfig: SismoConnectConfig = {
  // you can create a new Sismo Connect app at https://factory.sismo.io
  appId: "0xdc8cf347fc27755ebab5c25ae7087b60",
  vaultAppBaseUrl: "https://vault-beta.zikies.io"
};

type UserType = {
  id: string;
};

export default function Level0RegisterUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verifiedUser, setVerifiedUser] = useState<UserType>(null);

  async function verify(response: SismoConnectResponse) {
    // first we update the react state to show the loading state
    setLoading(true);

    try {
      // We send the response to our backend to verify the proof
      const res = await axios.post(`/api/level-0-verify-user`, {
        response,
      });

      const user = res.data;

      // If the proof is valid, we update the user react state to show the user profile
      setVerifiedUser({
        id: user.id,
      });
    } catch (e) {
      // Else if the proof is invalid, we show an error message
      setError("Invalid response");
      console.error(e);
    } finally {
      // We set the loading state to false to show the user profile
      setLoading(false);
    }
  }

  return (
    <>
      <BackButton />
      <div className="container">
        {!verifiedUser && (
          <>
            <h1>Anonymous Registration</h1>
            <p className="subtitle-page" style={{ marginBottom: 40 }}>
              Level 0: request for a userId and save it in a database.
            </p>

            <SismoConnectButton
              config={sismoConnectConfig}
              auths={[{ authType: AuthType.VAULT }]}
              onResponse={(response: SismoConnectResponse) => verify(response)}
              loading={loading}
              text="Register with Sismo"
            />
            <>{error}</>
          </>
        )}

        {verifiedUser && (
          <>
            <h1>You have been registered</h1>
            <p className="subtitle-page">
              You shared an anonymous userId and saved it in a local database
            </p>
            <div className="profile-container">
              <div>
                <h2 style={{ marginBottom: 10 }}>User Profile</h2>
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
