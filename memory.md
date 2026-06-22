# Memory — Socket-based Real-time Messages Implementation

Last updated: 2026-06-18

## What was built

**Socket infrastructure:**
- Created `lib/socket.ts` - socket client initialization with reconnection config
- Created `lib/socket-provider.tsx` - React context provider for socket state management
- Created `components/admin/messages-panel.tsx` - floating real-time message UI component

**Integrations:**
- Updated `app/layout.tsx` - wrapped app with `SocketProvider`
- Updated `app/sellers/page.tsx` - added message notification badge with dropdown showing incoming messages
- Created `.env.local` - socket URL config (`NEXT_PUBLIC_SOCKET_URL=http://localhost:3000`)
- Added `socket.io-client` dependency (v4.8.3)

**Key features:**
- Real-time message reception via `admin:message` socket event
- Visual notification badge with message count on sellers page
- Floating message input panel in bottom-right corner
- Auto-reconnect with exponential backoff (5 attempts, 1s delay)

## Decisions made

**Architecture:**
- Socket.io for real-time communication (standard for Node.js ecosystem)
- Client-side connection management via React context
- Messages broadcast from backend to `admin:message` event namespace

**Event naming:**
- `admin:message` - backend sends to this event for admin to receive
- `user:message` - client sends messages to backend

## Problems solved

- Installed socket.io-client via pnpm (npm failed with registry issue)

## Current state

**Working:**
- Socket client initialization with reconnection logic
- SocketProvider context available throughout app
- Message notification badge on sellers page (bottom-right)
- Floating message input panel component created

**Not yet done:**
- Backend socket server implementation (requires `elon-sales-admin` repo changes)
- Message broadcasting from backend when user chats to seller
- Message display in seller-specific context

## Next session starts with

1. Backend implementation needed in `elon-sales-admin` repo:
   - Add socket.io server to backend
   - Emit `admin:message` event when user sends message to seller
   - Broadcast to admin namespace

2. Frontend enhancements:
   - Filter messages by seller if needed
   - Add message history pagination
   - Mark messages as read

## Open questions

- What is the exact backend socket endpoint URL? (Currently configured to `http://localhost:3000`)
- Should messages be filtered by specific seller or show all user messages?
- Any authentication/authorization needed for socket connections?
