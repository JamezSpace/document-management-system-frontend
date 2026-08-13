# Office-first application architecture

The office workbench is the primary application boundary. Display names and job titles do not
define frontend behaviour.

## Layers

- `platform/`: application-wide authentication, authorization and infrastructure.
- `office-platform/`: active office context, shell, guards, navigation contracts and registry.
- `offices/`: route trees and presentation workflows owned by each workbench.
- Existing shared document/workspace features remain reusable domain capabilities while they are
  incrementally relocated under `domains/`.

## Identity contract

`GET /identity/staff/me` should return `staff.office.workbench` as one of:

- `records`
- `secretariat`
- `processing`
- `leadership`
- `human-resources`
- `system-administration`
- `audit-compliance`

`OfficeContextService` temporarily resolves old responses from scoped capabilities and role
assignments. Remove that compatibility branch after all environments supply the canonical field.

## Access rules

1. The assigned office workbench selects the route tree and navigation manifest.
2. Capabilities filter navigation and guard direct route entry.
3. Backend authorization remains authoritative and applies organization, unit or office scope.
4. Office display names and designations must never be used as permanent authorization rules.

## Adding an office feature

1. Add the capability to `platform/authorization/capabilities.ts` when one does not exist.
2. Add the navigation entry to `office-platform/registry/workbench-registry.ts`.
3. Add the guarded route to the owning `offices/<workbench>/` route file.
4. Put reusable business logic in its domain, not in the shell or navigation registry.
