import BackButton from "@/components/BackButton";
import {
  SismoConnectButton,
  SismoConnectClientConfig,
  SismoConnectResponse,
  AuthType,
} from "@sismo-core/sismo-connect-react";
import axios from "axios";
import { useState } from "react";

export const sismoConnectConfig: SismoConnectClientConfig = {
  // You can create a new Sismo Connect app at https://factory.sismo.io
  appId: "0x112a692a2005259c25f6094161007967",
  devMode: {
    // Enable or disable dev mode here to create development groups and use the development vault.
    enabled: true,
    devGroups: [
      {
        // Proof of Humanity group : https://factory.sismo.io/groups-explorer?search=0x682544d549b8a461d7fe3e589846bb7b
        groupId: "0x682544d549b8a461d7fe3e589846bb7b",
        // Add your dev addresses here to become eligible in the DEV env
        data: [
          "0x2b9b9846d7298e0272c61669a54f0e602aba6290",
          "0xb01ee322c4f028b8a6bfcd2a5d48107dc5bc99ec",
          "0x938f169352008d35e065F153be53b3D3C07Bcd90",
        ],
      },
    ],
  },
};

type UserType = {
  id: string;
  name: string;
};

export default function Level1RegisterUser() {
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [verifiedUser, setVerifiedUser] = useState<UserType>(null);

  async function verify(response: SismoConnectResponse) {
    // First we update the react state to show the loading state
    setVerifying(true);

    try {
      // We send the response to our backend to verify the proof
      const res = await axios.post(`/api/level-1-verify-user`, {
        response,
      });

      const user = res.data;

      // If the proof is valid, we update the user react state to show the user profile
      setVerifiedUser({
        id: user.id,
        name: user.name,
      });
    } catch (e) {
      // Else if the proof is invalid, we show an error message
      setError("Invalid response");
      console.error(e);
    } finally {
      // We set the loading state to false to show the user profile
      setVerifying(false);
    }
  }

  // On text input change, we update the userInput react state variable
  function onUserInput(e) {
    setUserInput(e.target.value);
  }

  return (
    <>
      <BackButton />
      <div className="container">
        {!verifiedUser && (
          <>
            <h1 className="title">Are you a human?</h1>
            <p className="subtitle-page">
              Level 1: request for an anonymous user id, a Proof of Humanity, a signed message with
              the username and save it in a database.
            </p>

            <div className="input-group">
              <label htmlFor="userName">Gimme you name</label>
              <input
                className="text-input"
                id="userName"
                type="text"
                value={userInput}
                onChange={onUserInput}
                disabled={verifying}
              />
            </div>

            <SismoConnectButton
              config={sismoConnectConfig}
              auths={[{ authType: AuthType.VAULT }]}
              claims={[{ groupId: "0x682544d549b8a461d7fe3e589846bb7b" }]}
              signature={{
                message: userInput,
                isSelectableByUser: true, // Allow the user to change the message (here his user name) during the Sismo Connect flow
              }}
              onResponse={(response: SismoConnectResponse) => verify(response)}
              verifying={verifying}
              callbackPath={"/level-1-register-user"}
            />
            <>{error}</>
          </>
        )}
        {verifiedUser && (
          <>
            <h1 className="title">Yes you are human</h1>
            <p className="subtitle-page">
              The user has shared his anonymous userId, proved that he is a member of the Proof of
              Humanity group, signed a message with his user name and we saved it in our local
              database
            </p>
            <div className="profile-container">
              <h2 style={{ marginBottom: 10 }}>User Profile</h2>
              <div style={{ marginBottom: 10 }}>
                <b>UserId:</b>
                <p>{verifiedUser.id}</p>
              </div>
              <div style={{ marginBottom: 10 }}>
                <b>UserName:</b>
                <p>{verifiedUser.name}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
