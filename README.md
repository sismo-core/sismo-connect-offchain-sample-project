# Sismo Connect - Offchain Sample Project Repository

This repository aims at providing simple examples on how to integrate Sismo Connect offchain while allowing you to test the integration locally as easily as possible.

## Usage

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) >= 18.15.0 (Latest LTS version)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)

### Install dependencies


In a first terminal:

```bash
# install frontend / backend dependencies
yarn
```

### Start your local Next.js app

In a new terminal:

```bash
# this will start your Next.js app
# the frontend is available on http://localhost:3000/
# it also starts a local backend
yarn dev
```

After this command, you will have your local application running on http://localhost:3000.

As you will see, the app showcase simple examples on how to register user in a database while maintaining privacy.
To try to register, you will need to add your address in the [`./config.ts`](./config.ts) file:

```typeScript
// Replace with your address to become eligible for the registration
// make sure to have this address in your Vault
export const yourAddress = "0x855193BCbdbD346B423FF830b507CBf90ecCc90B";
```

ℹ️ Make sure to import the address you reference in the config.ts file into your Sismo Vault when you try out the sample project application. If it is not done yet when you get redirected, you can add your address by clicking on the purple "connect" button.