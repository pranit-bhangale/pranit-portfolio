# React Performance Optimization: A Complete Guide with Code Examples

React is fast by default — but as your app grows, unnecessary re-renders, large bundles, and unoptimized state management can make it feel sluggish. This blog covers every major React performance technique, one concept at a time, with clear before/after code examples so you know exactly what to do and why.

---

## 1. Understanding How React Renders

Before optimizing, you need to understand what triggers a render.

React re-renders a component when:
- Its **state** changes
- Its **props** change
- Its **parent** re-renders (even if props didn't change)
- A **context** it consumes changes

Each re-render runs the component function again, diffs the new virtual DOM against the previous one, and updates only the changed parts of the real DOM.

```jsx
function Parent() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <Child /> {/* re-renders every time Parent re-renders — even though Child has no props */}
    </div>
  );
}

function Child() {
  console.log("Child rendered"); // logs on every Parent state change
  return <p>I am a child</p>;
}
```

This is the root cause of most React performance issues. Let's fix it.

---

## 2. React.memo — Prevent Unnecessary Re-renders

`React.memo` is a higher-order component that memoizes a functional component. It skips re-rendering if props haven't changed (shallow comparison).

**Without React.memo:**

```jsx
function ProductCard({ name, price }) {
  console.log("ProductCard rendered:", name);
  return (
    <div>
      <h3>{name}</h3>
      <p>₹{price}</p>
    </div>
  );
}

function App() {
  const [cart, setCart] = React.useState([]);

  return (
    <div>
      <button onClick={() => setCart([...cart, "item"])}>Add to Cart</button>
      {/* Re-renders on every cart update — even though product data didn't change */}
      <ProductCard name="Laptop" price={75000} />
    </div>
  );
}
```

**With React.memo:**

```jsx
const ProductCard = React.memo(function ProductCard({ name, price }) {
  console.log("ProductCard rendered:", name); // only logs when name or price changes
  return (
    <div>
      <h3>{name}</h3>
      <p>₹{price}</p>
    </div>
  );
});
```

Now `ProductCard` only re-renders when `name` or `price` actually changes.

> **Gotcha:** `React.memo` uses shallow comparison. Passing a new object or function reference on every render will break memoization — we'll fix that next.

---

## 3. useCallback — Stable Function References

Functions are recreated on every render. When you pass a function as a prop to a memoized child, the child re-renders anyway because the function reference is new each time.

**Problem:**

```jsx
const Button = React.memo(({ onClick, label }) => {
  console.log("Button rendered:", label);
  return <button onClick={onClick}>{label}</button>;
});

function App() {
  const [count, setCount] = React.useState(0);

  // New function reference on every render — breaks React.memo
  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <Button onClick={handleClick} label="Action" /> {/* still re-renders! */}
    </div>
  );
}
```

**Fix with useCallback:**

```jsx
function App() {
  const [count, setCount] = React.useState(0);

  // Stable reference — only recreated if dependencies change
  const handleClick = React.useCallback(() => {
    console.log("clicked");
  }, []); // empty deps = created once

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <Button onClick={handleClick} label="Action" /> {/* no longer re-renders */}
    </div>
  );
}
```

**With dependencies:**

```jsx
const handleSearch = React.useCallback((query) => {
  fetchResults(query, userId); // userId is a dependency
}, [userId]); // recreated only when userId changes
```

---

## 4. useMemo — Memoize Expensive Computations

`useMemo` caches the result of an expensive calculation and only recomputes it when its dependencies change.

**Without useMemo — runs on every render:**

```jsx
function ProductList({ products, searchTerm }) {
  // This filter runs on EVERY render — even unrelated state changes
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ul>
      {filtered.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
```

**With useMemo — only recomputes when dependencies change:**

```jsx
function ProductList({ products, searchTerm }) {
  const filtered = React.useMemo(() => {
    console.log("Filtering products...");
    return products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]); // only recomputes when these change

  return (
    <ul>
      {filtered.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
```

**Another common use — stable object references:**

```jsx
function Dashboard({ userId }) {
  // Without useMemo, new object reference on every render
  const config = React.useMemo(() => ({
    userId,
    theme: "dark",
    language: "en"
  }), [userId]);

  return <Chart config={config} />;
}
```

> **Rule of thumb:** Use `useMemo` for expensive computations (sorting, filtering large arrays, complex math) and for stabilizing object references passed to memoized children.

---

## 5. State Colocation — Move State Down

One of the most impactful (and free) optimizations. Lifting state too high causes the entire tree to re-render when only a small part needs to.

**Bad — state too high:**

```jsx
function App() {
  const [isModalOpen, setIsModalOpen] = React.useState(false); // lives in App
  const [products, setProducts] = React.useState([]);

  return (
    <div>
      <Header />
      <ProductList products={products} /> {/* re-renders when modal opens */}
      <Footer />
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
```

Every time the modal opens, `Header`, `ProductList`, and `Footer` all re-render — even though they don't care about the modal.

**Good — state colocated:**

```jsx
// Modal state lives inside its own component
function ModalButton() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      {isOpen && <Modal onClose={() => setIsOpen(false)} />}
    </>
  );
}

function App() {
  const [products, setProducts] = React.useState([]);

  return (
    <div>
      <Header />
      <ProductList products={products} /> {/* no longer affected by modal */}
      <Footer />
      <ModalButton /> {/* isolated */}
    </div>
  );
}
```

---

## 6. Code Splitting with React.lazy and Suspense

Large bundles slow down initial page load. Code splitting lets you load components only when they're needed.

**Without code splitting — everything loads upfront:**

```jsx
import Dashboard from './Dashboard';
import Analytics from './Analytics';
import Settings from './Settings';

// All three are bundled together even if user never visits Analytics or Settings
```

**With React.lazy — load on demand:**

```jsx
import React, { Suspense, lazy } from 'react';

const Dashboard  = lazy(() => import('./Dashboard'));
const Analytics  = lazy(() => import('./Analytics'));
const Settings   = lazy(() => import('./Settings'));

function App() {
  return (
    <Suspense fallback={<div className="loader">Loading...</div>}>
      <Routes>
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/analytics"  element={<Analytics />} />
        <Route path="/settings"   element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

Each route now loads its own chunk only when the user navigates to it. Initial bundle size drops significantly.

**Named exports with lazy:**

```jsx
// If your component uses named export
const UserProfile = lazy(() =>
  import('./UserProfile').then(module => ({ default: module.UserProfile }))
);
```

---

## 7. Virtualization — Render Only What's Visible

Rendering thousands of list items at once is a guaranteed performance killer. Virtualization renders only the items currently visible in the viewport.

**Without virtualization — renders all 10,000 rows:**

```jsx
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li> // 10,000 DOM nodes!
      ))}
    </ul>
  );
}
```

**With react-window — renders only ~20 visible rows:**

```jsx
import { FixedSizeList as List } from 'react-window';

function UserList({ users }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {users[index].name}
    </div>
  );

  return (
    <List
      height={500}       // visible container height
      itemCount={users.length}
      itemSize={50}      // height of each row
      width="100%"
    >
      {Row}
    </List>
  );
}
```

Only ~10-20 DOM nodes exist at any time, regardless of list size.

---

## 8. Debouncing — Avoid Excessive State Updates

Search inputs that update state on every keystroke trigger a re-render on every character typed. Debouncing delays the update until the user stops typing.

**Without debounce — fires on every keystroke:**

```jsx
function SearchBox({ onSearch }) {
  const [query, setQuery] = React.useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value); // API call on every keystroke!
  };

  return <input value={query} onChange={handleChange} placeholder="Search..." />;
}
```

**With debounce using useCallback:**

```jsx
import { useState, useCallback } from 'react';

function useDebounce(fn, delay) {
  const timerRef = React.useRef(null);

  return React.useCallback((...args) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

function SearchBox({ onSearch }) {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebounce(onSearch, 400);

  const handleChange = (e) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value); // fires only after 400ms of inactivity
  };

  return <input value={query} onChange={handleChange} placeholder="Search..." />;
}
```

---

## 9. Context Optimization — Avoid Context Re-render Storms

When a Context value changes, every component that consumes it re-renders — even if it only uses a small part of the context.

**Problem — one context, too many consumers:**

```jsx
const AppContext = React.createContext();

function AppProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [theme, setTheme] = React.useState('light');
  const [cart, setCart] = React.useState([]);

  // Any change to user, theme, OR cart re-renders ALL consumers
  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme, cart, setCart }}>
      {children}
    </AppContext.Provider>
  );
}
```

**Fix — split contexts by concern:**

```jsx
const UserContext   = React.createContext();
const ThemeContext  = React.createContext();
const CartContext   = React.createContext();

function UserProvider({ children }) {
  const [user, setUser] = React.useState(null);
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState('light');
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

function CartProvider({ children }) {
  const [cart, setCart] = React.useState([]);
  return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
}

// Components only re-render when their specific context changes
function CartIcon() {
  const { cart } = React.useContext(CartContext); // only re-renders on cart changes
  return <span>{cart.length}</span>;
}
```

---

## 10. useTransition — Keep UI Responsive During Heavy Updates

`useTransition` (React 18+) lets you mark state updates as non-urgent, keeping the UI responsive while heavy work happens in the background.

**Without useTransition — UI freezes during heavy filter:**

```jsx
function SearchPage({ items }) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState(items);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    // Heavy computation blocks the input from updating smoothly
    setResults(items.filter(item => item.name.includes(e.target.value)));
  };

  return (
    <>
      <input value={query} onChange={handleSearch} />
      <ResultList results={results} />
    </>
  );
}
```

**With useTransition — input stays snappy:**

```jsx
function SearchPage({ items }) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState(items);
  const [isPending, startTransition] = React.useTransition();

  const handleSearch = (e) => {
    setQuery(e.target.value); // urgent — updates immediately

    startTransition(() => {
      // non-urgent — React can defer this if needed
      setResults(items.filter(item => item.name.includes(e.target.value)));
    });
  };

  return (
    <>
      <input value={query} onChange={handleSearch} />
      {isPending && <span>Updating results...</span>}
      <ResultList results={results} />
    </>
  );
}
```

---

## 11. useDeferredValue — Defer Expensive Child Renders

`useDeferredValue` (React 18+) defers updating a value until the browser is idle — great for search results or filtered lists.

```jsx
function SearchResults({ query }) {
  // Expensive component — renders a large filtered list
  const filtered = React.useMemo(() =>
    heavyFilter(allItems, query), [query]
  );

  return <ul>{filtered.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
}

function SearchPage() {
  const [query, setQuery] = React.useState('');
  const deferredQuery = React.useDeferredValue(query); // lags behind intentionally

  return (
    <>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)} // updates immediately
      />
      {/* Uses deferred value — won't block the input */}
      <SearchResults query={deferredQuery} />
    </>
  );
}
```

The input always feels instant. The results update slightly after, but the user experience is smooth.

---

## 12. Avoid Inline Objects and Functions in JSX

This is one of the most common and subtle performance mistakes.

**Bad — new reference on every render:**

```jsx
function App() {
  return (
    <UserCard
      style={{ color: 'red', fontSize: 16 }}  // new object every render
      onClick={() => console.log('clicked')}   // new function every render
    />
  );
}
```

Even if `UserCard` is wrapped in `React.memo`, it will re-render every time because the object and function references are always new.

**Good — stable references:**

```jsx
const cardStyle = { color: 'red', fontSize: 16 }; // defined outside component

function App() {
  const handleClick = React.useCallback(() => {
    console.log('clicked');
  }, []);

  return <UserCard style={cardStyle} onClick={handleClick} />;
}
```

---

## 13. Key Prop — Help React Identify List Items

The `key` prop tells React which items changed, were added, or removed. Using the wrong key causes unnecessary unmounts and remounts.

**Bad — using index as key:**

```jsx
{items.map((item, index) => (
  <TodoItem key={index} item={item} /> // index shifts when items are reordered/deleted
))}
```

When you delete item at index 0, every item's key shifts — React remounts the entire list.

**Good — use stable unique IDs:**

```jsx
{items.map(item => (
  <TodoItem key={item.id} item={item} /> // stable — React correctly identifies each item
))}
```

---

## 14. Profiling with React DevTools

Never optimize blindly. Use the React DevTools Profiler to find what's actually slow.

**Steps:**
1. Install React DevTools browser extension
2. Open DevTools → Profiler tab
3. Click Record, interact with your app, click Stop
4. Inspect the flame graph — look for components with high render times or frequent renders
5. Check "Why did this render?" for each component

**In code — wrap expensive trees with Profiler:**

```jsx
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log(`${id} [${phase}] took ${actualDuration.toFixed(2)}ms`);
}

function App() {
  return (
    <Profiler id="ProductList" onRender={onRenderCallback}>
      <ProductList />
    </Profiler>
  );
}
```

---

## 15. Image Optimization

Images are often the biggest performance bottleneck on the network side.

```jsx
// Bad — loads full-size image regardless of display size
<img src="/hero-image.jpg" alt="Hero" />

// Good — use modern formats, lazy loading, and explicit dimensions
<img
  src="/hero-image.webp"
  alt="Hero"
  width={1200}
  height={600}
  loading="lazy"          // browser-native lazy loading
  decoding="async"        // non-blocking decode
/>
```

