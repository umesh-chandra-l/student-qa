# Audio/Video Call Feature - Complete Summary

## Overview
The Student Q&A platform now includes a comprehensive audio/video call feature that allows users to connect with answer providers they find interesting. This feature includes request management, mutual agreement scheduling, and call summaries.

## Key Features

### 1. **Call Request Initiation**
- Users can request audio or video calls with people who answered questions
- Available only for answers with **3+ upvotes** to ensure quality interactions
- Cannot request calls with yourself
- Includes optional message to explain interest
- Shows in the Question detail page as "📞 Request Call" button

### 2. **Mutual Agreement System**
- **Requester**: Initiates the call request
- **Answerer**: Must accept or reject the request
- **Acceptance**: Requires scheduling a specific date/time
- **Rejection**: Can include an optional reason
- Status tracking: `pending`, `accepted`, `rejected`, `completed`, `cancelled`

### 3. **Call Management Dashboard**
Located at `/calls` route, accessible from navigation when logged in.

#### Incoming Requests (Answerer View)
- View all call requests from others
- See requester details and their message
- Accept requests and schedule a time
- Reject requests with optional reason
- View question context

#### Outgoing Requests (Requester View)
- View all your sent call requests
- Track request status
- Cancel pending requests
- See scheduled times for accepted calls

### 4. **Call Completion & Summaries**
After a scheduled call occurs:
- Either party can mark the call as completed
- **Required**: Call summary describing what was discussed
- **Optional**: Call duration in minutes
- Summaries are visible to both participants
- Provides accountability and record-keeping

### 5. **Call Types**
- **🎤 Audio Call**: Voice-only conversation
- **📹 Video Call**: Video conversation

## Technical Implementation

### Backend (Server)

#### Models
**CallRequest Schema** (`server/models/CallRequest.js`):
```javascript
{
  requester: ObjectId (User),
  answerer: ObjectId (User),
  answer: ObjectId (Answer),
  question: ObjectId (Question),
  callType: "audio" | "video",
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled",
  scheduledTime: Date,
  callSummary: String,
  requesterMessage: String,
  rejectionReason: String,
  duration: Number (minutes),
  completedAt: Date,
  timestamps: true
}
```

#### API Endpoints (`server/routes/calls.js`)
- `POST /api/calls` - Create a call request
- `GET /api/calls/my-requests` - Get incoming and outgoing requests
- `GET /api/calls/by-answer/:answerId` - Get requests for specific answer
- `POST /api/calls/:id/accept` - Accept request and schedule time
- `POST /api/calls/:id/reject` - Reject request with optional reason
- `POST /api/calls/:id/complete` - Mark call as completed with summary
- `POST /api/calls/:id/cancel` - Cancel a pending request

### Frontend (Client)

#### Components
1. **CallRequestModal** (`client/src/components/CallRequestModal.jsx`)
   - Modal for initiating call requests
   - Select audio/video type
   - Write optional message
   - Triggered from Question page

2. **CallRequests Page** (`client/src/pages/CallRequests.jsx`)
   - Full dashboard for managing requests
   - Tabbed interface (Incoming/Outgoing)
   - Modals for accepting, rejecting, and completing calls
   - Real-time status tracking

#### Routes
- `/calls` - Call management dashboard

#### Navigation
- Shows "📞 Calls" link in navbar for logged-in users

## User Flow Examples

### Scenario 1: Successful Call Request
1. Alice finds Bob's answer helpful (has 5 upvotes)
2. Alice clicks "📞 Request Call" on Bob's answer
3. Alice selects "Video" and writes: "Your solution was great! Can we discuss implementation?"
4. Bob receives the request in his "Incoming" tab
5. Bob accepts and schedules for "Tomorrow at 3 PM"
6. Both see the scheduled time in their dashboards
7. After the call, Alice marks it complete with summary: "Discussed React optimization techniques"
8. Both can now see the call summary and duration

### Scenario 2: Declined Request
1. Charlie requests a call with Diana
2. Diana reviews the request but is too busy
3. Diana rejects with reason: "Sorry, swamped with finals right now!"
4. Charlie sees the rejection and reason in his "Outgoing" tab

### Scenario 3: Cancelled Request
1. Eve sends a call request to Frank
2. Eve finds her answer elsewhere
3. Eve cancels the pending request from "Outgoing" tab
4. Frank no longer sees the request in his "Incoming" tab

## Business Logic & Validations

### Constraints
- ✅ Must be logged in to request/manage calls
- ✅ Cannot request calls with yourself
- ✅ Only answers with 3+ upvotes show call button
- ✅ One pending request per answer per user
- ✅ Only answerer can accept/reject
- ✅ Only requester can cancel
- ✅ Both parties can mark as completed
- ✅ Call summary is required for completion

### Status State Machine
```
pending → accepted → completed
       ↓
       → rejected
       ↓
       → cancelled (requester only)
```

## UI/UX Features

### Visual Indicators
- **Status Badges**: Color-coded (pending=yellow, accepted=green, rejected=red, completed=blue, cancelled=gray)
- **Emojis**: Clear visual cues for call types and statuses
- **Timestamps**: All requests show creation time
- **User Profiles**: Display profile pictures, names, and emails

### Responsive Design
- Mobile-friendly modals
- Card-based layout for requests
- Tab navigation for easy switching

### User Feedback
- Alert messages for all actions
- Loading states during API calls
- Empty states when no requests exist
- Confirmation dialogs for destructive actions

## Security & Privacy

### Authentication
- All endpoints require authentication via `requireAuth` middleware
- JWT-based session management

### Authorization
- Users can only accept/reject calls they're invited to
- Users can only cancel their own requests
- Both call participants can complete the call

### Data Access
- Users only see their own incoming/outgoing requests
- Call summaries visible to both participants only

## Future Enhancements (Potential)

1. **Real-time Integration**
   - WebRTC for actual audio/video calls
   - Socket.io for live notifications

2. **Notifications**
   - Email notifications for new requests
   - Reminders for scheduled calls
   - Badge counts in navigation

3. **Calendar Integration**
   - Export to Google Calendar
   - iCal support

4. **Call History & Analytics**
   - Total call time statistics
   - Most discussed topics
   - Rating system for call quality

5. **Availability Calendar**
   - Set available time slots
   - Auto-suggest meeting times

## Database Indexes (Recommended)
```javascript
// For performance optimization
CallRequestSchema.index({ requester: 1, status: 1 });
CallRequestSchema.index({ answerer: 1, status: 1 });
CallRequestSchema.index({ answer: 1, requester: 1 });
```

## Testing Checklist

### Unit Tests
- [ ] Call request creation with validations
- [ ] Accept/reject authorization
- [ ] Status transitions
- [ ] Duplicate request prevention

### Integration Tests
- [ ] End-to-end call request flow
- [ ] Modal interactions
- [ ] Tab switching in dashboard
- [ ] API error handling

### Manual Testing
- [ ] Request call from question page
- [ ] Accept with scheduling
- [ ] Reject with reason
- [ ] Complete with summary
- [ ] Cancel pending request
- [ ] View both tabs (incoming/outgoing)

## Configuration

### Environment Variables
No additional environment variables needed. Uses existing:
- `MONGODB_URI` - Database connection
- `CLIENT_URL` - CORS configuration

### Dependencies
Already included in existing `package.json`:
- Express.js
- Mongoose
- React
- React Router

## Summary

The audio/video call feature provides a complete lifecycle management system for connecting users based on interesting answers. It enforces mutual agreement through acceptance/scheduling, maintains accountability through summaries, and provides a clean, intuitive interface for managing all call-related activities.

**Key Benefits:**
- ✅ Encourages deeper engagement beyond text
- ✅ Rewards quality answers (3+ upvote requirement)
- ✅ Respects both parties' time (mutual agreement)
- ✅ Creates documentation (call summaries)
- ✅ Maintains professionalism (structured process)

