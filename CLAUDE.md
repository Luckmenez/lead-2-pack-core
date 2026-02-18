# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **lead-to-pack-core**, a NestJS backend application using Prisma as the database ORM.

## Commands

```bash
# Install dependencies
npm install

# Development
npm run start:dev      # Start with hot-reload (watch mode)
npm run start:debug    # Start with debugger attached

# Build & Production
npm run build          # Compile TypeScript to dist/
npm run start:prod     # Run compiled code from dist/

# Testing
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test -- --testPathPattern=<pattern>  # Run specific test file
npm run test:e2e       # Run end-to-end tests
npm run test:cov       # Run tests with coverage

# Code Quality
npm run lint           # Run ESLint with auto-fix
npm run format         # Run Prettier
```

## Architecture

- **Framework**: NestJS 10 with Express
- **Database**: Prisma ORM (schema not yet created - run `npx prisma init` to set up)
- **Entry Point**: `src/main.ts` bootstraps the app on port 3000 (or `PORT` env var)
- **Root Module**: `src/app.module.ts`

### NestJS Conventions

- Controllers: `*.controller.ts` - Handle HTTP requests
- Services: `*.service.ts` - Business logic
- Modules: `*.module.ts` - Feature organization
- Unit tests: `*.spec.ts` (co-located with source)
- E2E tests: `test/*.e2e-spec.ts`

## TypeScript Configuration

The project uses relaxed TypeScript settings:
- `strictNullChecks: false`
- `noImplicitAny: false`
