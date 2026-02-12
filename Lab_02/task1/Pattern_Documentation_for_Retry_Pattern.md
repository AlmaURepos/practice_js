# Lab 2.1: Pattern Documentation & GoF - Retry with Backoff Pattern

## Task 1: Pattern Name and Classification (5 points)

### Pattern Name
**Retry with Backoff Pattern** (also known as "Exponential Backoff Retry Pattern")

### Classification
**Behavioral Pattern**

### Justification
According to Chapter 3 and Chapter 6 of "Learning JavaScript Design Patterns" by Addy Osmani:

- **Creational Patterns** - create objects
- **Structural Patterns** - structure classes and objects
- **Behavioral Patterns** - manage interactions and algorithms between objects

The Retry with Backoff Pattern is classified as a **Behavioral Pattern** because it manages the behavior of operation execution over time and controls the interaction between the client and the asynchronous operation through retry logic and timing strategies.

---

## Task 2: Core Structure Documentation (25 points)

### 1. Context (Prerequisites) - 8 points

**When does this pattern apply:**
- When external resources are unreliable (APIs, databases, networks)
- When asynchronous operations are used
- When temporary failures occur (network timeouts, temporary service unavailability)
- When you need to handle transient errors gracefully

**Prerequisites:**
- The operation must return a Promise or be async/await compatible
- The operation must be idempotent (safe to retry)
- Possibility of repeated execution must be supported
- Network or I/O operations that may experience temporary failures

**Environmental Constraints:**
- Must not be used for fatal/permanent errors
- Requires control over maximum retry attempts
- Requires delay management between attempts to avoid overwhelming the service
- Network/server response capability is required

---

### 2. Problem (Forces) - 8 points

**The Problem:**
Asynchronous operations (fetch, database queries, API calls) frequently fail with temporary errors due to:
- Network unavailability or connectivity issues
- Service timeouts
- Server temporary overload
- Rate limiting
- Temporary resource unavailability

**Why a simple solution isn't sufficient:**
- Simple error handling would require the client to implement retry logic everywhere
- Without backoff delays, rapid retries can overwhelm servers and cause cascading failures
- Developers would duplicate retry code across multiple operations
- Lack of centralized error handling strategy
- No standardized approach to determining which errors are retryable

**Forces/Constraints:**
- Need for reliability vs. avoiding infinite loops
- Need for performance vs. managing retry delays
- Need for flexibility vs. keeping implementation simple

---

### 3. Solution (Implementation) - 9 points

**Structure of the Solution:**

The Retry with Backoff Pattern wraps an operation in a retry loop that:

```javascript
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();
      return result;  // Success - return immediately
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve =>
          setTimeout(resolve, delay * attempt)
        );
      }
    }
  }
  throw lastError;  // All retries exhausted
}
```

**Participants:**
- **Client**: Initiates the operation through retryOperation()
- **retryOperation()**: The wrapper function that implements retry logic
- **operation**: The async function being retried
- **delay**: Base delay between attempts (increases exponentially)
- **maxRetries**: Maximum number of attempts allowed

**Collaborations:**
1. Client calls `retryOperation(asyncFunc, maxRetries, delay)`
2. Loop attempts execution up to maxRetries times
3. On success: immediately return result
4. On failure:
   - If retries remaining: wait exponentially increasing delay
   - If retries exhausted: throw final error
5. Exponential backoff: delay = baseDelay × attemptNumber

**Implementation Guidelines:**
- Validate that operation is a function
- Ensure maxRetries is a positive integer
- Set reasonable default values (3 retries, 1000ms delay)
- Consider only retrying on specific error types
- Implement circuit breaker for multiple failures
- Log retry attempts for debugging

---

## Task 3: GoF Format Extensions (15 points)

### 1. Consequences (Trade-offs, Benefits, Liabilities) - 5 points

**Benefits:**
- **Improved Reliability**: Handles temporary failures gracefully without client involvement
- **Reduced Service Load**: Exponential backoff prevents overwhelming servers with rapid retries
- **Code Reusability**: Centralized retry logic eliminates duplication
- **Transparent Error Handling**: Clients can use retryOperation without knowing implementation details
- **Better User Experience**: Automatic recovery from transient failures improves perceived reliability

**Liabilities/Trade-offs:**
- **Latency Cost**: Waiting between retries adds total operation time (user experiences delays)
- **Complexity**: Adds abstraction layer that may obscure actual failures
- **Resource Consumption**: Keeping connections/resources alive during retries
- **Overhead**: Not suitable for operations that are always going to fail (wasted resources)
- **Error Masking**: May hide underlying issues by temporarily recovering from them

---

### 2. Related Patterns - 5 points

**1. Circuit Breaker Pattern**
- **Relationship**: Complements Retry Pattern
- **How they work together**: Circuit Breaker prevents retries when service is down; Retry Pattern handles temporary glitches
- **When to use together**: For critical external services that need both fault tolerance and overload protection

**2. Timeout Pattern**
- **Relationship**: Works in conjunction with Retry Pattern
- **How they work together**: Timeout prevents indefinite waiting; combined with retries for faster failure detection
- **When to use together**: Essential for any retry logic to avoid resource exhaustion

**3. Bulkhead Pattern** (from modern JavaScript patterns)
- **Relationship**: Complements both Retry and Circuit Breaker
- **How they work together**: Isolates failure domains; Retry provides recovery, Bulkhead prevents cascade failures
- **Reference**: Modern resilience pattern for distributed systems

---

### 3. Known Usage - 5 points

**Real-world Examples:**

1. **AWS SDK** - Implements automatic retry with exponential backoff for all service calls
   - Default max retries: 3 attempts
   - Default base delay: 100ms
   - Reference: AWS JavaScript SDK documentation

2. **Node.js Fetch API** - Many implementations wrap fetch with retry logic
   - Popular libraries: `node-fetch-retry`, `retry` npm package
   - Used by major services for API resilience

3. **Google Cloud Client Libraries**
   - Implements retry with exponential backoff for all RPC calls
   - Configurable retry policies per service

4. **Express.js Middleware** - Popular packages use this pattern:
   - `async-retry` package (100k+ weekly downloads)
   - Used for database connections and external API calls

5. **Modern Browser Fetch (with libraries)**
   - Service Workers often implement retry logic
   - Progressive Web Apps use for offline resilience

---

## Task 4: Pattern Illustration (5 points)

### Execution Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │ calls retryOperation(fn, 3, 1000)
                           ▼
        ┌──────────────────────────────────────┐
        │  retryOperation() Wrapper            │
        │  ─────────────────────────────────── │
        │  maxRetries = 3                      │
        │  baseDelay = 1000ms                  │
        └──────────┬───────────────────────────┘
                   │
        ┌──────────▼────────────┐
        │  Loop: attempt = 1..3 │
        └──────────┬────────────┘
                   │
        ┌──────────▼──────────────────┐
        │  Execute Operation()        │
        └──────────┬───────────────────┘
                   │
           ┌───────┴────────┐
           │                │
      ┌────▼─────┐    ┌────▼──────────────┐
      │ SUCCESS  │    │  FAILURE/ERROR    │
      └────┬─────┘    └────┬──────────────┘
           │               │
        ┌──▼────────┐   ┌──▼──────────────────┐
        │Return     │   │Last attempt?       │
        │Result     │   └──┬─────────────┬───┘
        │Immediately│      │             │
        └───────────┘   NO │            YES│
                        │             │
                   ┌────▼────┐  ┌────▼────────┐
                   │Wait     │  │Throw LastErr│
                   │Delay *  │  │& Exit       │
                   │Attempt# │  └─────────────┘
                   │         │
                   │Retry    │
                   └────┬────┘
                        │
                   ┌────▼──────┐
                   │Next Loop  │
                   │Iteration  │
                   └───────────┘
```

### Retry Loop State Diagram

```
     ┌─────────────────┐
     │   START: Reset  │
     │  lastError      │
     └────────┬────────┘
              │
     ┌────────▼────────────┐
     │ Loop Condition:     │
     │ attempt ≤ maxRetries│
     └────────┬────────────┘
              │
        ┌─────┴─────┐
        │           │
    FALSE│        TRUE│
        │           │
     ┌──▼──┐   ┌───▼──────────────────┐
     │THROW│   │TRY: operation()      │
     │Error│   └───┬──────────────────┘
     └─────┘       │
                   ├─── SUCCESS ──→ RETURN result
                   │
                   └─── CATCH error ──→ ┌─────────────┐
                                        │attempt < max?│
                                        └──┬────────┬──┘
                                           │YES   NO│
                                        ┌──▼──┐ ┌──▼──┐
                                        │WAIT │ │THROW│
                                        │then │ │Error│
                                        │LOOP │ └─────┘
                                        └──┬──┘
                                           │
                                        (increment attempt)
```

### Component Interaction Diagram

```
┌────────────┐         ┌──────────────────┐         ┌──────────────┐
│   Client   │────────▶│ retryOperation   │────────▶│   Operation  │
│ Code       │         │ Function         │         │ (e.g., fetch)│
└────────────┘         │                  │         └──────────────┘
     △                 │ • Retry Logic    │               │
     │                 │ • Error Handling │               │
     │                 │ • Backoff Timing │               │
     └─────────────────│                  │◀──────────────┘
     Return            └──────────────────┘   Success/Error
     Success/
     Error
```

---

## Code Implementation Example

```javascript
// Retry with Backoff Pattern Implementation
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  /**
   * Executes an async operation with exponential backoff retry strategy.
   *
   * @param {Function} operation - Async function to retry
   * @param {number} maxRetries - Maximum retry attempts (default: 3)
   * @param {number} delay - Base delay in ms between retries (default: 1000)
   * @returns {Promise} - Result of successful operation
   * @throws {Error} - Last error if all retries fail
   */

  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}`);
      const result = await operation();
      console.log(`Success on attempt ${attempt}`);
      return result;

    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.message);

      // If more retries available, wait before trying again
      if (attempt < maxRetries) {
        const waitTime = delay * attempt; // Exponential backoff
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // All retries exhausted
  throw new Error(`Operation failed after ${maxRetries} attempts. Last error: ${lastError.message}`);
}

// Usage Example
const exampleUsage = async () => {
  try {
    const data = await retryOperation(
      () => fetch('https://api.example.com/data').then(r => r.json()),
      3,      // max retries
      1000    // base delay in ms
    );
    console.log('Data received:', data);
  } catch (error) {
    console.error('Operation failed after all retries:', error);
  }
};
```

---

## References

- Osmani, Addy. *Learning JavaScript Design Patterns*, 2nd Edition. O'Reilly Media, 2020.
  - Chapter 3: "Structuring and Writing Patterns"
  - Chapter 6: "GoF Design Patterns"

- Gamma, Erich, et al. *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley, 1995.

---

**Document prepared in accordance with GoF (Gang of Four) format specification from Chapter 3, Section "Writing a Pattern"**

**Student Name:** ____________________
**Date:** _______
**Course:** Week 2 Lab 02 - Pattern Documentation & GoF 