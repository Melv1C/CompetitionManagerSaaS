# Results API

Real-time competition results management service with Socket.IO integration for live updates.

## Overview

The Results API handles:
- Creating and updating competition results
- Retrieving results for competitions
- Real-time result updates via WebSocket
- Result validation and relationship management

## Setup

### Build
In the root directory of the project, run:
```bash
./build-apps.sh results-api
```

### Environment Variables
Create a `.env` file with:
```env
NODE_ENV=development
PORT=3000
PREFIX=/api
ALLOW_ORIGIN=http://localhost:5173
```

## WebSocket Events

### Rooms
- `competition:{eid}` - Subscribe to all results for a specific competition
- `event:{eid}` - Subscribe to results for a specific event

### Client Events
- `join:competition` - Join a competition room
  ```typescript
  socket.emit('join:competition', competitionEid: string)
  ```
- `join:event` - Join an event room
  ```typescript
  socket.emit('join:event', eventEid: string)
  ```

### Server Events
- `result:new` - Emitted when a new result is created or updated

## REST API Routes

### POST /
Create a new result

#### Body
```typescript
{
    competitionEid: string,      // Competition entity ID
    competitionEventEid: string, // Competition event entity ID
    athleteLicense: string,      // Athlete's license number
    bib: string,
    heat: number,                // default: 1
    initialOrder: number,
    tempOrder: number,
    finalOrder?: number,
    value?: number,
    wind?: number,
    points?: number,
    details: Array<{
        tryNumber: number,
        value: number,
        attempts?: Array<'X' | 'O' | '-'>,
        wind?: number,
        isBest: boolean,
        isOfficialBest: boolean
    }>
}
```

#### Response
```typescript
{
    id: number,
    eid: string,
    // ... all result fields
    competitionEvent: CompetitionEvent,
    athlete: Athlete,
    club: Club,
    competition: Competition
}
```

### PUT /:eid
Update an existing result. Requires ADMIN role and proper competition admin access.

#### Parameters
- `eid` - Result entity ID

#### Body
```typescript
{
    // ... all result fields
}
```

#### Response
```typescript
{
    id: number,
    eid: string,
    // ... all result fields
    competitionEvent: CompetitionEvent,
    athlete: Athlete,
    club: Club,
    competition: Competition
}
```

### GET /competitions/:eid
Get all results for a competition

#### Parameters
- `eid` - Competition entity ID

#### Response
```typescript
[
    {
        id: number,
        eid: string,
        // ... all result fields
        competitionEvent: CompetitionEvent,
        athlete: Athlete,
        club: Club
    },
    // ...
]
```

## Data Models

### Result
```typescript
{
    id: number,          // Auto-generated
    eid: string,         // Auto-generated
    bib: string,
    heat: number,        // default: 1
    initialOrder: number,
    tempOrder: number,
    finalOrder?: number,
    value?: number,
    wind?: number,
    points?: number,
    details: ResultDetail[],
    competitionEvent: CompetitionEvent,
    athlete: Athlete,
    club: Club
}
```

### ResultDetail
```typescript
{
    id: number,
    tryNumber: number,
    value: number,
    attempts?: AttemptValue[],  // ['X', 'O', '-']
    wind?: number,
    isBest: boolean,
    isOfficialBest: boolean
}
```

## Error Handling
- All endpoints return 500 with localized error message on internal errors
- Input validation using Zod schemas
- Proper error logging with service identification

## Dependencies
- Express for REST API
- Socket.IO for real-time updates
- Prisma for database operations
- Zod for schema validation
- i18next for internationalization

## Development
1. Install dependencies: `npm install`
2. Create `.env` file
3. Build shared packages
4. Start service: `npm run dev`

