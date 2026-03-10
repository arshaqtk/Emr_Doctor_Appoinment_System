# Slot Generation Module

This module implements dynamic time slot generation for doctors based on their schedules and existing appointments.

## Features
- **Dynamic Calculation**: Slots are calculated on-the-fly without database storage.
- **Schedule Awareness**: Respects doctor's working hours, slot duration, and available days.
- **Break Time Exclusion**: Automatically excludes break periods from the generated list.
- **Availability Tracking**: Integrates with the `Appointment` collection to mark slots as `booked` or `available`.
- **Validation**:
    - Prevents past time slots if the requested date is today.
    - Validates doctor existence and required query parameters.
- **Security**: Protected by authentication middleware.

## API Documentation

### Get Available Slots
Returns a list of time slots for a specific doctor on a specific date.

- **URL**: `/api/slots`
- **Method**: `GET`
- **Auth Required**: YES
- **Query Parameters**:
    - `doctorId` (string, required): The ID of the doctor.
    - `date` (string, required): The date in `YYYY-MM-DD` format.

#### Example Request
`GET /api/slots?doctorId=65ef...&date=2026-03-11`

#### Example Response
```json
{
  "success": true,
  "data": [
    { "time": "09:00", "status": "available" },
    { "time": "09:15", "status": "booked" },
    { "time": "09:30", "status": "available" }
  ]
}
```

## Implementation Details
- **Controller**: [slot.controller.ts](file:///d:/bridgeon/AssessMent/backend/src/modules/slots/slot.controller.ts)
- **Service**: [slot.service.ts](file:///d:/bridgeon/AssessMent/backend/src/modules/slots/slot.service.ts)
- **Routes**: [slot.routes.ts](file:///d:/bridgeon/AssessMent/backend/src/modules/slots/slot.routes.ts)
- **Architecture**: Follows the controller-service pattern used throughout the application.
