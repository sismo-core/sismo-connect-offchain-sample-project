# sismoConnect Boilerplate Repository

This repository contains several examples on how to use sismoConnect packages to build a Sismo Connect application. You will find code examples to easily request proofs from your users and verify them on-chain or off-chain using Sismo Connect.

## Table of Contents

- [Overview](#overview)
- [Off-Chain Examples](#off-chain-examples)
- [On-Chain Examples](#on-chain-examples)
- [Usage](#usage)

## Overview

This repository contains two sets of examples:

1. Off-chain examples: These examples use the backend for verification.
2. On-chain examples: These examples use Solidity smart contracts for verification.

You can find the documentation of Sismo Connect [here](https://docs.sismo.io/technical-documentation/sismo-connect).

## Off chain examples

- Simple Vault Authentication:
  [frontend](./src/pages/off-chain/simple-auth.tsx) / [backend](./src/pages/api/verify-simple-auth.ts)

- Simple Claim:
  [frontend](./src/pages/off-chain/simple-claim.tsx) / [backend](./src/pages/api/verify-simple-claim.ts)

- One Claim and One Vault Authentication:
  [frontend](./src/pages/off-chain/auth-and-claim.tsx) / [backend](./src/pages/api/verify-auth-and-claim.ts)

- One Claim, multiple claims (with one optional) and one signature:
  [frontend](./src/pages/off-chain/two-auths-claim-and-signature.tsx) / [backend](./src/pages/api/verify-two-auths-claim-and-signature.ts)


## Usage

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) >= 18.15.0 (Latest LTS version)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)

### Install dependencies

```bash
# install frontend / backend dependencies
yarn

# install contract dependencies with Forge 
forge install
```

### Start your local Next.js app

```bash
# this will start your Next.js app
# the frontend is available on http://localhost:3001/
# it also starts a local backend
yarn dev
```

The frontend is now available on http://localhost:3001/
You can now use the frontend on http://localhost:3001/ with off-chain examples.
