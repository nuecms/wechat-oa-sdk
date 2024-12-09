# **Wechat Official Accounts SDK**

A flexible and lightweight SDK for building Wechat Official Accounts with dynamic endpoints, caching, and response transformations.

[![npm](https://img.shields.io/npm/v/@nuecms/wx-oa-sdk)](https://www.npmjs.com/package/@nuecms/wx-oa-sdk)
[![GitHub](https://img.shields.io/github/license/nuecms/wx-oa-sdk)](https://www.github.com/nuecms/wx-oa-sdk)
[![GitHub issues](https://img.shields.io/github/issues/nuecms/wx-oa-sdk)](https://www.github.com/nuecms/wx-oa-sdk/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/nuecms/wx-oa-sdk)](https://www.github.com/nuecms/wx-oa-sdk/pulls)

---

## **Features**


- Pre-configured API endpoints for WeChat's public platform
- Support for Redis and in-memory caching
- Easy extensibility

---

## **Table of Contents**

- [**Wechat Official Accounts SDK**](#wechat-official-accounts-sdk)
  - [**Features**](#features)
  - [**Table of Contents**](#table-of-contents)
  - [**Installation**](#installation)
  - [**Quick Start**](#quick-start)
    - [1. Import and Initialize the SDK Builder](#1-import-and-initialize-the-sdk-builder)
    - [2. Register API Endpoints](#2-register-api-endpoints)
    - [3. Make API Calls](#3-make-api-calls)
    - [More](#more)
  - [**Usage Examples**](#usage-examples)
    - [Registering Endpoints](#registering-endpoints)
    - [Making API Calls](#making-api-calls)
  - [**Contributing**](#contributing)
  - [**License**](#license)

---

## **Installation**

Install the SDK using `pnpm` or `yarn`:

```bash
pnpm add @nuecms/wx-oa-sdk
# or
yarn add @nuecms/wx-oa-sdk
```

---

## **Quick Start**

### 1. Import and Initialize the SDK Builder

```typescript
import { wxSdk } from '@nuecms/wx-oa-sdk';

const sdk = wxSdk({
  appId: string;
  appSecret: string;
  cacheProvider: CacheProvider;
});
```

### 2. Register API Endpoints

```typescript
sdk.r('getUser', '/users/{id}', 'GET');
sdk.r('createUser', '/users', 'POST');
```

### 3. Make API Calls

```typescript
const user = await sdk.getUser({ id: '12345' });
console.log(user);
```

### More 

see the testing code in `tests` folder

exapmle:

-  [tests/server/wechat.ts](tests/server/wechat.ts)

---

## **Usage Examples**

### Registering Endpoints

Register endpoints with their HTTP method, path, and dynamic placeholders (e.g., `{id}`):

```typescript
sdk.r('getUser', '/users/{id}', 'GET');
sdk.r('deleteUser', '/users/{id}', 'DELETE');
sdk.r('createUser', '/users', 'POST');

```

### Making API Calls

Call the registered endpoints dynamically with placeholders and additional options:

```typescript
const userDetails = await sdk.getUser({ id: '12345' });

console.log(userDetails);
```


---

## **Contributing**

We welcome contributions to improve this SDK! To get started:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add feature X"`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

---

## **License**

This SDK is released under the **MIT License**. You’re free to use, modify, and distribute this project. See the `LICENSE` file for more details.

