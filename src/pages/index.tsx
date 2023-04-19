import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div className="container">
      <h1>Getting Started<br/>Sismo Connect Offchain</h1>
      <section>
        {/* <h2>Learning steps:</h2> */}
        <ul>
          <li onClick={() => router.push("/level-0-register-user")}>
            <h3>Register a user</h3>
            <p>Request for a user id from Sismo Connect</p>
          </li>
          <li onClick={() => router.push("/level-1-register-user")}>
            <h3>Register a simple user conditionally</h3>
            <p>
              Request for a user id and a Proof of Humanity from Sismo Connect and save his user name
            </p>
          </li>
          <li onClick={() => router.push("/level-2-register-user")}>
            <h3>Register a complex user conditionally</h3>
            <p>
              Request for a userId, a Proof of Humanity and optionally reveal his twitter id and a
              proof of Gitcoin passport from Sismo Connect
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}
