# Security Specification - Himilo Qaran

## 1. Data Invariants
- A `Complaint` must have a `tripleName`, `phone`, `category`, and `complaint`.
- `status` must be one of: `pending`, `reviewed`, `resolved`.
- `createdAt` must be a server timestamp.
- Users can create complaints without being authenticated (public reporting).
- Users cannot read or list complaints unless they are an admin.
- Admins are defined in the `/admins/` collection.

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)

1. **Anonymous Read**: Attempt to read `/complaints/{id}` without auth. (Expect: Deny)
2. **Anonymous List**: Attempt to list `/complaints` without auth. (Expect: Deny)
3. **Spoofed Owner**: Attempt to create a complaint with a fake `ownerId` (if we had one). (Expect: Deny if logic is flawed)
4. **Invalid Status**: Create a complaint with `status: 'resolved'`. (Expect: Deny, should default to 'pending')
5. **Malicious ID**: Create a document at `/complaints/TOO_LONG_ID_JUNK...`. (Expect: Deny)
6. **Shadow Update**: Update a complaint adding a field `isVerified: true`. (Expect: Deny)
7. **Admin Impersonation**: Attempt to write to `/admins/my-uid`. (Expect: Deny)
8. **PII Leak**: Non-admin user tries to get a user's phone number from `/complaints`. (Expect: Deny)
9. **Terminal State Break**: Non-admin try to change a `resolved` status back to `pending`. (Expect: Deny)
10. **Huge Data**: Send a 1MB string in `complaint` field. (Expect: Deny via size check)
11. **Type Poisoning**: Send `phone: 12345` (integer) instead of string. (Expect: Deny)
12. **Future Date**: Send `createdAt` as a future date. (Expect: Deny, must be `request.time`)

## 3. Test Runner
(Will be implemented in firestore.rules.test.ts)
