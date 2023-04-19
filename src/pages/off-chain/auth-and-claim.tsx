import { Container } from "@/components/Container";
import { Title } from "@/components/Title";
import {
  SismoConnectButton,
  SismoConnectClientConfig,
  SismoConnectResponse,
  AuthType,
} from "@sismo-core/sismo-connect-react";
import axios from "axios";
import { useState } from "react";

export const sismoConnectConfig: SismoConnectClientConfig = {
  appId: "0x112a692a2005259c25f6094161007967",
  devMode: {
    // enable or disable dev mode here to create development groups and use the development vault.
    enabled: true,
    devGroups: [
      {
        groupId: "0x682544d549b8a461d7fe3e589846bb7b",
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

export default function OffChainAuthAndClaim() {
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [userInput, setUserInput] = useState("");

  const [user, setUser] = useState({
    id: "",
    name: "",
  });

  const verify = async (response: SismoConnectResponse) => {
    setVerifying(true);
    console.log(response);
    try {
      const res = await axios.post(`/api/verify-auth-and-claim`, {
        response,
      });
      setUser({
        id: res.data.userId,
        name: res.data.userName,
      });
      setIsVerified(true);
    } catch (e) {
      setError("Invalid response");
      console.error(e);
    } finally {
      setVerifying(false);
    }
  };

  function onUserInput(e) {
    setUserInput(e.target.value);
  }


  return (
    <Container>
      {!isVerified ? (
        <>
          <Title>Are you a human?</Title>

          {!verifying && (
            <div className="input-group">
              <label htmlFor="userName">Gimme you name</label>
              <input id="userName" type="text" value={userInput} onChange={onUserInput} />
            </div>
          )}

          <SismoConnectButton
            config={sismoConnectConfig}
            auths={[{ authType: AuthType.VAULT }]}
            claims={[{ groupId: "0x682544d549b8a461d7fe3e589846bb7b" }]}
            signature={{ message: userInput, isSelectableByUser: true }}
            onResponse={(response: SismoConnectResponse) => verify(response)}
            verifying={verifying}
            callbackPath={"/off-chain/auth-and-claim"}
          />
          <>{error}</>
        </>
      ) : (
        <>
          <Title>Yes you are</Title>
          <div className="profile-container">
            <div>
              <h2>User Profile</h2>
              <p>UserName: {user.name}</p>
              <p>UserId: {user.id}</p>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}
