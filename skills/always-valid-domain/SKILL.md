---
name: always-valid-domain
description: Always-valid domain modeling — entities and value objects enforce their own integrity (shape and invariants) at construction, so the rest of the domain manipulates them with confidence and never revalidates. Covers parse-don't-validate boundaries, newtype/branded types against primitive obsession, making illegal states unrepresentable, and the runtime mappings pydantic v2 strict (Python) and Zod (TypeScript). Use when designing or reviewing domain models, entities, value objects, or API/DB/env boundaries, or when code shows primitive obsession, validation inside function bodies, scattered isinstance/typeof rechecks, assert or non-null narrowing, or raw request/DB data flowing into domain functions.
---

# Always-Valid Domain

## Rule

A constructed domain object is a proof. If an instance exists, it is valid — shape and
invariants. Validation happens exactly once, at construction; every function that
receives a domain type trusts it and never revalidates.

Type annotations are not runtime guarantees. In Python and TypeScript the checker stops
at unchecked call-sites, `JSON.parse`, ORM rows, env vars, and third-party input.
Construction-time validation is what makes the annotation true past that point.

## The five rules

1. **Name the concept, not the primitive.** A date and "a valid billing period" are
   different concepts. Any value carrying a domain constraint gets its own type
   (value object, newtype, branded type). `f(start: date, end: date)` hides an
   invariant; `f(period: Period)` carries it. Two sibling concepts never share one
   primitive type. Identifiers included: `pay(to: CustomerId)` cannot be called with
   two swapped strings; `pay(to: string)` can. A branded id helper that exists but
   isn't used is worse than none — wire it or delete it.

2. **Validate at construction, once.** The constructor (or factory) enforces shape
   AND semantic invariants — non-empty, ordered, timezone-aware, in-range. An invalid
   instance must be unconstructible, and a test proves construction fails.

3. **Parse, don't validate.** At system edges — HTTP bodies, DB rows, webhooks
   (verify the signature first), files, messages — parse raw data INTO domain types.
   Environment too: `process.env` / `os.environ` is parsed once at boot into a typed
   config object; nothing reads env ad hoc past that point. Errors surface at the
   edge, in the edge's error vocabulary (400, MalformedX). Past the edge, signatures
   accept only domain types; raw dicts and primitives do not travel inward.

4. **Trust the interior.** A domain function receiving a value object does not
   recheck it (Meyer's non-redundancy principle). Composition does not re-parse
   already-validated children — an entity accepting a validated `Member` does not run
   `Member.parse` again. Defensive revalidation inside the domain is a smell — it
   says construction isn't trusted. Fix construction, delete the recheck.

5. **Make illegal states — and illegal transitions — unrepresentable.** Distinct
   states are distinct types (discriminated unions, sum types), each carrying exactly
   its own data — not one type with a status enum plus optional fields for every
   state's baggage. Transitions are typestate: the guard and the mutation are one
   operation (`cancel()` exists only on a state that can be cancelled), never a
   predicate the caller must remember to call before mutating. If a function needs
   `assert x is not None` or a non-null `!`, the state model is wrong: introduce the
   type in which `x` cannot be null.

## Review checklist — hunt these

- Primitive obsession: `str`/`int`/`float`/`date` parameters carrying implicit
  constraints (ids, emails, money, quantities, ranges).
- Validation logic inside function bodies instead of constructors.
- Scattered `isinstance` / `typeof` / `instanceof` rechecks deep in domain code.
- `assert x is not None` (vanishes under `python -O`) or TypeScript `x!` — type-level
  trust dressed as a check.
- Subclass traps passing silently: `datetime` is-a `date`, `bool` is-an `int` (Python).
- Boundary data flowing into domain signatures without a parse step: `as X` casts,
  raw `dict` access, unvalidated ORM/JSON payloads.
- Scattered `status === "..."` narrowing in place of distinct state types.
- A constructor that stores whatever it is given.

## Language mappings

- Python — pydantic v2 strict, nominal wrappers, rejection tests: [PYTHON.md](PYTHON.md)
- TypeScript — Zod at the edges, branded types, discriminated unions: [TYPESCRIPT.md](TYPESCRIPT.md)

## Final check

- Every domain-meaning value has a named type; no two concepts share a primitive.
- Constructing an invalid instance fails, and a test proves it (including the
  subclass traps).
- No revalidation, narrowing asserts, or non-null assertions inside the domain.
- Edges parse into domain types and translate validation errors into the edge's own
  vocabulary; internals never see raw input.
