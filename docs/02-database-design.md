# Database Design

## Purpose

This document defines the persistence layer used by backend services.

The database does not store credits.

Credits remain the responsibility of the workspace provider.

---

## Entity Relationship Diagram

```mermaid
erDiagram

    USERS {

        uuid id PK

        string wallet_address

        timestamp created_at
    }

    WORKSPACE_ACCOUNTS {

        uuid id PK

        uuid user_id FK

        string workspace_account_id

        string encrypted_api_key

        timestamp created_at
    }

    ACCOUNT_REQUESTS {

        uuid id PK

        uuid user_id FK

        bigint credits

        string tx_hash

        string status

        timestamp created_at
    }

    RECHARGE_REQUESTS {

        uuid id PK

        uuid user_id FK

        bigint credits

        string tx_hash

        string status

        timestamp created_at
    }

    USERS ||--|| WORKSPACE_ACCOUNTS : owns

    USERS ||--o{ ACCOUNT_REQUESTS : creates

    USERS ||--o{ RECHARGE_REQUESTS : creates
```

---

## Domain Model

```mermaid
classDiagram

class User {
    id
    walletAddress
    createdAt
}

class WorkspaceAccount {
    id
    workspaceAccountId
    encryptedApiKey
}

class AccountRequest {
    id
    credits
    txHash
    status
}

class RechargeRequest {
    id
    credits
    txHash
    status
}

User "1" --> "1" WorkspaceAccount

User "1" --> "*" AccountRequest

User "1" --> "*" RechargeRequest
```

---

## Entity Descriptions

### User

Represents a blockchain wallet owner.

One user maps to one workspace account.

---

### WorkspaceAccount

Stores:

- Workspace account id
- Encrypted API key

Actual credits remain in the workspace.

---

### AccountRequest

Tracks account creation.

Status values:

- PENDING
- PROCESSING
- COMPLETED
- FAILED

---

### RechargeRequest

Tracks recharge operations.

Status values:

- PENDING
- PROCESSING
- COMPLETED
- FAILED

---

## Request Lifecycle

```mermaid
stateDiagram-v2

    Created

    Pending

    Processing

    Completed

    Failed

    Created --> Pending

    Pending --> Processing

    Processing --> Completed

    Processing --> Failed
```
