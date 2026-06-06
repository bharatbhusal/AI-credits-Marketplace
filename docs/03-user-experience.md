# User Experience

## Purpose

This document describes the user journey from wallet connection through AI workspace usage.

---

# Account Creation Experience

```mermaid
sequenceDiagram

    actor User

    participant UI

    participant Backend

    participant Contract

    participant Workspace

    User->>UI: Connect Wallet

    User->>UI: Request Account

    UI->>Backend: Request Quote

    Backend-->>UI: Quote

    User->>Contract: Pay

    Contract-->>Backend: Event

    Backend->>Workspace: Create Account

    Workspace-->>Backend: API Key

    Backend-->>UI: Success
```

---

## Experience Goals

- Minimal onboarding
- Transparent pricing
- Real-time status tracking
- Fast provisioning

---

# Recharge Experience

```mermaid
sequenceDiagram

    actor User

    participant UI

    participant Backend

    participant Contract

    participant Workspace

    User->>UI: Recharge Credits

    UI->>Backend: Request Quote

    Backend-->>UI: Quote

    User->>Contract: Payment

    Contract-->>Backend: Recharge Event

    Backend->>Workspace: Add Credits

    Workspace-->>Backend: Success

    Backend-->>UI: Updated Balance
```
