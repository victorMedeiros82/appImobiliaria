# Security Specification - PropTech Rental Manager

## 1. Data Invariants
- A `Payment` must always reference a valid `Contract` that the user has access to.
- A `Contract` can only be created by an authenticated user who becomes its `ownerId`.
- The `rentValue` must be a positive number.
- Terminanted contracts cannot be edited.

## 2. The "Dirty Dozen" Payloads (Deny Cases)
1. Creating a contract with someone else's `ownerId`.
2. Updating a contract's `rentValue` to a negative number.
3. Deleting a payment that was already marked as `paid`.
4. Reading all contracts without being authenticated.
5. Updating a contract's `ownerId` (immutability).
6. Creating a payment for a non-existent contract.
7. Injecting a 1MB string into the `propertyAddress` field.
8. Updating the `status` of a terminated contract.
9. Listing all user profiles in the system.
10. Reading another landlord's contracts by spoofing the `userId` in queries.
11. Creating a contract where `nextReadjustmentDate` is before `startDate`.
12. Attempting to update `isAdmin` field on a user profile.

## 3. Test Runner (Conceptual)
The `firestore.rules.test.ts` would verify these 12 cases against the ruleset below.
