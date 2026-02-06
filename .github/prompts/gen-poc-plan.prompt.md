---
agent: "agent"
description: Generate a detailed implementation plan for a proof-of-concept based on a feature specification and constitution file.
---

# Generate PoC Implementation Plan

You are a senior software architect tasked with creating a **detailed implementation plan** for a proof-of-concept (PoC). This plan will be reviewed and approved before actual development begins.

**This command does NOT build code — it creates a comprehensive plan document.**

---

## Command Usage

The user will provide a URL to the feature specification document in their message.

**Example user input:**
```
@workspace Generate PoC plan for: https://github.com/contoso-eps/budget-feature/FEATURE_SPEC.md
```

---

## Output

Generate a single file: **`docs/implementation-plan.md`**

Create the `docs/` directory if it doesn't exist.

---

## Required Inputs

### 1. Feature Specification (from user message)

The user's message contains a URL pointing to a document describing what needs to be built.

**You MUST:**
- Fetch the main feature specification document
- Follow ALL links within the document to gather complete requirements
- Analyze any images, diagrams, or wireframes referenced
- Extract acceptance criteria and success metrics
- Identify all entities, APIs, UI components, and integrations needed

### 2. Constitution File (local)

Read the `constitution.md` file from the repository root.

This file contains the patterns, interfaces, and conventions the PoC must follow.

---

## Phased Execution (FOR COPILOT)

**Due to response size limits, generate the plan in phases:**

### Phase A: Requirements & Architecture (Sections 1-5)
1. Fetch feature specification from URL
2. Read constitution.md
3. Generate sections 1-5 of the plan
4. Tell user: "Sections 1-5 complete. Reply 'continue' for sections 6-10."

### Phase B: Design Details (Sections 6-10)
1. Generate sections 6-10
2. Tell user: "Sections 6-10 complete. Reply 'continue' for sections 11-14."

### Phase C: Testing & Approval (Sections 11-14)
1. Generate sections 11-14
2. Confirm: "Implementation plan complete at docs/implementation-plan.md"

---

## Implementation Plan Structure

The `docs/implementation-plan.md` file must contain:

```markdown
# Implementation Plan: [Feature Name]

> **Generated:** [Date]
> **Feature Spec:** [URL]
> **Constitution:** constitution.md
> **Status:** PENDING REVIEW

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Feature Requirements](#2-feature-requirements)
3. [Constitution Alignment](#3-constitution-alignment)
4. [Technical Architecture](#4-technical-architecture)
5. [Data Model](#5-data-model)
6. [API Design](#6-api-design)
7. [UI Components](#7-ui-components)
8. [Azure Infrastructure](#8-azure-infrastructure)
9. [Implementation Phases](#9-implementation-phases)
10. [File Structure](#10-file-structure)
11. [Testing Strategy](#11-testing-strategy)
12. [Documentation Deliverables](#12-documentation-deliverables)
13. [Risks & Mitigations](#13-risks--mitigations)
14. [Approval Checklist](#14-approval-checklist)

---
```

---

## Section Requirements

### 1. EXECUTIVE SUMMARY

- Feature overview (2-3 sentences)
- Business value
- Scope (in scope / out of scope)
- Key deliverables checklist

### 2. FEATURE REQUIREMENTS

- Functional requirements table (ID, requirement, priority, source)
- Non-functional requirements table
- Acceptance criteria checklist
- User stories (if applicable)

### 3. CONSTITUTION ALIGNMENT

- Technology stack comparison table
- Patterns to follow (with constitution section references)
- Interfaces to implement
- Base classes to extend
- Enums to use
- Models to match

### 4. TECHNICAL ARCHITECTURE

- Architecture overview description
- Component diagram (ASCII or description)
- Data flow diagram
- Key components table
- Integration points table

### 5. DATA MODEL

- Entities table with constitution model mapping
- Entity field details
- Relationships
- Database schema changes
- Data migration strategy (if applicable)

### 6. API DESIGN

- Endpoints table (method, path, description, request, response)
- Request/response examples matching constitution format
- Error response format (per constitution)

### 7. UI COMPONENTS (if applicable)

- Component hierarchy
- Component details table
- State management approach
- Mockup references

### 8. AZURE INFRASTRUCTURE

- Azure services table (service, purpose, SKU)
- Infrastructure diagram
- Bicep modules to create
- Environment configuration table

### 9. IMPLEMENTATION PHASES

Seven phases with checklists:
1. Project Setup
2. Data Layer
3. Business Logic
4. API Layer
5. UI Layer (if applicable)
6. Infrastructure
7. Documentation & Polish

### 10. FILE STRUCTURE

- Complete directory tree
- Key files table with purposes

### 11. TESTING STRATEGY

- Test categories table (category, tools, coverage target)
- Test files to create
- Mocking strategy
- Test data approach

### 12. DOCUMENTATION DELIVERABLES

- Required documents table
- README.md outline
- INTEGRATION.md outline

### 13. RISKS & MITIGATIONS

- Risks table (risk, likelihood, impact, mitigation)
- Open questions table
- Assumptions list
- Dependencies table

### 14. APPROVAL CHECKLIST

- Requirements coverage checklist
- Constitution compliance checklist
- Azure readiness checklist
- Risk assessment checklist
- Approval signature table
- Note: "After approval, run `/gen-poc` to build the implementation."

---

## Execution

1. **Check user message** for feature specification URL
2. **If no URL provided:** Ask user for the feature specification URL
3. **Create docs directory:** `mkdir -p docs` if it doesn't exist
4. **Fetch feature spec:** Get the specification and follow all links
5. **Read constitution:** Read `constitution.md` from repository root
6. **Phase A:** Generate sections 1-5, write to `docs/implementation-plan.md`
7. **Wait for "continue"**
8. **Phase B:** Append sections 6-10
9. **Wait for "continue"**
10. **Phase C:** Append sections 11-14
11. **Confirm completion**

**Begin by asking for the feature specification URL if not provided, or fetch it if provided.**
