import BackButton from "@/components/BackButton";
import { Title } from "@/components/Title";
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
    devGroups: [
      {
        // Proof of Humanity group : https://factory.sismo.io/groups-explorer?search=0x682544d549b8a461d7fe3e589846bb7b
        groupId: "0x682544d549b8a461d7fe3e589846bb7b",
        // Add your dev addresses here to become eligible in the DEV env
        data: [
          "0x2b9b9846d7298e0272c61669a54f0e602aba6290",
          "0xb01ee322c4f028b8a6bfcd2a5d48107dc5bc99ec",
          "0x855193BCbdbD346B423FF830b507CBf90ecCc90B",
          "0x938f169352008d35e065F153be53b3D3C07Bcd90",
        ],
      },
      {
        // Gitcoin Passport group : https://factory.sismo.io/groups-explorer?search=0x1cde61966decb8600dfd0749bd371f12
        groupId: "0x1cde61966decb8600dfd0749bd371f12",
        // Add your dev addresses here to become eligible in the DEV env
        data: [
          "0x2b9b9846d7298e0272c61669a54f0e602aba6290",
          "0xb01ee322c4f028b8a6bfcd2a5d48107dc5bc99ec",
          "0x855193BCbdbD346B423FF830b507CBf90ecCc90B",
          "0x938f169352008d35e065F153be53b3D3C07Bcd90",
        ],
      },
    ],
  },
};

type UserType = {
  id: string;
  name: string;
  twitterId: string;
};

export default function Level2RegisterUser() {
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [verifiedUser, setVerifiedUser] = useState<UserType>(null);

  async function verify(response: SismoConnectResponse) {
    // first we update the react state to show the loading state
    setVerifying(true);

    try {
      // We send the response to our backend to verify the proof
      const res = await axios.post(`/api/level-2-verify-user`, {
        response,
      });

      const user = res.data;

      // If the proof is valid, we update the user react state to show the user profile
      setVerifiedUser({
        id: user.id,
        name: user.name,
        twitterId: user.twitterId,
      });
    } catch (e) {
      // else if the proof is invalid, we show an error message
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
            <h1>Are you a human?</h1>
            <p style={{ marginBottom: 20 }}>
              Level 2: request for an anonymous user id, a Proof of Humanity, a signed message with
              the username and optionally for a proof of Gitcoin Passport and a Twitter Id. Save it
              in a database.
            </p>

            {!verifying && (
              <div className="input-group">
                <label htmlFor="userName">Gimme you name</label>
                <input id="userName" type="text" value={userInput} onChange={onUserInput} />
              </div>
            )}

            <SismoConnectButton
              config={sismoConnectConfig}
              auths={[
                { authType: AuthType.VAULT },
                {
                  authType: AuthType.TWITTER,
                  isOptional: true,
                  isSelectableByUser: true, // enable the user to selectively share its twitter ids
                },
              ]}
              claims={[
                { groupId: "0x682544d549b8a461d7fe3e589846bb7b" },
                { groupId: "0x1cde61966decb8600dfd0749bd371f12" },
              ]}
              signature={{
                message: userInput,
                isSelectableByUser: true, // Allow the user to change the message (here his user name) during the Sismo Connect flow
              }}
              onResponse={(response: SismoConnectResponse) => verify(response)}
              verifying={verifying}
              callbackPath={"/level-2-register-user"}
            />
            <>{error}</>
          </>
        )}
        {verifiedUser && (
          <>
            <Title>Yes you are human</Title>
            <p style={{ marginBottom: 20 }}>
              The user has shared his anonymous userId, proved that he is a member of the Proof of
              Humanity group, signed a message with his user name and optionally for a proof of
              Gitcoin Passport and a Twitter Id. We saved the user in our local database
            </p>
            <div className="profile-container">
              <div>
                <h2>User Profile</h2>
                <div style={{ marginBottom: 10 }}>
                  <b>UserId:</b>
                  <p>{verifiedUser.id}</p>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <b>UserName:</b>
                  <p>{verifiedUser.name}</p>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <b>TwitterId:</b>
                  <p>{verifiedUser.twitterId ?? "TwitterId has not been shared by the user"}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
