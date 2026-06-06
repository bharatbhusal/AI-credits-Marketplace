# User Experience

## Objective

This document describes how a user interacts with the platform.

The focus is minimizing friction while demonstrating blockchain-powered AI account provisioning.

---

# Account Creation Flow

A new user wants access to the AI workspace.

The process should feel similar to purchasing credits from a traditional SaaS provider.

```mermaid
sequenceDiagram

    User->>UI: Connect Wallet

    User->>UI: Request Account

    UI->>Contract: Transaction

    Contract-->>Backend: Event

    Backend->>Workspace: Create Account

    Backend->>Workspace: Add Credits

    Backend-->>UI: Success
```

---

# Recharge Sequence

An existing user wants additional credits.

```mermaid
sequenceDiagram

    User->>UI: Recharge Request

    UI->>Contract: Submit Payment

    Contract-->>Backend: Event

    Backend->>Workspace: Add Credits

    Backend-->>UI: Success
```

---

# User Experience Goals

The user should:

- Never see blockchain complexity
- Understand the credit cost
- Receive immediate feedback
- Know whether provisioning succeeded

The ideal experience is:

```text
Pay → Wait → Receive Credits
```
