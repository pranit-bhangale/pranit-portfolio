# Clean Architecture, SOLID Principles & Design Patterns: A Complete Developer Guide

Software that works today but becomes a nightmare to change tomorrow is not good software. Clean Architecture, SOLID principles, and Design Patterns are the three pillars that help you build systems that are maintainable, testable, and scalable.

This blog walks through each concept in depth with real Java code examples so you can see exactly how they work together.

---

## Part 1: SOLID Principles

SOLID is an acronym for five design principles by Robert C. Martin (Uncle Bob). They guide you toward writing code that is easy to extend, modify, and test.

---

### S — Single Responsibility Principle (SRP)

> A class should have only one reason to change.

Every class should do exactly one thing. If a class handles both business logic and database operations, it has two reasons to change.

**Bad — violates SRP:**

```java
public class UserService {
    public void registerUser(String email, String password) {
        // Validation
        if (!email.contains("@")) throw new IllegalArgumentException("Invalid email");

        // Database — should NOT be here
        String sql = "INSERT INTO users (email, password) VALUES (?, ?)";
        // ... execute SQL

        // Email — should NOT be here
        System.out.println("Sending welcome email to " + email);
    }
}
```

This class does three things: validation, persistence, and notification. Any change to the email system forces you to touch `UserService`.

**Good — follows SRP:**

```java
public class UserValidator {
    public void validate(String email, String password) {
        if (!email.contains("@")) throw new IllegalArgumentException("Invalid email");
        if (password.length() < 8) throw new IllegalArgumentException("Password too short");
    }
}

public class UserRepository {
    public void save(User user) {
        System.out.println("User saved: " + user.getEmail());
    }
}

public class EmailService {
    public void sendWelcomeEmail(String email) {
        System.out.println("Welcome email sent to: " + email);
    }
}

public class UserService {
    private final UserValidator validator;
    private final UserRepository repository;
    private final EmailService emailService;

    public UserService(UserValidator validator, UserRepository repository, EmailService emailService) {
        this.validator = validator;
        this.repository = repository;
        this.emailService = emailService;
    }

    public void registerUser(String email, String password) {
        validator.validate(email, password);
        User user = new User(email, password);
        repository.save(user);
        emailService.sendWelcomeEmail(email);
    }
}
```

Now each class has one reason to change. Swapping the email provider doesn't touch `UserRepository`.

---

### O — Open/Closed Principle (OCP)

> Software entities should be open for extension but closed for modification.

**Bad — violates OCP:**

```java
public class DiscountCalculator {
    public double calculate(String customerType, double price) {
        if (customerType.equals("REGULAR")) return price * 0.95;
        else if (customerType.equals("PREMIUM")) return price * 0.85;
        else if (customerType.equals("VIP")) return price * 0.70;
        return price;
    }
}
```

Every new customer type forces you to modify this class — risky and fragile.

**Good — follows OCP:**

```java
public interface DiscountStrategy {
    double apply(double price);
}

public class RegularDiscount implements DiscountStrategy {
    @Override public double apply(double price) { return price * 0.95; }
}

public class PremiumDiscount implements DiscountStrategy {
    @Override public double apply(double price) { return price * 0.85; }
}

public class VIPDiscount implements DiscountStrategy {
    @Override public double apply(double price) { return price * 0.70; }
}

public class DiscountCalculator {
    private final DiscountStrategy strategy;

    public DiscountCalculator(DiscountStrategy strategy) {
        this.strategy = strategy;
    }

    public double calculate(double price) {
        return strategy.apply(price);
    }
}

// Usage
DiscountCalculator calc = new DiscountCalculator(new VIPDiscount());
System.out.println(calc.calculate(1000)); // 700.0
```

Adding a new `StudentDiscount` requires zero changes to `DiscountCalculator`.

---

### L — Liskov Substitution Principle (LSP)

> Subtypes must be substitutable for their base types without altering correctness.

**Bad — violates LSP:**

```java
public class Rectangle {
    protected int width, height;
    public void setWidth(int w) { this.width = w; }
    public void setHeight(int h) { this.height = h; }
    public int area() { return width * height; }
}

public class Square extends Rectangle {
    @Override
    public void setWidth(int w) { this.width = w; this.height = w; }
    @Override
    public void setHeight(int h) { this.width = h; this.height = h; }
}

// Breaks when Square is used as Rectangle
static void printArea(Rectangle r) {
    r.setWidth(5);
    r.setHeight(3);
    System.out.println(r.area()); // Rectangle: 15 ✓  Square: 9 ✗
}
```

**Good — follows LSP:**

```java
public interface Shape {
    int area();
}

public class Rectangle implements Shape {
    private final int width, height;
    public Rectangle(int width, int height) { this.width = width; this.height = height; }
    @Override public int area() { return width * height; }
}

public class Square implements Shape {
    private final int side;
    public Square(int side) { this.side = side; }
    @Override public int area() { return side * side; }
}

// Both safely substitutable as Shape
static void printArea(Shape shape) {
    System.out.println("Area: " + shape.area());
}

printArea(new Rectangle(5, 3)); // Area: 15
printArea(new Square(4));       // Area: 16
```

---

### I — Interface Segregation Principle (ISP)

> Clients should not be forced to depend on interfaces they do not use.

**Bad — violates ISP:**

```java
public interface Worker {
    void work();
    void eat();
    void sleep();
}

// Robot is forced to implement eat() and sleep() — meaningless
public class Robot implements Worker {
    @Override public void work() { System.out.println("Robot working..."); }
    @Override public void eat() { /* empty — robot doesn't eat */ }
    @Override public void sleep() { /* empty — robot doesn't sleep */ }
}
```

**Good — follows ISP:**

```java
public interface Workable  { void work(); }
public interface Eatable   { void eat(); }
public interface Sleepable { void sleep(); }

public class Human implements Workable, Eatable, Sleepable {
    @Override public void work()  { System.out.println("Human working..."); }
    @Override public void eat()   { System.out.println("Human eating..."); }
    @Override public void sleep() { System.out.println("Human sleeping..."); }
}

public class Robot implements Workable {
    @Override public void work() { System.out.println("Robot working..."); }
}
```

---

### D — Dependency Inversion Principle (DIP)

> High-level modules should not depend on low-level modules. Both should depend on abstractions.

**Bad — violates DIP:**

```java
public class UserService {
    // Directly depends on a concrete class — tightly coupled
    private MySQLUserRepository repository = new MySQLUserRepository();

    public void register(User user) {
        repository.save(user);
    }
}
```

Switching to PostgreSQL means rewriting `UserService`.

**Good — follows DIP:**

```java
public interface UserRepository {
    void save(User user);
}

public class MySQLUserRepository implements UserRepository {
    @Override public void save(User user) {
        System.out.println("Saving to MySQL: " + user.getEmail());
    }
}

public class PostgreSQLUserRepository implements UserRepository {
    @Override public void save(User user) {
        System.out.println("Saving to PostgreSQL: " + user.getEmail());
    }
}

// High-level class depends on abstraction — not implementation
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public void register(User user) {
        repository.save(user);
    }
}

// Swap implementations without touching UserService
UserRepository repo = new PostgreSQLUserRepository();
UserService service = new UserService(repo);
service.register(new User("user@example.com", "pass123"));
```

---

## Part 2: Design Patterns

Design patterns are proven, reusable solutions to common software design problems. They fall into three categories: Creational, Structural, and Behavioral.

---

### Creational Patterns

#### Singleton Pattern

Ensures only one instance of a class exists throughout the application lifecycle.

```java
public class DatabaseConnection {
    private static DatabaseConnection instance;
    private final String connectionUrl;

    private DatabaseConnection() {
        this.connectionUrl = "jdbc:mysql://localhost:3306/mydb";
        System.out.println("Connection established.");
    }

    public static synchronized DatabaseConnection getInstance() {
        if (instance == null) {
            instance = new DatabaseConnection();
        }
        return instance;
    }

    public String getConnectionUrl() { return connectionUrl; }
}

// Usage
DatabaseConnection db1 = DatabaseConnection.getInstance();
DatabaseConnection db2 = DatabaseConnection.getInstance();
System.out.println(db1 == db2); // true — same instance
```

---

#### Builder Pattern

Constructs complex objects step by step, avoiding telescoping constructors.

```java
public class User {
    private final String firstName;
    private final String lastName;
    private final String email;
    private final int age;

    private User(Builder builder) {
        this.firstName = builder.firstName;
        this.lastName  = builder.lastName;
        this.email     = builder.email;
        this.age       = builder.age;
    }

    @Override
    public String toString() {
        return firstName + " " + lastName + " | " + email + " | Age: " + age;
    }

    public static class Builder {
        private String firstName, lastName, email;
        private int age;

        public Builder firstName(String v) { this.firstName = v; return this; }
        public Builder lastName(String v)  { this.lastName  = v; return this; }
        public Builder email(String v)     { this.email     = v; return this; }
        public Builder age(int v)          { this.age       = v; return this; }
        public User build()                { return new User(this); }
    }
}

// Usage — clean, readable, no constructor hell
User user = new User.Builder()
    .firstName("Pranit")
    .lastName("Bhangale")
    .email("pranit@example.com")
    .age(25)
    .build();

System.out.println(user);
// Pranit Bhangale | pranit@example.com | Age: 25
```

---

#### Factory Pattern

Delegates object creation to a factory, hiding instantiation logic from the caller.

```java
public interface Notification {
    void send(String message);
}

public class EmailNotification implements Notification {
    @Override public void send(String msg) { System.out.println("Email: " + msg); }
}

public class SMSNotification implements Notification {
    @Override public void send(String msg) { System.out.println("SMS: " + msg); }
}

public class PushNotification implements Notification {
    @Override public void send(String msg) { System.out.println("Push: " + msg); }
}

public class NotificationFactory {
    public static Notification create(String type) {
        return switch (type.toUpperCase()) {
            case "EMAIL" -> new EmailNotification();
            case "SMS"   -> new SMSNotification();
            case "PUSH"  -> new PushNotification();
            default -> throw new IllegalArgumentException("Unknown type: " + type);
        };
    }
}

// Usage
Notification n = NotificationFactory.create("EMAIL");
n.send("Your order has been placed!");
// Email: Your order has been placed!
```

---

### Structural Patterns

#### Adapter Pattern

Converts an incompatible interface into one that a client expects — like a power plug adapter.

```java
// Existing legacy system
public class LegacyPaymentSystem {
    public void makePayment(int amountInPaise) {
        System.out.println("Legacy payment of " + amountInPaise + " paise processed.");
    }
}

// Modern interface your app expects
public interface PaymentGateway {
    void pay(double amountInRupees);
}

// Adapter bridges the gap
public class PaymentAdapter implements PaymentGateway {
    private final LegacyPaymentSystem legacy;

    public PaymentAdapter(LegacyPaymentSystem legacy) {
        this.legacy = legacy;
    }

    @Override
    public void pay(double amountInRupees) {
        int paise = (int)(amountInRupees * 100);
        legacy.makePayment(paise);
    }
}

// Usage
PaymentGateway gateway = new PaymentAdapter(new LegacyPaymentSystem());
gateway.pay(499.99);
// Legacy payment of 49999 paise processed.
```

---

#### Decorator Pattern

Adds behavior to objects dynamically without modifying their class.

```java
public interface Coffee {
    String getDescription();
    double getCost();
}

public class SimpleCoffee implements Coffee {
    @Override public String getDescription() { return "Simple Coffee"; }
    @Override public double getCost() { return 50.0; }
}

public abstract class CoffeeDecorator implements Coffee {
    protected final Coffee coffee;
    public CoffeeDecorator(Coffee coffee) { this.coffee = coffee; }
}

public class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) { super(coffee); }
    @Override public String getDescription() { return coffee.getDescription() + ", Milk"; }
    @Override public double getCost() { return coffee.getCost() + 15.0; }
}

public class SugarDecorator extends CoffeeDecorator {
    public SugarDecorator(Coffee coffee) { super(coffee); }
    @Override public String getDescription() { return coffee.getDescription() + ", Sugar"; }
    @Override public double getCost() { return coffee.getCost() + 5.0; }
}

// Usage — wrap dynamically
Coffee coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);

System.out.println(coffee.getDescription()); // Simple Coffee, Milk, Sugar
System.out.println("Cost: ₹" + coffee.getCost()); // Cost: ₹70.0
```

---

### Behavioral Patterns

#### Observer Pattern

Defines a one-to-many dependency — when one object changes state, all dependents are notified automatically.

```java
import java.util.ArrayList;
import java.util.List;

public interface OrderObserver {
    void onOrderPlaced(String orderId);
}

public class OrderService {
    private final List<OrderObserver> observers = new ArrayList<>();

    public void addObserver(OrderObserver observer) { observers.add(observer); }

    public void placeOrder(String orderId) {
        System.out.println("Order placed: " + orderId);
        observers.forEach(o -> o.onOrderPlaced(orderId));
    }
}

public class EmailNotifier implements OrderObserver {
    @Override public void onOrderPlaced(String orderId) {
        System.out.println("Email sent for order: " + orderId);
    }
}

public class InventoryUpdater implements OrderObserver {
    @Override public void onOrderPlaced(String orderId) {
        System.out.println("Inventory updated for order: " + orderId);
    }
}

// Usage
OrderService service = new OrderService();
service.addObserver(new EmailNotifier());
service.addObserver(new InventoryUpdater());
service.placeOrder("ORD-1001");
// Order placed: ORD-1001
// Email sent for order: ORD-1001
// Inventory updated for order: ORD-1001
```

---

#### Strategy Pattern

Defines a family of algorithms, encapsulates each one, and makes them interchangeable at runtime.

```java
public interface SortStrategy {
    void sort(int[] data);
}

public class BubbleSort implements SortStrategy {
    @Override
    public void sort(int[] data) {
        System.out.println("Sorting with Bubble Sort...");
        // bubble sort logic
    }
}

public class QuickSort implements SortStrategy {
    @Override
    public void sort(int[] data) {
        System.out.println("Sorting with Quick Sort...");
        // quicksort logic
    }
}

public class Sorter {
    private SortStrategy strategy;

    public void setStrategy(SortStrategy strategy) {
        this.strategy = strategy;
    }

    public void sort(int[] data) {
        strategy.sort(data);
    }
}

// Usage — swap strategy at runtime
Sorter sorter = new Sorter();
int[] data = {5, 2, 8, 1, 9};

sorter.setStrategy(new BubbleSort());
sorter.sort(data); // Sorting with Bubble Sort...

sorter.setStrategy(new QuickSort());
sorter.sort(data); // Sorting with Quick Sort...
```

---

## Part 3: Clean Architecture

Clean Architecture, introduced by Robert C. Martin, organizes your codebase into concentric layers where **dependencies always point inward** — toward the business logic, never outward toward frameworks or databases.

```
┌─────────────────────────────────────┐
│         Frameworks & Drivers        │  ← Spring Boot, DB drivers, REST
│  ┌───────────────────────────────┐  │
│  │     Interface Adapters        │  │  ← Controllers, Presenters, Mappers
│  │  ┌─────────────────────────┐  │  │
│  │  │    Application Layer    │  │  │  ← Use Cases / Interactors
│  │  │  ┌───────────────────┐  │  │  │
│  │  │  │   Domain Layer    │  │  │  │  ← Entities, Business Rules
│  │  │  └───────────────────┘  │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

The core rule: **inner layers know nothing about outer layers.**

---

### Layer 1: Domain (Entities)

Pure business objects. No framework annotations, no database logic.

```java
public class Order {
    private final String orderId;
    private final List<OrderItem> items;
    private OrderStatus status;

    public Order(String orderId, List<OrderItem> items) {
        this.orderId = orderId;
        this.items = items;
        this.status = OrderStatus.PENDING;
    }

    // Business rule lives here — not in a service
    public double calculateTotal() {
        return items.stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();
    }

    public void confirm() {
        if (items.isEmpty()) throw new IllegalStateException("Cannot confirm empty order");
        this.status = OrderStatus.CONFIRMED;
    }

    public String getOrderId() { return orderId; }
    public OrderStatus getStatus() { return status; }
}
```

---

### Layer 2: Application (Use Cases)

Orchestrates business logic. Depends only on domain entities and repository interfaces.

```java
// Repository interface — defined in application layer, implemented in infrastructure
public interface OrderRepository {
    void save(Order order);
    Optional<Order> findById(String orderId);
}

// Use case — pure business workflow
public class PlaceOrderUseCase {
    private final OrderRepository orderRepository;
    private final OrderObserver observer; // notification abstraction

    public PlaceOrderUseCase(OrderRepository orderRepository, OrderObserver observer) {
        this.orderRepository = orderRepository;
        this.observer = observer;
    }

    public String execute(List<OrderItem> items) {
        String orderId = UUID.randomUUID().toString();
        Order order = new Order(orderId, items);
        order.confirm();
        orderRepository.save(order);
        observer.onOrderPlaced(orderId);
        return orderId;
    }
}
```

---

### Layer 3: Interface Adapters (Controllers & Repositories)

Converts data between the outside world and the application layer.

```java
// REST Controller — depends on use case, not on domain directly
@RestController
@RequestMapping("/orders")
public class OrderController {
    private final PlaceOrderUseCase placeOrderUseCase;

    public OrderController(PlaceOrderUseCase placeOrderUseCase) {
        this.placeOrderUseCase = placeOrderUseCase;
    }

    @PostMapping
    public ResponseEntity<String> placeOrder(@RequestBody PlaceOrderRequest request) {
        String orderId = placeOrderUseCase.execute(request.getItems());
        return ResponseEntity.ok(orderId);
    }
}

// Repository implementation — depends on JPA, lives in infrastructure
@Repository
public class JpaOrderRepository implements OrderRepository {
    private final OrderJpaRepository jpa;

    public JpaOrderRepository(OrderJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public void save(Order order) {
        OrderEntity entity = OrderMapper.toEntity(order);
        jpa.save(entity);
    }

    @Override
    public Optional<Order> findById(String orderId) {
        return jpa.findById(orderId).map(OrderMapper::toDomain);
    }
}
```

---

### Project Structure

```
com.myapp
  ├── domain
  │     ├── entity
  │     │     ├── Order.java
  │     │     └── OrderItem.java
  │     └── enums
  │           └── OrderStatus.java
  ├── application
  │     ├── usecase
  │     │     └── PlaceOrderUseCase.java
  │     └── port
  │           └── OrderRepository.java   ← interface
  ├── infrastructure
  │     ├── persistence
  │     │     ├── JpaOrderRepository.java ← implementation
  │     │     └── OrderEntity.java
  │     └── notification
  │           └── EmailOrderObserver.java
  └── presentation
        └── controller
              └── OrderController.java
```

---

## Part 4: Putting It All Together

Here's how SOLID, Design Patterns, and Clean Architecture reinforce each other:

| Principle / Pattern | Role in Clean Architecture |
|---|---|
| SRP | Each layer has one responsibility — domain, application, infrastructure |
| OCP | Use cases are open for extension via new implementations |
| LSP | Repository implementations are safely substitutable |
| ISP | Focused interfaces per use case — no fat service interfaces |
| DIP | Use cases depend on repository interfaces, not concrete classes |
| Factory Pattern | Creates infrastructure implementations without exposing details |
| Observer Pattern | Decouples order placement from notification side effects |
| Strategy Pattern | Swappable algorithms (sorting, pricing, discounts) |
| Builder Pattern | Constructs complex domain objects cleanly |
| Adapter Pattern | Integrates legacy systems without polluting domain code |

---

## Common Mistakes to Avoid

**1. Putting JPA annotations inside domain entities**

```java
// Wrong — domain entity knows about persistence
@Entity
@Table(name = "orders")
public class Order { ... }

// Right — keep a separate OrderEntity in infrastructure
public class Order { ... }           // domain — clean
public class OrderEntity { ... }     // infrastructure — has @Entity
```

**2. Letting use cases depend on Spring components**

```java
// Wrong
@Service
public class PlaceOrderUseCase {
    @Autowired
    private JpaOrderRepository repository; // depends on concrete JPA class
}

// Right — inject the interface
public class PlaceOrderUseCase {
    private final OrderRepository repository; // depends on abstraction
}
```

**3. Mixing controller logic with business logic**

```java
// Wrong — business rule inside controller
@PostMapping
public ResponseEntity<?> placeOrder(@RequestBody PlaceOrderRequest req) {
    if (req.getItems().isEmpty()) return ResponseEntity.badRequest().build();
    // ... more business logic
}

// Right — controller only delegates
@PostMapping
public ResponseEntity<String> placeOrder(@RequestBody PlaceOrderRequest req) {
    String orderId = placeOrderUseCase.execute(req.getItems());
    return ResponseEntity.ok(orderId);
}
```

