
# JVM Architecture: A Complete End-to-End Explanation

> If you want to write Java that performs well, handles memory correctly, and never surprises you in production — you need to understand what happens *after* you hit compile. This guide takes you inside the JVM, layer by layer.

---

## Why Every Java Developer Should Understand the JVM

Most developers write Java code, run it, and trust that it works. That trust is well-placed — until the day your application throws an `OutOfMemoryError` at 3 AM, a class mysteriously fails to load, or your service slows to a crawl under load.

The JVM is not a black box. It is a precisely engineered runtime with well-defined components, each with a specific responsibility. Once you understand those components, you stop guessing and start diagnosing.

This guide covers the entire JVM architecture end-to-end:

- How your source code becomes executable bytecode
- The Class Loader Subsystem and the Delegation Principle
- Every runtime memory area — what lives where and why
- The Execution Engine: Interpreter, JIT Compiler, and Garbage Collector
- Java Native Interface and Native Method Libraries
- Real code examples, JVM flags, and diagnostic tools throughout

---

## The Architecture at a Glance

Before diving into each component, here is the full picture. Every Java program flows through these layers in sequence.

```
┌──────────────────────────────────────────────────────────────────┐
│                        JVM Architecture                          │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │                 Class Loader Subsystem                   │   │
│   │                                                          │   │
│   │   ┌────────────┐   ┌──────────────┐   ┌──────────────┐  │   │
│   │   │  Loading   │ → │   Linking    │ → │Initialization│  │   │
│   │   │            │   │              │   │              │  │   │
│   │   │ Bootstrap  │   │  Verification│   │ Static vars  │  │   │
│   │   │ Extension  │   │  Preparation │   │ Static blocks│  │   │
│   │   │ Application│   │  Resolution  │   │              │  │   │
│   │   └────────────┘   └──────────────┘   └──────────────┘  │   │
│   └──────────────────────────────────────────────────────────┘   │
│                               ↓                                  │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │                  Runtime Memory Areas                    │   │
│   │                                                          │   │
│   │  ┌───────────┐  ┌─────────────┐  ┌──────┐  ┌────────┐  │   │
│   │  │ Metaspace │  │    Heap     │  │Stack │  │   PC   │  │   │
│   │  │           │  │ Young + Old │  │(per  │  │Register│  │   │
│   │  │ Class     │  │ Generation  │  │thread│  │(per    │  │   │
│   │  │ Metadata  │  │             │  │)     │  │thread) │  │   │
│   │  └───────────┘  └─────────────┘  └──────┘  └────────┘  │   │
│   └──────────────────────────────────────────────────────────┘   │
│                               ↓                                  │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │                    Execution Engine                      │   │
│   │                                                          │   │
│   │   ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │   │
│   │   │ Interpreter │  │ JIT Compiler │  │   Garbage     │  │   │
│   │   │             │  │              │  │   Collector   │  │   │
│   │   └─────────────┘  └──────────────┘  └───────────────┘  │   │
│   └──────────────────────────────────────────────────────────┘   │
│                               ↓                                  │
│   ┌─────────────────────────┐   ┌──────────────────────────┐    │
│   │  Java Native Interface  │   │  Native Method Library   │    │
│   └─────────────────────────┘   └──────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

---

## Section 1 — From Source Code to Bytecode

The JVM never sees your `.java` files. Before execution begins, the Java compiler (`javac`) transforms your source code into **bytecode** — a compact, platform-neutral instruction set stored in `.class` files.

```java
// HelloWorld.java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, JVM!");
    }
}
```

Compile it:

```bash
javac HelloWorld.java
# Produces: HelloWorld.class
```

You can inspect the bytecode directly using `javap`:

```bash
javap -c HelloWorld.class
```

```
public class HelloWorld {
  public static void main(java.lang.String[]);
    Code:
       0: getstatic     #7    // Field java/lang/System.out
       3: ldc           #13   // String "Hello, JVM!"
       5: invokevirtual #15   // Method println:(Ljava/lang/String;)V
       8: return
}
```

These are **bytecode instructions** — not machine code for any specific CPU. The JVM reads and executes them. This is the foundation of Java's "Write Once, Run Anywhere" promise: the bytecode is identical on Windows, Linux, and macOS. Only the JVM implementation differs per platform.

> **Key insight:** The `.class` file is not your final executable. It is a contract between your code and the JVM. The JVM decides how to execute it — interpreted, compiled, or optimized — based on runtime conditions.

---

## Section 2 — The Class Loader Subsystem

The Class Loader Subsystem is the JVM's front door. Before any code can run, the relevant `.class` files must be found, loaded into memory, verified for correctness, and initialized. This happens in three sequential phases.

```
.class file  →  [ Loading ]  →  [ Linking ]  →  [ Initialization ]  →  Ready
```

---

### Phase 1: Loading

Loading reads the raw bytes of a `.class` file and creates a `java.lang.Class` object in the JVM's Metaspace. The JVM uses three built-in class loaders, each responsible for a different part of the classpath.

#### The Class Loader Hierarchy

```
Bootstrap ClassLoader       ← root, loads JDK core (java.lang.*, java.util.*)
        ↑ parent
Extension ClassLoader       ← loads JDK extensions (security, crypto, XML)
        ↑ parent
Application ClassLoader     ← loads your application and third-party JARs
        ↑ parent
Custom ClassLoader          ← optional, for plugins, hot-reload, encryption
```

**Bootstrap ClassLoader**

The root of the hierarchy. Written in native C/C++ — it is not a Java class itself. It loads the JDK's core classes from `$JAVA_HOME/lib/modules` (Java 9+) or `rt.jar` (Java 8 and earlier).

```java
// Classes loaded by Bootstrap return null for getClassLoader()
System.out.println(String.class.getClassLoader());  // null
System.out.println(Object.class.getClassLoader());  // null
System.out.println(System.class.getClassLoader());  // null
```

**Extension ClassLoader** *(Platform ClassLoader in Java 9+)*

Loads JDK extension classes — security providers, XML parsers, cryptographic extensions — from `$JAVA_HOME/lib/ext/`.

```java
System.out.println(com.sun.crypto.provider.SunJCE.class.getClassLoader());
// sun.misc.Launcher$ExtClassLoader@...
```

**Application ClassLoader** *(System ClassLoader)*

Loads everything on your classpath: your compiled classes, third-party JARs, and framework libraries. This is the default loader for all application code.

```java
System.out.println(HelloWorld.class.getClassLoader());
// sun.misc.Launcher$AppClassLoader@...
```

---

### The Delegation Principle — The Most Important Rule in Class Loading

When a class loader is asked to load a class, it does **not** attempt to load it immediately. It first **delegates the request to its parent**. The parent does the same — delegating upward — until the request reaches the Bootstrap ClassLoader. Only if the parent cannot find the class does the child attempt to load it itself.

This is called the **Parent Delegation Model**.

```
AppClassLoader.loadClass("com.myapp.UserService")
  │
  ├─ Check cache → not found
  ├─ Delegate to ExtClassLoader
  │     ├─ Check cache → not found
  │     ├─ Delegate to Bootstrap
  │     │     ├─ Check cache → not found
  │     │     ├─ Search rt.jar / modules → not found
  │     │     └─ Throw ClassNotFoundException (internally)
  │     ├─ Search ext dirs → not found
  │     └─ Throw ClassNotFoundException (internally)
  ├─ Search classpath → FOUND at /app/build/classes/
  └─ Load, link, initialize → return Class object
```

Here is the actual algorithm, simplified from the JDK source:

```java
protected Class<?> loadClass(String name, boolean resolve)
        throws ClassNotFoundException {

    // Step 1: Check if this class was already loaded
    Class<?> c = findLoadedClass(name);

    if (c == null) {
        try {
            // Step 2: Delegate to parent first — always
            if (parent != null) {
                c = parent.loadClass(name, false);
            } else {
                // No parent means we are one level below Bootstrap
                c = findBootstrapClassOrNull(name);
            }
        } catch (ClassNotFoundException e) {
            // Parent could not find it — that is expected, not an error
        }

        if (c == null) {
            // Step 3: Parent failed — now we try ourselves
            c = findClass(name);
        }
    }

    if (resolve) resolveClass(c);
    return c;
}
```

**Why does this design exist?**

It protects the integrity of the JDK. Without delegation, a developer could create a class named `java.lang.String` in their project and accidentally (or maliciously) replace the real one. With delegation, the Bootstrap ClassLoader always loads `java.lang.String` first — your version is never reached.

```java
// This class will NEVER replace java.lang.String
// Bootstrap always wins for java.lang.* classes
package java.lang;
public class String {
    // Ignored — Bootstrap loads the real String before this is ever tried
}
```

**Visualizing the chain at runtime:**

```java
public class ClassLoaderChain {
    public static void main(String[] args) {
        ClassLoader cl = ClassLoaderChain.class.getClassLoader();

        while (cl != null) {
            System.out.println(cl.getClass().getName());
            cl = cl.getParent();
        }
        System.out.println("Bootstrap ClassLoader (null)");
    }
}

// Output:
// sun.misc.Launcher$AppClassLoader
// sun.misc.Launcher$ExtClassLoader
// Bootstrap ClassLoader (null)
```

---

### Writing a Custom ClassLoader

You can extend `ClassLoader` to load classes from any source — a database, an encrypted file, a remote server, or a ZIP archive. The only requirement is that you override `findClass()` and return a valid `Class` object.

```java
public class CustomClassLoader extends ClassLoader {

    private final String classDirectory;

    public CustomClassLoader(String classDirectory) {
        // Explicitly set parent to AppClassLoader — delegation still applies
        super(ClassLoader.getSystemClassLoader());
        this.classDirectory = classDirectory;
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        byte[] bytes = readClassBytes(name);
        if (bytes == null) {
            throw new ClassNotFoundException("Class not found: " + name);
        }
        // defineClass converts raw bytes into a usable Class object
        return defineClass(name, bytes, 0, bytes.length);
    }

    private byte[] readClassBytes(String className) {
        String path = classDirectory + "/" + className.replace('.', '/') + ".class";
        try (FileInputStream fis = new FileInputStream(path)) {
            return fis.readAllBytes();
        } catch (IOException e) {
            return null;
        }
    }
}
```

```java
// Usage
CustomClassLoader loader = new CustomClassLoader("/plugins/classes");
Class<?> pluginClass = loader.loadClass("com.plugins.ReportGenerator");
Object plugin = pluginClass.getDeclaredConstructor().newInstance();
System.out.println("Plugin loaded by: " + pluginClass.getClassLoader());
```

**Where custom class loaders are used in practice:**

| Use Case | Example |
|---|---|
| Application isolation | Tomcat gives each web app its own ClassLoader |
| Plugin systems | IDEs load plugins at runtime without restart |
| Hot reload | Frameworks reload changed classes during development |
| Security | Load encrypted `.class` files, decrypt in memory |
| OSGi bundles | Each bundle has its own isolated class loader |

---

### Phase 2: Linking

Once a class is loaded, it goes through three sub-phases before it can be used.

#### Verification

The JVM checks that the bytecode is structurally valid and safe to execute. This is a security boundary — it prevents malformed or tampered bytecode from crashing the JVM or violating type safety.

What gets verified:
- Every `.class` file must begin with the magic bytes `0xCAFEBABE`
- The class file version must be compatible with the running JVM
- All constant pool entries must be internally consistent
- Method signatures and return types must be valid
- The operand stack cannot overflow or underflow
- No illegal type casts or unsafe memory accesses

```bash
# Inspect the magic number in any .class file
xxd HelloWorld.class | head -1
# 00000000: cafe babe 0000 003d ...
#           ^^^^ ^^^^
#           Magic number: 0xCAFEBABE
```

If verification fails, the JVM throws a `VerifyError` before any code runs:

```
java.lang.VerifyError: Bad type on operand stack
  Location: com/example/BrokenClass.method()V @5: ireturn
  Reason: Type 'java/lang/String' is not assignable to integer
```

#### Preparation

The JVM allocates memory for all static (class-level) variables and assigns them their **type default values** — not the values you wrote in code. That assignment happens in the next phase.

| Data Type | Default Value |
|---|---|
| `int`, `short`, `byte`, `char` | `0` |
| `long` | `0L` |
| `float` | `0.0f` |
| `double` | `0.0d` |
| `boolean` | `false` |
| Any reference type | `null` |

```java
public class ServerConfig {
    public static int maxConnections = 100;   // Preparation → 0
    public static String host = "localhost";  // Preparation → null
    public static boolean ssl = true;         // Preparation → false
    // Initialization phase will assign the real values
}
```

#### Resolution

Symbolic references in the bytecode's constant pool are replaced with direct memory references. When `javac` compiles a method call, it does not know the actual memory address of the target method — it stores a symbolic name. During resolution, the JVM resolves that name to a concrete pointer.

```java
// Bytecode before resolution (symbolic reference):
invokevirtual #15  // "java/io/PrintStream.println:(Ljava/lang/String;)V"

// Bytecode after resolution (direct reference):
invokevirtual → [memory address of PrintStream.println]
```

---

### Phase 3: Initialization

Initialization is the final phase. Static variables are assigned their actual values and static initializer blocks execute — in the exact order they appear in the source file.

```java
public class DatabaseConfig {

    public static int maxPoolSize = 10;          // runs 1st

    public static String jdbcUrl;

    static {
        // runs 2nd
        jdbcUrl = "jdbc:mysql://localhost:3306/appdb";
        System.out.println("DatabaseConfig initialized. Pool size: " + maxPoolSize);
    }

    public static int connectionTimeout = maxPoolSize * 3; // runs 3rd → 30
}
```

**Initialization is triggered by:**
- `new DatabaseConfig()` — creating an instance
- `DatabaseConfig.maxPoolSize` — reading a static field
- `DatabaseConfig.connect()` — calling a static method
- `Class.forName("DatabaseConfig")` — explicit reflection
- Initialization of a subclass

**Initialization is NOT triggered by:**
- Reading a `static final` compile-time constant — the compiler inlines the value
- Declaring an array of the type: `DatabaseConfig[] arr = new DatabaseConfig[5]`

```java
public class Constants {
    static {
        System.out.println("Constants class initialized!");
    }
    public static final int MAX = 100; // compile-time constant
}

public class Main {
    public static void main(String[] args) {
        int x = Constants.MAX;
        // "Constants class initialized!" is NEVER printed
        // The compiler replaced Constants.MAX with the literal 100
    }
}
```

---

## Section 3 — Runtime Memory Areas

Once classes are loaded and initialized, the JVM needs memory to execute them. It divides its runtime memory into five distinct areas. Two are shared across all threads; three are private to each thread.

```
┌──────────────────────────────────────────────────────────────┐
│                  SHARED ACROSS ALL THREADS                   │
│                                                              │
│  ┌─────────────────────┐    ┌───────────────────────────┐   │
│  │      Metaspace      │    │           Heap            │   │
│  │   (Method Area)     │    │                           │   │
│  │                     │    │  ┌─────────────────────┐  │   │
│  │  Class metadata     │    │  │    Young Generation  │  │   │
│  │  Method bytecode    │    │  │  ┌────────┬────────┐ │  │   │
│  │  Static variables   │    │  │  │  Eden  │  S0/S1 │ │  │   │
│  │  Constant pool      │    │  │  └────────┴────────┘ │  │   │
│  │  Field descriptors  │    │  ├─────────────────────┤  │   │
│  └─────────────────────┘    │  │    Old Generation   │  │   │
│                             │  │     (Tenured)       │  │   │
│                             │  └─────────────────────┘  │   │
│                             └───────────────────────────┘   │
├──────────────────────────────────────────────────────────────┤
│              PRIVATE TO EACH THREAD                          │
│                                                              │
│  ┌──────────────────┐  ┌─────────────────┐  ┌───────────┐  │
│  │    JVM Stack     │  │   PC Register   │  │  Native   │  │
│  │                  │  │                 │  │  Method   │  │
│  │  Stack Frames    │  │  Address of     │  │  Stack    │  │
│  │  - Local vars    │  │  current instr  │  │           │  │
│  │  - Operand stack │  │                 │  │           │  │
│  │  - Frame data    │  │                 │  │           │  │
│  └──────────────────┘  └─────────────────┘  └───────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

### Metaspace — The Class Registry

Metaspace is where the JVM stores everything it knows about your classes. It replaced the old **PermGen** (Permanent Generation) space in Java 8. The key difference: PermGen was part of the JVM heap with a fixed maximum size, while Metaspace lives in native OS memory and grows dynamically.

**What Metaspace holds:**

- Fully qualified class and interface names
- Superclass and interface relationships
- Method signatures, bytecode, and modifiers
- Field names, types, and modifiers
- Static variable values
- Runtime constant pool entries
- Class loader references

```java
public class Employee {
    // Stored in Metaspace — belongs to the class, not any instance
    public static int totalEmployees = 0;

    // Stored in Heap — belongs to each individual object
    private String name;
    private double salary;

    // Method bytecode stored in Metaspace
    public void giveRaise(double percent) {
        this.salary *= (1 + percent / 100);
    }
}
```

**PermGen vs Metaspace — a quick comparison:**

| | PermGen (Java ≤ 7) | Metaspace (Java 8+) |
|---|---|---|
| Location | JVM heap | Native OS memory |
| Default max size | ~64 MB (fixed) | Unlimited (grows as needed) |
| Common failure | `OutOfMemoryError: PermGen space` | `OutOfMemoryError: Metaspace` |
| Size flag | `-XX:MaxPermSize=256m` | `-XX:MaxMetaspaceSize=256m` |

```bash
# Cap Metaspace to prevent unbounded growth
java -XX:MaxMetaspaceSize=256m MyApp

# Watch class loading in real time
java -verbose:class MyApp | grep "\[Loaded"
```

You can inspect class metadata programmatically using reflection:

```java
Class<?> clazz = Employee.class;

System.out.println("Name       : " + clazz.getName());
System.out.println("Superclass : " + clazz.getSuperclass().getName());
System.out.println("Loader     : " + clazz.getClassLoader());

System.out.println("\nFields:");
for (Field f : clazz.getDeclaredFields()) {
    System.out.printf("  %s %s %s%n",
        Modifier.toString(f.getModifiers()), f.getType().getSimpleName(), f.getName());
}

System.out.println("\nMethods:");
for (Method m : clazz.getDeclaredMethods()) {
    System.out.printf("  %s %s %s()%n",
        Modifier.toString(m.getModifiers()), m.getReturnType().getSimpleName(), m.getName());
}
```

---

### The Heap — Where Objects Live

The Heap is the largest memory area in the JVM and the one you interact with most directly. Every object you create with `new` and every array you declare lives here. The Heap is shared across all threads and is the primary target of the Garbage Collector.

```java
// Every one of these allocates memory on the Heap
Order order       = new Order("ORD-001");
int[] quantities  = new int[500];
String label      = new String("Priority");
List<Item> items  = new ArrayList<>();
```

The Heap is divided into **generations** — regions that group objects by age. This design is based on the **Generational Hypothesis**: most objects die young.

#### Young Generation — Where Objects Are Born

All new objects are allocated in the **Eden** space. When Eden fills up, a **Minor GC** runs. It scans Eden and the active Survivor space, copies all live objects to the other Survivor space, and discards everything else.

```
┌─────────────────────────────────────────────────────┐
│                   Young Generation                  │
│                                                     │
│  ┌──────────────────────┐  ┌──────────┐  ┌───────┐  │
│  │         Eden         │  │    S0    │  │  S1   │  │
│  │  (new objects born   │  │(Survivor │  │(Surv. │  │
│  │   here first)        │  │  From)   │  │  To)  │  │
│  └──────────────────────┘  └──────────┘  └───────┘  │
└─────────────────────────────────────────────────────┘
```

Each time an object survives a Minor GC, its **age counter** increments. Once an object reaches the tenuring threshold (default: 15), it is **promoted** to the Old Generation.

#### Old Generation — Where Long-Lived Objects Settle

Objects that survive enough Minor GC cycles are promoted here. The Old Generation is larger and collected far less frequently. When it fills up, a **Major GC** (or Full GC) runs — which is significantly slower and causes longer application pauses.

```java
// This object will be promoted to Old Gen quickly
// It is referenced by a static field and lives for the entire application lifetime
public class AppCache {
    private static final Map<String, Object> store = new ConcurrentHashMap<>();

    public static void put(String key, Object value) {
        store.put(key, value);
    }
}
```

**Tuning the Heap:**

```bash
# Initial and maximum heap size
java -Xms512m -Xmx4g MyApp

# Young Generation size
java -Xmn512m MyApp

# Ratio of Old to Young (default 2 means Old is twice the size of Young)
java -XX:NewRatio=2 MyApp

# Eden to Survivor ratio (default 8 means Eden is 8x the size of one Survivor)
java -XX:SurvivorRatio=8 MyApp

# Print detailed GC events
java -Xlog:gc* MyApp
```

**Checking heap usage from within your application:**

```java
public class HeapMonitor {
    public static void printHeapStats() {
        Runtime rt = Runtime.getRuntime();
        long used  = rt.totalMemory() - rt.freeMemory();
        long total = rt.totalMemory();
        long max   = rt.maxMemory();

        System.out.printf("Heap — Used: %d MB | Total: %d MB | Max: %d MB%n",
            used / 1_048_576, total / 1_048_576, max / 1_048_576);
    }
}
```

---

### JVM Stack — The Thread's Call History

Every thread has its own private JVM Stack, created the moment the thread starts. It stores **Stack Frames** — one frame is pushed for each method call and popped when the method returns.

```
Thread Stack (top = currently executing method):
┌──────────────────────────────┐
│  Frame: validatePayment()    │  ← executing now
├──────────────────────────────┤
│  Frame: processCheckout()    │
├──────────────────────────────┤
│  Frame: handleRequest()      │
├──────────────────────────────┤
│  Frame: main()               │  ← bottom of stack
└──────────────────────────────┘
```

Each Stack Frame contains three internal structures:

**Local Variable Array** — holds all method parameters and local variables, indexed from slot 0. For instance methods, slot 0 is always `this`.

```java
public double calculateDiscount(double price, int quantity) {
    // Local Variable Array layout:
    // [0] = this
    // [1] = price (double occupies 2 slots)
    // [3] = quantity
    // [4] = discount (declared below)
    double discount = price * quantity * 0.05;
    return discount;
}
```

**Operand Stack** — a LIFO stack used for all intermediate computations. The JVM is a stack-based machine: every arithmetic operation works by pushing operands and popping results.

```java
int result = 10 + 20;

// Bytecode trace:
// bipush 10   → operand stack: [10]
// bipush 20   → operand stack: [10, 20]
// iadd        → pop both, push 30 → [30]
// istore_1    → pop 30, store in local var slot 1 → []
```

**Frame Data** — holds the reference to the current class's runtime constant pool, the return address (where to jump after this method completes), and the exception handler table for any `try-catch` blocks in this method.

**What happens when the stack runs out:**

```java
public class RecursionDemo {
    // Each call pushes a new frame — eventually the stack is exhausted
    public static void recurse(int depth) {
        recurse(depth + 1);
    }

    public static void main(String[] args) {
        try {
            recurse(0);
        } catch (StackOverflowError e) {
            System.out.println("Stack exhausted. Depth reached: "
                + e.getStackTrace().length);
        }
    }
}
```

```bash
# Increase the per-thread stack size (default is 512KB on 64-bit JVMs)
java -Xss2m MyApp
```

---

### PC Register — The Thread's Bookmark

Each thread has its own Program Counter (PC) Register. It holds the memory address of the bytecode instruction the thread is **currently executing**. After each instruction completes, the PC advances to the next one.

For native methods, the PC is undefined — native code manages its own instruction pointer.

```
Thread executing main():
  PC = 0  →  getstatic   (load System.out)
  PC = 3  →  ldc         (load the string constant)
  PC = 5  →  invokevirtual (call println)
  PC = 8  →  return
```

The PC Register is what makes thread context switching possible. When the OS pauses a thread and resumes it later, the JVM reads the PC Register to know exactly which instruction to execute next.

---

### Native Method Stack

The Native Method Stack mirrors the JVM Stack but serves a different purpose: it tracks the call stack for **native methods** — code written in C or C++ and invoked through JNI.

When a Java thread calls a native method:
1. A JVM Stack Frame is created as usual
2. Execution transfers to native code
3. The Native Method Stack tracks the native call chain
4. When the native method returns, execution resumes in the JVM Stack

```java
public class SystemInfo {
    // Declared in Java — implemented in native C/C++
    public native long getFreeMemoryBytes();
    public native String getHostname();

    static {
        System.loadLibrary("systeminfo"); // loads systeminfo.dll or libsysteminfo.so
    }
}
```

---

## Section 4 — The Execution Engine

The Execution Engine is the component that actually runs your code. It reads bytecode instructions from Metaspace and executes them. It has three major components that work together: the Interpreter, the JIT Compiler, and the Garbage Collector.

---

### The Interpreter

The Interpreter is the simplest execution path. It reads each bytecode instruction one at a time, translates it into a native machine operation, executes it, and advances the PC Register to the next instruction.

```
Bytecode → Interpreter → Native machine op → Execute → Advance PC → Repeat
```

The Interpreter starts immediately — there is no warm-up time. This makes it ideal for code that runs only once or a few times. The downside is performance: the same bytecode is re-translated on every execution, even if the method is called thousands of times.

---

### The JIT Compiler — Making Hot Code Fast

The JIT (Just-In-Time) Compiler solves the Interpreter's performance problem. It monitors which methods are called frequently — called **hot methods** — and compiles their bytecode into native machine code. That native code is cached and reused for all future calls, eliminating the interpretation overhead entirely.

```
First N calls:      Bytecode → Interpreter (slow, but profiling)
After threshold:    Bytecode → JIT Compiler → Native code (cached)
All future calls:   Native machine code directly (fast)
```

**HotSpot's Tiered Compilation** (default since Java 7):

```
Level 0  →  Interpreter
Level 1  →  C1 Compiler: fast compilation, minimal optimization
Level 2  →  C1 Compiler: adds invocation and loop counters
Level 3  →  C1 Compiler: full profiling data collected
Level 4  →  C2 Compiler: aggressive optimization using profile data
```

The JVM starts methods at Level 0, collects profiling data, and progressively promotes hot methods to Level 4 — the most optimized native code.

```bash
# See every method the JIT compiles, with tier and size
java -XX:+PrintCompilation MyApp

# Sample output:
#  1234   42    3    java/lang/String::equals (20 bytes)
#  1235   43    4    com/myapp/OrderService::findById (85 bytes)
#  1236   44   n     java/lang/System::arraycopy (native)
```

**Key JIT Optimizations:**

**Method Inlining** — the most impactful optimization. Small methods have their body copied directly into the caller, eliminating the overhead of a method call entirely.

```java
// Before inlining:
public int square(int x) { return x * x; }
public int sumOfSquares(int a, int b) {
    return square(a) + square(b);
}

// After JIT inlining (conceptually):
public int sumOfSquares(int a, int b) {
    return (a * a) + (b * b); // square() body inlined — no method call overhead
}
```

**Loop Unrolling** — reduces branch and counter overhead for small, predictable loops.

```java
// Before:
for (int i = 0; i < 4; i++) total += values[i];

// After JIT unrolling:
total += values[0];
total += values[1];
total += values[2];
total += values[3];
// No loop counter, no branch check — pure sequential execution
```

**Escape Analysis** — if the JIT determines an object never leaves the method (never returned, never stored in a field), it can allocate it on the **stack** instead of the heap, completely bypassing the Garbage Collector.

```java
public int computeDistance(int x1, int y1, int x2, int y2) {
    Point delta = new Point(x2 - x1, y2 - y1); // never escapes this method
    return (int) Math.sqrt(delta.x * delta.x + delta.y * delta.y);
    // JIT may allocate delta on the stack — zero GC pressure
}
```

**Dead Code Elimination** — code that can never execute is removed entirely.

```java
public void process() {
    final boolean TRACE = false;
    if (TRACE) {
        System.out.println("trace output"); // JIT removes this block entirely
    }
    // actual logic
}
```

---

### The Garbage Collector — Automatic Memory Management

The Garbage Collector reclaims memory from objects that are no longer reachable by the running program. This is one of Java's defining features — no manual `free()` calls, no dangling pointers, no memory corruption.

#### How the GC Decides What Is Garbage

An object is **reachable** if it can be accessed by following a chain of references from a **GC Root**. GC Roots include:

- Local variables in active stack frames
- Static fields of loaded classes
- Active Java threads
- JNI references from native code

Any object that cannot be reached from any GC Root is **garbage** and eligible for collection.

```
GC Roots:
  main() local var  →  OrderService  →  OrderRepository  →  DataSource
  static field      →  AppConfig                                         (reachable)
                        OrphanedObject  (no reference chain from any root) (GARBAGE)
```

#### Minor GC — Collecting the Young Generation

Minor GC runs when Eden fills up. It is fast — typically a few milliseconds — because it only scans the Young Generation.

```
Before Minor GC:
  Eden:  [A, B, C, D, E]  ← full
  S0:    [X, Y]
  S1:    []

Minor GC runs:
  Live objects (A, C, X) → copied to S1, age incremented
  Dead objects (B, D, E, Y) → freed

After Minor GC:
  Eden:  []  ← empty, ready for new allocations
  S0:    []  ← cleared
  S1:    [A(age+1), C(age+1), X(age+1)]
```

Objects that survive enough Minor GC cycles (default threshold: 15) are promoted to the Old Generation.

#### Major GC / Full GC — Collecting the Old Generation

When the Old Generation fills up, a Major GC runs. It scans the entire heap and is significantly slower — it can pause the application for hundreds of milliseconds or more. This is why minimizing object promotion to Old Gen is a key performance goal.

#### Choosing a GC Algorithm

The JVM ships with several GC implementations, each with different trade-offs between throughput and latency.

| GC Algorithm | Best For | Pause Behavior |
|---|---|---|
| Serial GC | Single-core, small apps | Stop-the-world, long pauses |
| Parallel GC | Batch processing, throughput | Stop-the-world, parallel threads |
| G1 GC (default Java 9+) | General purpose | Predictable, configurable pauses |
| ZGC (Java 15+) | Low-latency services | Sub-millisecond pauses |
| Shenandoah | Low-latency services | Sub-millisecond pauses |

```bash
# Select a GC algorithm
java -XX:+UseG1GC MyApp
java -XX:+UseZGC MyApp
java -XX:+UseShenandoahGC MyApp

# Set a target max pause time for G1 (in milliseconds)
java -XX:+UseG1GC -XX:MaxGCPauseMillis=100 MyApp
```

#### Java Reference Types and GC Behavior

Java provides four reference strengths that give you fine-grained control over when objects are collected.

```java
// Strong Reference — default. Object is never collected while this reference exists.
Object data = new Object();

// Soft Reference — collected only when the JVM is low on memory. Good for caches.
SoftReference<byte[]> cache = new SoftReference<>(new byte[1024 * 1024]);
byte[] cached = cache.get(); // may return null if GC collected it

// Weak Reference — collected at the next GC cycle regardless of memory pressure.
WeakReference<Object> weak = new WeakReference<>(new Object());
Object obj = weak.get(); // likely null after next GC

// Phantom Reference — used for post-collection cleanup actions.
ReferenceQueue<Object> queue = new ReferenceQueue<>();
PhantomReference<Object> phantom = new PhantomReference<>(new Object(), queue);
```

#### Avoiding Memory Leaks

The most common memory leak in Java is a static collection that accumulates references and never releases them.

```java
// Memory leak — this list grows forever, objects can never be collected
public class EventBus {
    private static final List<EventListener> listeners = new ArrayList<>();

    public static void register(EventListener listener) {
        listeners.add(listener); // strong reference — GC can never collect these
    }
    // No deregister method — listeners accumulate until OutOfMemoryError
}

// Fix — use WeakReference so listeners can be collected when no longer used
public class EventBus {
    private static final List<WeakReference<EventListener>> listeners = new ArrayList<>();

    public static void register(EventListener listener) {
        listeners.add(new WeakReference<>(listener));
    }
}
```

---

## Section 5 — Java Native Interface and Native Method Library

### Java Native Interface (JNI)

JNI is the bridge between the JVM and native code written in C or C++. It allows Java programs to call platform-specific system APIs, reuse existing native libraries, or implement performance-critical routines in native code.

The JDK itself uses JNI extensively. Many of the methods you call every day are native under the hood:

```java
// These are all native methods in the JDK
public final class Object {
    public native int hashCode();
    protected native Object clone();
    public final native Class<?> getClass();
    public final native void notify();
    public final native void wait(long timeout);
}

public class System {
    public static native long currentTimeMillis();
    public static native long nanoTime();
    public static native void arraycopy(Object src, int srcPos,
                                        Object dest, int destPos, int length);
}
```

**Writing your own native method:**

```java
// Step 1: Declare the native method in Java
public class NativeUtils {
    public native String getOperatingSystem();
    public native long getAvailableMemoryBytes();

    static {
        System.loadLibrary("nativeutils"); // loads libnativeutils.so or nativeutils.dll
    }

    public static void main(String[] args) {
        NativeUtils utils = new NativeUtils();
        System.out.println("OS: " + utils.getOperatingSystem());
        System.out.println("Free memory: " + utils.getAvailableMemoryBytes() + " bytes");
    }
}
```

```bash
# Step 2: Generate the C header file
javac NativeUtils.java
javah -jni NativeUtils
# Produces: NativeUtils.h
```

```c
// Step 3: Implement in C (NativeUtils.c)
#include <jni.h>
#include "NativeUtils.h"

JNIEXPORT jstring JNICALL Java_NativeUtils_getOperatingSystem(JNIEnv *env, jobject obj) {
    #if defined(_WIN32)
        return (*env)->NewStringUTF(env, "Windows");
    #elif defined(__linux__)
        return (*env)->NewStringUTF(env, "Linux");
    #elif defined(__APPLE__)
        return (*env)->NewStringUTF(env, "macOS");
    #else
        return (*env)->NewStringUTF(env, "Unknown");
    #endif
}
```

```bash
# Step 4: Compile to a shared library
# Linux:
gcc -shared -fPIC -o libnativeutils.so NativeUtils.c \
    -I$JAVA_HOME/include -I$JAVA_HOME/include/linux

# Step 5: Run
java -Djava.library.path=. NativeUtils
```

### Native Method Library

The Native Method Library is the collection of compiled native libraries (`.dll` on Windows, `.so` on Linux, `.dylib` on macOS) that the JVM loads at runtime to execute native methods.

```java
// Load by name — JVM searches java.library.path
System.loadLibrary("ssl");

// Load by absolute path
System.load("/usr/lib/x86_64-linux-gnu/libssl.so.1.1");

// See where the JVM looks for native libraries
System.out.println(System.getProperty("java.library.path"));
```

---

## Section 6 — The Delegation Principle: A Complete Trace

Let's put everything together and trace a real class loading scenario from start to finish.

**Scenario:** Your application starts and calls `new OrderService()` for the first time.

```
Step 1 — JVM starts
  Bootstrap ClassLoader initializes
  Loads java.lang.Object (must be first — everything extends Object)
  Loads java.lang.Class, java.lang.String, and other core classes

Step 2 — AppClassLoader.loadClass("com.myapp.OrderService") is called

Step 3 — AppClassLoader checks its cache
  → Not found (first time loading this class)

Step 4 — AppClassLoader delegates to ExtClassLoader
  ExtClassLoader checks its cache → not found
  ExtClassLoader delegates to Bootstrap
    Bootstrap checks its cache → not found
    Bootstrap searches rt.jar / modules → not found (not a JDK class)
    Bootstrap throws ClassNotFoundException internally
  ExtClassLoader searches ext directories → not found
  ExtClassLoader throws ClassNotFoundException internally

Step 5 — AppClassLoader catches the exception
  AppClassLoader searches the classpath
  → FOUND: /app/build/classes/com/myapp/OrderService.class

Step 6 — Loading phase
  Raw bytes of OrderService.class are read
  Class object is created in Metaspace

Step 7 — Linking phase
  Verification: magic number ✓, bytecode valid ✓, types safe ✓
  Preparation: static fields set to default values
  Resolution: symbolic references resolved to direct memory pointers

Step 8 — Initialization phase
  Static fields assigned their declared values
  Static initializer blocks execute in source order

Step 9 — new OrderService() executes
  Object allocated in Eden (Heap)
  Constructor runs — Stack Frame pushed onto Thread Stack
  Constructor completes — Stack Frame popped
  Reference returned to caller
```

**Proving class loader isolation:**

Different class loaders create separate namespaces. The same class loaded by two different loaders are treated as two completely different types by the JVM — even if they have identical names and bytecode.

```java
CustomClassLoader loader1 = new CustomClassLoader("/app/classes");
CustomClassLoader loader2 = new CustomClassLoader("/app/classes");

Class<?> class1 = loader1.loadClass("com.myapp.Service");
Class<?> class2 = loader2.loadClass("com.myapp.Service");

System.out.println(class1 == class2);           // false — different Class objects
System.out.println(class1.getName());           // com.myapp.Service
System.out.println(class2.getName());           // com.myapp.Service (same name)

// Attempting to cast between them throws ClassCastException
Object instance1 = class1.getDeclaredConstructor().newInstance();
class2.cast(instance1); // ClassCastException — different namespaces
```

This is exactly how Tomcat isolates web applications. Each deployed webapp gets its own ClassLoader, so `com.myapp.UserService` in webapp-A is completely separate from `com.myapp.UserService` in webapp-B — they can even run different versions of the same class simultaneously.

---

## Section 7 — JVM Startup: The Complete Sequence

Here is the full sequence from the moment you type `java MyApp` to the moment your first line of code executes.

```
1.  OS loads the JVM shared library (libjvm.so / jvm.dll)

2.  JVM initializes internal structures:
    - Allocates heap memory (Xms to Xmx range)
    - Creates Metaspace
    - Starts GC background threads
    - Starts JIT compiler threads

3.  Bootstrap ClassLoader initializes:
    - Loads java.lang.Object first (root of all class hierarchies)
    - Loads java.lang.Class, java.lang.String, java.lang.Thread
    - Loads remaining core JDK classes

4.  Extension ClassLoader created (parent = Bootstrap)
5.  Application ClassLoader created (parent = Extension)

6.  Main class loaded via delegation chain:
    AppClassLoader → ExtClassLoader → Bootstrap → back to AppClassLoader
    MyApp.class found on classpath → loaded, linked, initialized

7.  Main thread created:
    - JVM Stack allocated for this thread
    - PC Register initialized to 0

8.  main() method invoked:
    - Stack Frame pushed for main()
    - Local Variable Array initialized (args = command-line arguments)
    - Execution begins at PC = 0

9.  Your application runs...

10. main() returns:
    - Stack Frame popped
    - JVM checks for remaining non-daemon threads
    - If none remain, shutdown sequence begins

11. Shutdown hooks execute (registered via Runtime.addShutdownHook())

12. JVM process exits
```

**Registering a shutdown hook:**

```java
public class Application {
    public static void main(String[] args) throws Exception {
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("[Shutdown] Closing database connections...");
            System.out.println("[Shutdown] Flushing pending writes...");
            System.out.println("[Shutdown] Goodbye.");
        }, "shutdown-hook"));

        System.out.println("Application started.");
        Thread.sleep(3000);
        System.out.println("Main thread finished.");
        // JVM exits → shutdown hook runs automatically
    }
}
```

---

## Section 8 — Diagnosing JVM Problems

Understanding the JVM is most valuable when something goes wrong. Here are the most common JVM errors and how to diagnose them.

### OutOfMemoryError: Java Heap Space

The heap is full. Either too many live objects exist, or there is a memory leak preventing objects from being collected.

```bash
# Enable automatic heap dump when OOM occurs
java -XX:+HeapDumpOnOutOfMemoryError \
     -XX:HeapDumpPath=/var/log/heapdump.hprof \
     MyApp

# Analyze the dump with Eclipse Memory Analyzer (MAT) or VisualVM
# Look for: largest retained objects, reference chains, leak suspects
```

### OutOfMemoryError: Metaspace

Too many classes are loaded. Common with frameworks that generate classes dynamically — Hibernate, Spring AOP, CGLib, Groovy.

```bash
# Set a Metaspace ceiling to catch runaway class generation early
java -XX:MaxMetaspaceSize=256m MyApp
```

### StackOverflowError

The thread stack is exhausted — typically caused by infinite recursion or an unexpectedly deep call chain.

```bash
# Increase per-thread stack size
java -Xss4m MyApp
```

### GC Overhead Limit Exceeded

The JVM is spending more than 98% of its time doing garbage collection but recovering less than 2% of the heap. This almost always indicates a memory leak.

```bash
# Increase heap size to buy time while you investigate
java -Xmx8g MyApp

# The real fix: find and eliminate the memory leak using a heap dump
```

### Built-in JVM Diagnostic Tools

```bash
# List all running JVM processes
jps -l

# Real-time GC statistics (refresh every 1 second)
jstat -gcutil <pid> 1000

# Heap summary and object histogram
jmap -heap <pid>
jmap -histo <pid>

# Generate a heap dump manually
jmap -dump:format=b,file=heap.hprof <pid>

# Thread dump — shows all thread states and stack traces
jstack <pid>

# All-in-one diagnostic tool
jcmd <pid> VM.flags          # all active JVM flags
jcmd <pid> GC.run            # trigger a GC cycle
jcmd <pid> Thread.print      # thread dump
jcmd <pid> VM.native_memory  # native memory breakdown
```

---

## Section 9 — Essential JVM Flags Reference

```bash
# ── Heap Memory ─────────────────────────────────────────────────
-Xms512m                      # Initial heap size
-Xmx4g                        # Maximum heap size
-Xmn256m                      # Young Generation size
-XX:NewRatio=2                 # Old:Young ratio (2 = Old is 2x Young)
-XX:SurvivorRatio=8            # Eden:Survivor ratio

# ── Thread Stack ────────────────────────────────────────────────
-Xss512k                       # Per-thread stack size

# ── Metaspace ───────────────────────────────────────────────────
-XX:MetaspaceSize=128m         # Initial Metaspace size
-XX:MaxMetaspaceSize=256m      # Maximum Metaspace size

# ── GC Selection ────────────────────────────────────────────────
-XX:+UseSerialGC               # Serial (single-threaded)
-XX:+UseParallelGC             # Parallel (throughput-focused)
-XX:+UseG1GC                   # G1 (default Java 9+, balanced)
-XX:+UseZGC                    # ZGC (sub-ms pauses, Java 15+)
-XX:+UseShenandoahGC           # Shenandoah (sub-ms pauses)

# ── GC Tuning ───────────────────────────────────────────────────
-XX:MaxGCPauseMillis=200       # Target max pause time (G1)
-XX:MaxTenuringThreshold=15    # GC cycles before promotion to Old Gen

# ── GC Logging ──────────────────────────────────────────────────
-Xlog:gc*                      # Unified GC logging (Java 9+)
-XX:+PrintGCDetails            # Detailed GC output (Java 8)

# ── JIT Compiler ────────────────────────────────────────────────
-XX:+TieredCompilation         # Enable tiered compilation (default on)
-XX:CompileThreshold=10000     # Invocations before JIT compiles a method
-XX:+PrintCompilation          # Log every JIT compilation event

# ── Diagnostics ─────────────────────────────────────────────────
-XX:+HeapDumpOnOutOfMemoryError  # Auto heap dump on OOM
-XX:HeapDumpPath=/tmp/dump.hprof # Heap dump file location
-verbose:class                   # Log every class loading event
-XX:+PrintFlagsFinal             # Print all JVM flags and their values
```

---

## Summary

The JVM is a layered system where each component has a precise, well-defined role. Here is the complete picture in one table.

| Component | What It Does |
|---|---|
| Bootstrap ClassLoader | Loads JDK core classes — `java.lang.*`, `java.util.*`, etc. |
| Extension ClassLoader | Loads JDK extension classes — security, crypto, XML |
| Application ClassLoader | Loads your application classes and third-party JARs |
| Delegation Principle | Always ask the parent first — prevents class spoofing and ensures JDK integrity |
| Loading | Reads `.class` bytes and creates a `Class` object in Metaspace |
| Verification | Validates bytecode structure and type safety before execution |
| Preparation | Allocates memory for static fields and sets type default values |
| Resolution | Replaces symbolic references with direct memory pointers |
| Initialization | Runs static blocks and assigns actual values to static fields |
| Metaspace | Stores class metadata, method bytecode, static variables, constant pool |
| Heap — Young Gen | Where new objects are born; collected frequently by Minor GC |
| Heap — Old Gen | Where long-lived objects live; collected by Major GC |
| JVM Stack | Per-thread call stack — one Stack Frame per active method |
| Stack Frame | Holds local variables, operand stack, and frame data for one method call |
| PC Register | Per-thread instruction pointer — tracks the current bytecode instruction |
| Native Method Stack | Call stack for native C/C++ methods invoked via JNI |
| Interpreter | Executes bytecode one instruction at a time — fast startup, slower execution |
| JIT Compiler | Compiles hot bytecode to native machine code — fast steady-state execution |
| Garbage Collector | Automatically reclaims memory from unreachable objects |
| JNI | Bridge between Java and native C/C++ code |
| Native Method Library | Platform-specific `.dll` / `.so` files containing native implementations |

---

The JVM is not magic — it is engineering. Every `OutOfMemoryError`, every slow GC pause, every mysterious `ClassNotFoundException` has a precise explanation rooted in the architecture described here. The developers who understand this are the ones who can diagnose production issues quickly, tune their applications confidently, and write code that works *with* the JVM rather than against it.
