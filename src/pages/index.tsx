import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div className="container">
      <h1>Sample Project</h1>
      <h2>Sismo Connect Offchain</h2>
      <ul>
        <li onClick={() => router.push("/level-0-register-user")}>
          <h3 className="card-title">Anonymous Registration</h3>
          <p>Request for a userId from Sismo Connect</p>
        </li>
        <li onClick={() => router.push("/level-1-register-user")}>
          <h3 className="card-title">Anonymous and Gated Registration</h3>
          <p>
            Request for a userId and a Nouns DAO NFT proof of ownership from Sismo Connect and save the username
          </p>
        </li>
        <li onClick={() => router.push("/level-2-register-user")}>
          <h3 className="card-title">Anonymous and Gated Registration <br />
          while optionally proving that you are a human</h3>
          <p>
            Request for a userId, a Nouns DAO NFT proof of ownership and optionally reveal a Twitter Id and a
            proof of Gitcoin passport from Sismo Connect
          </p>
        </li>
      </ul>
    </div>
  );
}
