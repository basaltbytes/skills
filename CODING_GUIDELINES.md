# Coding Guidelines

The practices enforced in basaltbytes codebases — for humans and agents alike. Each
rule is a commitment, not a suggestion: apply it when writing, hunt violations when
reviewing. Sources are on the [always-valid-domain bookshelf](skills/always-valid-domain/README.md);
the [always-valid-domain skill](skills/always-valid-domain/SKILL.md) is the
agent-loadable slice of section 1.

## 1. Domain integrity (always-valid)

A constructed domain object is a proof. Validation happens once, at construction;
everything downstream trusts the type.

- **Name the concept, not the primitive** — identifiers included: `pay(to: CustomerId)`
  cannot be called with two swapped strings; `pay(to: string)` can.
- **Validate at construction, once** — shape AND invariants; a test proves an invalid
  instance is unconstructible.
- **Parse, don't validate — at every boundary.** HTTP bodies, DB rows, webhooks,
  files, environment. Raw shapes do not travel inward.
- **Trust the interior.** A validated value is never rechecked or re-parsed;
  defensive revalidation means construction isn't trusted — fix construction, delete
  the recheck.
- **Make illegal states — and illegal transitions — unrepresentable.** Distinct
  states are distinct types; the guard and the mutation are one operation.

## 2. Architecture: functional core, imperative shell

- **The domain core is pure.** Entities, value objects, and derivers (pure
  decision/derivation functions) perform no IO — no repository, no clock, no network.
  Time and randomness enter as parameters.
- **Use-cases orchestrate, domain objects decide.** The use-case shape is: load
  through a port → invoke pure domain logic → persist through a port → emit events.
  Business rules do not accumulate inline in use-cases; when one appears, move it
  onto the entity or a deriver where it can be tested pure.
- **Ports and adapters.** The domain package owns its interfaces (repositories,
  event emitters, providers); infrastructure implements them. Domain code never
  imports an ORM, an HTTP client, or a vendor SDK.
- **Anti-corruption layers work in both directions.** A connector that parses
  third-party payloads into domain types on the way in, but returns the vendor's raw
  response (or `any`) on the way out, is half an ACL. Translate both payloads and
  **errors**, both directions, at the connector — vendor shapes and vendor exceptions
  never cross into domain code.
- **Separate reads from writes (CQRS-light).** State changes go through entities and
  repositories; list/detail reads go through query ports returning flat DTOs. The
  asymmetry is deliberate — write-side rows are rebuilt into validated domain
  objects, read-side DTOs stay cheap — but it is a *decision*: document it, don't
  drift into it.
- **Side effects ride domain events.** Emails, calendar syncs, analytics: emitted as
  typed events from use-cases, consumed by handlers at the edge. The domain never
  sends an email.

## 3. Errors

- **One error dialect per codebase.** Throwing smart constructors, or
  Result-returning ones — either is defensible; pick one and enforce it everywhere.
  Two dialects bridged with adapters is debt; three is an incident. A dead in-house
  Result type next to a library one is the warning sign.
- **Errors are part of the signature.** A fallible operation's return type names its
  failure modes (typed error unions). `Promise<T>` that might throw anything is a
  signature that lies.
- **Translate at every layer boundary.** Validation-library errors (ZodError,
  ValidationError) are edge vocabulary — map them at the edge (400 + field errors);
  domain code never imports them. Same for vendor/provider errors → the domain's own
  error types, and domain errors → HTTP codes at the route.
- **Never swallow.** `catch → log → return null` converts a failure into a lie the
  caller can't see. Propagate a typed error or crash; `// TODO: handle errors` does
  not ship.

## 4. Hygiene

- **No dead abstractions.** An unused base class, an unwired helper, a legacy
  duplicate of a library type — delete them. Dead code documents a decision nobody
  made; the next reader will trust it.
- **Unknown keys are errors in domain schemas.** Default strip-mode silently discards
  typos and stale fields. Domain-owned schemas are strict; lenient/strip mode is
  reserved for ACL ingestion, where third parties may add fields.
- **No narrowing lies in domain code.** `as X` casts and non-null `!` assertions
  assert what the runtime never checked. If the type system can't see it, restructure
  so it can (parse, variant types, exhaustive switch) — don't overrule it.
- **Consistency across siblings is a feature.** A rule applied in one package applies
  in all of them, or the divergence is written down. Reviewers flag asymmetry
  (package A revalidates, package B trusts; package A returns Results, package B
  throws) even when each side works locally.

## Sources

The full annotated bookshelf lives in
[skills/always-valid-domain/README.md](skills/always-valid-domain/README.md). Beyond
it, the practices in sections 2–4 draw on:

- Gary Bernhardt, [Boundaries](https://www.destroyallsoftware.com/talks/boundaries)
  (2012) — functional core, imperative shell.
- Alistair Cockburn, [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
  (2005) — ports and adapters.
- Eric Evans, *Domain-Driven Design* (2003), part IV — anti-corruption layer and
  strategic design.
- Vaughn Vernon, [Effective Aggregate Design](https://www.dddcommunity.org/library/vernon_2011/)
  (2011) — consistency boundaries, three free essays.
- Scott Wlaschin, [Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/)
  and [Designing with types: Making state explicit](https://fsharpforfunandprofit.com/posts/designing-with-types-representing-states/)
  — errors as values; states and transitions as types.
- Greg Young, [CQRS Documents](https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf)
  (2010) — command/query separation.
