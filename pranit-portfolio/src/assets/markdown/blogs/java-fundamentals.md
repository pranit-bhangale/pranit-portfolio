# Java Fundamentals: A Complete Guide for Beginners to Intermediate Developers

Java has been one of the most popular programming languages for over two decades. It powers everything from Android apps to large-scale enterprise backends. This blog walks through the core fundamentals of Java — one concept at a time — with clear explanations and working code examples.

---

## 1. Hello World — Your First Java Program

Every Java journey starts here. A Java program must have a class with a `main` method as the entry point.

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

**Key points:**
- `public class HelloWorld` — class name must match the filename (`HelloWorld.java`)
- `public static void main(String[] args)` — JVM calls this method to start execution
- `System.out.println()` — prints output to the console with a newline

---

## 2. Data Types and Variables

Java is a **statically typed** language, meaning every variable must have a declared type.

### Primitive Data Types

```java
public class DataTypes {
    public static void main(String[] args) {
        byte age = 25;           // 8-bit integer (-128 to 127)
        short year = 2024;       // 16-bit integer
        int salary = 75000;      // 32-bit integer (most common)
        long population = 8000000000L; // 64-bit integer (note the 'L')

        float pi = 3.14f;        // 32-bit decimal (note the 'f')
        double precise = 3.14159265358979; // 64-bit decimal (default for decimals)

        char grade = 'A';        // single character (16-bit Unicode)
        boolean isJavaFun = true; // true or false

        System.out.println("Salary: " + salary);
        System.out.println("Pi: " + precise);
        System.out.println("Grade: " + grade);
    }
}
```

### Reference Types

```java
String name = "Pranit";          // String is a reference type (object)
int[] scores = {90, 85, 92};     // Array is also a reference type
```

> **Tip:** Use `int` for whole numbers and `double` for decimals unless you have a specific reason to use others.

---

## 3. Operators

Java supports all standard operators. Here are the most important ones:

```java
public class Operators {
    public static void main(String[] args) {
        int a = 10, b = 3;

        // Arithmetic
        System.out.println(a + b);   // 13
        System.out.println(a - b);   // 7
        System.out.println(a * b);   // 30
        System.out.println(a / b);   // 3 (integer division, truncates decimal)
        System.out.println(a % b);   // 1 (modulus / remainder)

        // Comparison
        System.out.println(a > b);   // true
        System.out.println(a == b);  // false
        System.out.println(a != b);  // true

        // Logical
        boolean x = true, y = false;
        System.out.println(x && y);  // false (AND)
        System.out.println(x || y);  // true  (OR)
        System.out.println(!x);      // false (NOT)

        // Ternary
        String result = (a > b) ? "a is greater" : "b is greater";
        System.out.println(result);  // a is greater
    }
}
```

---

## 4. Control Flow — if / else / switch

### if-else

```java
public class ControlFlow {
    public static void main(String[] args) {
        int marks = 75;

        if (marks >= 90) {
            System.out.println("Grade: A");
        } else if (marks >= 75) {
            System.out.println("Grade: B");
        } else if (marks >= 60) {
            System.out.println("Grade: C");
        } else {
            System.out.println("Grade: F");
        }
        // Output: Grade: B
    }
}
```

### switch

```java
public class SwitchExample {
    public static void main(String[] args) {
        int day = 3;

        switch (day) {
            case 1: System.out.println("Monday"); break;
            case 2: System.out.println("Tuesday"); break;
            case 3: System.out.println("Wednesday"); break;
            default: System.out.println("Other day");
        }
        // Output: Wednesday
    }
}
```

> Java 14+ introduced **switch expressions** with arrow syntax (`->`), making it cleaner and less error-prone.

---

## 5. Loops

### for loop

```java
public class Loops {
    public static void main(String[] args) {
        // Print 1 to 5
        for (int i = 1; i <= 5; i++) {
            System.out.print(i + " ");
        }
        // Output: 1 2 3 4 5
    }
}
```

### while loop

```java
int count = 0;
while (count < 3) {
    System.out.println("Count: " + count);
    count++;
}
// Output: Count: 0, Count: 1, Count: 2
```

### for-each loop (enhanced for)

```java
int[] numbers = {10, 20, 30, 40};
for (int num : numbers) {
    System.out.println(num);
}
// Output: 10 20 30 40
```

---

## 6. Methods (Functions)

Methods allow you to group reusable logic. Java methods are always defined inside a class.

```java
public class Calculator {

    // Method with parameters and return type
    public static int add(int a, int b) {
        return a + b;
    }

    // Method overloading — same name, different parameters
    public static double add(double a, double b) {
        return a + b;
    }

    // void method — no return value
    public static void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }

    public static void main(String[] args) {
        System.out.println(add(5, 3));        // 8
        System.out.println(add(2.5, 1.5));    // 4.0
        greet("Pranit");                       // Hello, Pranit!
    }
}
```

---

## 7. Arrays

Arrays store multiple values of the same type in a fixed-size container.

```java
public class ArrayExample {
    public static void main(String[] args) {
        // Declaration and initialization
        int[] scores = new int[5];
        scores[0] = 90;
        scores[1] = 85;

        // Shorthand initialization
        String[] fruits = {"Apple", "Banana", "Mango"};

        // Iterating
        for (int i = 0; i < fruits.length; i++) {
            System.out.println(fruits[i]);
        }

        // 2D Array
        int[][] matrix = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };

        System.out.println(matrix[1][2]); // 6
    }
}
```

---

## 8. Object-Oriented Programming (OOP)

OOP is the heart of Java. Everything in Java revolves around classes and objects.

### 8.1 Classes and Objects

A **class** is a blueprint. An **object** is an instance of that blueprint.

```java
public class Car {
    // Fields (attributes)
    String brand;
    int speed;

    // Constructor
    public Car(String brand, int speed) {
        this.brand = brand;
        this.speed = speed;
    }

    // Method (behavior)
    public void accelerate(int amount) {
        speed += amount;
        System.out.println(brand + " is now going " + speed + " km/h");
    }
}

public class Main {
    public static void main(String[] args) {
        Car myCar = new Car("Toyota", 60);
        myCar.accelerate(20); // Toyota is now going 80 km/h
    }
}
```

---

### 8.2 Encapsulation

Encapsulation means keeping fields private and exposing them through public getters/setters. This protects data integrity.

```java
public class BankAccount {
    private double balance; // private — cannot be accessed directly

    public BankAccount(double initialBalance) {
        if (initialBalance >= 0) {
            this.balance = initialBalance;
        }
    }

    // Getter
    public double getBalance() {
        return balance;
    }

    // Setter with validation
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Deposited: " + amount);
        } else {
            System.out.println("Invalid deposit amount.");
        }
    }

    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println("Withdrawn: " + amount);
        } else {
            System.out.println("Insufficient funds or invalid amount.");
        }
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount account = new BankAccount(1000);
        account.deposit(500);
        account.withdraw(200);
        System.out.println("Balance: " + account.getBalance()); // 1300.0
    }
}
```

---

### 8.3 Inheritance

Inheritance lets a child class reuse and extend the behavior of a parent class using the `extends` keyword.

```java
// Parent class
public class Animal {
    String name;

    public Animal(String name) {
        this.name = name;
    }

    public void eat() {
        System.out.println(name + " is eating.");
    }

    public void sleep() {
        System.out.println(name + " is sleeping.");
    }
}

// Child class
public class Dog extends Animal {
    String breed;

    public Dog(String name, String breed) {
        super(name); // calls parent constructor
        this.breed = breed;
    }

    public void bark() {
        System.out.println(name + " says: Woof!");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog dog = new Dog("Bruno", "Labrador");
        dog.eat();   // inherited from Animal
        dog.bark();  // defined in Dog
        // Output:
        // Bruno is eating.
        // Bruno says: Woof!
    }
}
```

---

### 8.4 Polymorphism

Polymorphism means "many forms." The same method name behaves differently based on context.

**Method Overloading (Compile-time polymorphism):**

```java
public class Printer {
    public void print(String text) {
        System.out.println("Text: " + text);
    }

    public void print(int number) {
        System.out.println("Number: " + number);
    }

    public void print(String text, int copies) {
        for (int i = 0; i < copies; i++) {
            System.out.println(text);
        }
    }
}
```

**Method Overriding (Runtime polymorphism):**

```java
public class Shape {
    public double area() {
        return 0;
    }
}

public class Circle extends Shape {
    double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

public class Rectangle extends Shape {
    double width, height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public double area() {
        return width * height;
    }
}

public class Main {
    public static void main(String[] args) {
        Shape s1 = new Circle(5);
        Shape s2 = new Rectangle(4, 6);

        System.out.println("Circle area: " + s1.area());       // 78.53...
        System.out.println("Rectangle area: " + s2.area());    // 24.0
    }
}
```

---

### 8.5 Abstraction

Abstraction hides implementation details and exposes only what's necessary. Achieved via **abstract classes** or **interfaces**.

**Abstract Class:**

```java
public abstract class Vehicle {
    String brand;

    public Vehicle(String brand) {
        this.brand = brand;
    }

    // Abstract method — no body, must be implemented by subclass
    public abstract void fuelType();

    // Concrete method — has body
    public void start() {
        System.out.println(brand + " is starting...");
    }
}

public class ElectricCar extends Vehicle {
    public ElectricCar(String brand) {
        super(brand);
    }

    @Override
    public void fuelType() {
        System.out.println(brand + " runs on electricity.");
    }
}

public class Main {
    public static void main(String[] args) {
        Vehicle car = new ElectricCar("Tesla");
        car.start();      // Tesla is starting...
        car.fuelType();   // Tesla runs on electricity.
    }
}
```

**Interface:**

```java
public interface Flyable {
    void fly(); // implicitly public and abstract
}

public interface Swimmable {
    void swim();
}

// A class can implement multiple interfaces
public class Duck implements Flyable, Swimmable {
    @Override
    public void fly() {
        System.out.println("Duck is flying.");
    }

    @Override
    public void swim() {
        System.out.println("Duck is swimming.");
    }
}
```

> **Key difference:** A class can `extend` only one class but can `implement` multiple interfaces.

---

## 9. Exception Handling

Exceptions are runtime errors. Java provides a robust mechanism to handle them gracefully using `try-catch-finally`.

```java
public class ExceptionExample {
    public static void main(String[] args) {
        try {
            int[] arr = new int[3];
            arr[5] = 10; // ArrayIndexOutOfBoundsException
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Error: " + e.getMessage());
        } finally {
            System.out.println("This always runs.");
        }

        // Handling multiple exceptions
        try {
            String s = null;
            System.out.println(s.length()); // NullPointerException
        } catch (NullPointerException e) {
            System.out.println("Null pointer caught!");
        } catch (Exception e) {
            System.out.println("Generic exception: " + e.getMessage());
        }
    }
}
```

### Custom Exception

```java
public class InsufficientFundsException extends Exception {
    public InsufficientFundsException(String message) {
        super(message);
    }
}

public class Wallet {
    private double balance = 500;

    public void pay(double amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException("Not enough balance. Available: " + balance);
        }
        balance -= amount;
        System.out.println("Payment successful. Remaining: " + balance);
    }
}

public class Main {
    public static void main(String[] args) {
        Wallet wallet = new Wallet();
        try {
            wallet.pay(300);  // OK
            wallet.pay(300);  // Throws exception
        } catch (InsufficientFundsException e) {
            System.out.println(e.getMessage());
        }
    }
}
```

---

## 10. Collections Framework

The Java Collections Framework provides ready-to-use data structures.

### ArrayList

```java
import java.util.ArrayList;

public class CollectionsExample {
    public static void main(String[] args) {
        ArrayList<String> languages = new ArrayList<>();
        languages.add("Java");
        languages.add("Python");
        languages.add("JavaScript");

        System.out.println(languages.get(0));   // Java
        System.out.println(languages.size());   // 3

        languages.remove("Python");

        for (String lang : languages) {
            System.out.println(lang);
        }
    }
}
```

### HashMap

```java
import java.util.HashMap;

public class HashMapExample {
    public static void main(String[] args) {
        HashMap<String, Integer> scores = new HashMap<>();
        scores.put("Alice", 95);
        scores.put("Bob", 87);
        scores.put("Charlie", 92);

        System.out.println(scores.get("Bob"));       // 87
        System.out.println(scores.containsKey("Alice")); // true

        // Iterate over entries
        for (var entry : scores.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
    }
}
```

---

## 11. String Manipulation

Strings are one of the most used types in Java. The `String` class is immutable — every modification creates a new object.

```java
public class StringExample {
    public static void main(String[] args) {
        String s = "  Hello, Java World!  ";

        System.out.println(s.trim());                    // "Hello, Java World!"
        System.out.println(s.toLowerCase());             // "  hello, java world!  "
        System.out.println(s.toUpperCase());             // "  HELLO, JAVA WORLD!  "
        System.out.println(s.contains("Java"));          // true
        System.out.println(s.replace("Java", "Kiro"));  // "  Hello, Kiro World!  "
        System.out.println(s.substring(8, 12));          // "Java" (index-based)
        System.out.println(s.trim().split(", ")[0]);     // "Hello"

        // String comparison — always use .equals(), not ==
        String a = "hello";
        String b = "hello";
        System.out.println(a.equals(b));       // true
        System.out.println(a.equalsIgnoreCase("HELLO")); // true
    }
}
```

### StringBuilder — for mutable strings

```java
StringBuilder sb = new StringBuilder();
sb.append("Java");
sb.append(" is");
sb.append(" awesome!");
System.out.println(sb.toString()); // Java is awesome!
```

> Use `StringBuilder` when building strings in loops — it's much more efficient than concatenating with `+`.

---

## 12. Static Keyword

`static` means the member belongs to the class itself, not to any specific instance.

```java
public class Counter {
    private static int count = 0; // shared across all instances

    public Counter() {
        count++;
    }

    public static int getCount() {
        return count;
    }
}

public class Main {
    public static void main(String[] args) {
        new Counter();
        new Counter();
        new Counter();
        System.out.println("Objects created: " + Counter.getCount()); // 3
    }
}
```

---

## 13. Generics

Generics allow you to write type-safe, reusable code without casting.

```java
// Generic class
public class Box<T> {
    private T value;

    public Box(T value) {
        this.value = value;
    }

    public T getValue() {
        return value;
    }
}

public class Main {
    public static void main(String[] args) {
        Box<Integer> intBox = new Box<>(42);
        Box<String> strBox = new Box<>("Hello Generics");

        System.out.println(intBox.getValue()); // 42
        System.out.println(strBox.getValue()); // Hello Generics
    }
}
```

---

## 14. Lambda Expressions (Java 8+)

Lambdas provide a concise way to implement functional interfaces (interfaces with a single abstract method).

```java
import java.util.Arrays;
import java.util.List;

public class LambdaExample {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Charlie", "Alice", "Bob");

        // Sort using lambda
        names.sort((a, b) -> a.compareTo(b));
        names.forEach(name -> System.out.println(name));
        // Output: Alice, Bob, Charlie

        // Runnable with lambda
        Runnable r = () -> System.out.println("Running in a thread!");
        new Thread(r).start();
    }
}
```

---

## 15. Streams API (Java 8+)

Streams let you process collections in a functional, declarative style.

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class StreamExample {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        // Filter even numbers, square them, collect to list
        List<Integer> result = numbers.stream()
            .filter(n -> n % 2 == 0)
            .map(n -> n * n)
            .collect(Collectors.toList());

        System.out.println(result); // [4, 16, 36, 64, 100]

        // Sum of all numbers
        int sum = numbers.stream()
            .reduce(0, Integer::sum);
        System.out.println("Sum: " + sum); // 55

        // Count elements greater than 5
        long count = numbers.stream()
            .filter(n -> n > 5)
            .count();
        System.out.println("Count > 5: " + count); // 5
    }
}
```

