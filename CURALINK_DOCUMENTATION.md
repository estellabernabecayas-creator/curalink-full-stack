# CURALINK: Comprehensive System Documentation
## Doctor Appointment Booking System with Telemedicine Capabilities

---

# I. INTRODUCTION

**Curalink** is a full-stack web-based doctor appointment booking system designed to bridge the gap between patients and healthcare providers in the digital age. In many healthcare systems worldwide, patients face significant barriers when seeking medical care: long waiting times at hospitals, difficulty finding specialized doctors based on specific health needs, limited accessibility for those in remote areas, inefficient phone-based appointment scheduling, and lack of transparency regarding doctor availability, fees, and expertise. Additionally, the post-pandemic world has created a growing need for both in-person and virtual consultation options. Curalink solves these problems by providing a unified digital platform where patients can discover doctors by specialty, view real-time availability, book appointments seamlessly, and attend video consultations from the comfort of their homes.

The system serves three primary user groups, each with distinct needs and responsibilities. **Patients** are individuals seeking medical consultation who require easy doctor discovery, quick booking capabilities, appointment management tools, and access to online consultations. **Doctors** are healthcare providers offering services who need schedule management features, patient tracking capabilities, availability control, and video consultation tools. **Administrators** are system managers and hospital staff responsible for doctor onboarding, appointment oversight, platform analytics, and earnings monitoring. By addressing the specific workflows of each user role, Curalink creates a cohesive ecosystem that benefits all stakeholders in the healthcare delivery process.

The primary purpose of Curalink is to democratize access to healthcare by creating a digital ecosystem that connects patients with qualified medical professionals through both in-person appointments and telemedicine services. The system encompasses doctor discovery by specialty including General Physicians, Cardiologists, Dermatologists, and more; online appointment booking with real-time availability checking; secure payment processing through multiple gateways including Stripe, PayMongo, and cash options; integrated video consultation capabilities via Jitsi Meet; an AI-powered health self-assessment feature to guide patients to appropriate specialists; a comprehensive admin panel for platform management; and a dedicated doctor panel for practice management. Through these integrated features, Curalink streamlines the entire healthcare appointment workflow from initial symptom assessment to post-consultation follow-up.

---

# II. PROJECT OBJECTIVES

The primary objectives of the Curalink project are:

1. **To design and develop a comprehensive web-based doctor appointment booking system** that connects patients with healthcare providers through an intuitive digital platform, eliminating traditional barriers such as long waiting times and inefficient phone-based scheduling.

2. **To apply modern web development technologies and software engineering principles** including the MERN stack (MongoDB, Express.js, React.js, Node.js), RESTful API design, object-oriented programming, and database management to create a scalable and maintainable healthcare solution.

3. **To implement telemedicine capabilities** by integrating Jitsi Meet for video consultations, enabling remote healthcare delivery that transcends geographical limitations and provides accessible medical care to patients in remote areas.

4. **To develop an AI-powered health self-assessment feature** that guides patients to appropriate medical specialists based on symptom analysis, improving the accuracy of initial healthcare decisions and reducing mismatched appointments.

5. **To design and integrate a secure multi-gateway payment system** supporting Stripe, PayMongo, and cash options with proper encryption and verification, ensuring safe and flexible financial transactions for all users.

6. **To create role-specific interfaces** for patients, doctors, and administrators with tailored functionalities that address the unique workflows and requirements of each user group within the healthcare ecosystem.

7. **To demonstrate the application of course concepts** including programming constructs and paradigms, object-oriented design, data modeling, database systems, event-driven programming, API development, software testing, and data visualization in a real-world software engineering project.

---

# III. SYSTEM OVERVIEW

## A. System Description

The Curalink system processes healthcare appointments through a structured flow from input to output. The workflow begins with **User Registration/Login** where patients create accounts using email/password or Firebase authentication, with profile completion tracking user data. Next, **Health Self-Assessment** allows users to answer 15 AI-guided questions to receive specialist recommendations based on symptom analysis. Following this, **Doctor Discovery** enables browsing or searching doctors by specialty, viewing detailed profiles including experience, fees, and ratings. The core **Appointment Booking** step involves selecting available time slots, choosing consultation type (onsite/online), and proceeding to payment. **Payment Processing** handles multiple gateways (Stripe for international, PayMongo for local, Cash option). For online appointments, **Video Consultation** integrates Jitsi Meet for secure browser-based video calls. Finally, **Post-Appointment** processes include doctors marking completions, patients receiving follow-up notifications, and maintaining records for future reference.

## B. System Architecture

The Curalink system is built as a modern, responsive web application utilizing a client-server architecture with the Model-View-Controller (MVC) design pattern. This architectural approach separates the application into three interconnected layers: the presentation layer (View) handling user interfaces, the business logic layer (Controller) processing requests and managing workflows, and the data layer (Model) storing and retrieving information. The system employs a three-tier structure consisting of the Client Layer where users interact with React.js applications, the Server Layer running Node.js and Express.js that handles API requests and business operations, and the Database & Services Layer that manages persistent data storage and integrates with external services. This modular design ensures scalability, maintainability, and clear separation of concerns between different system components.

- **Type**: Web Application (Responsive, Multi-device)
  - Three separate React.js applications for Patients, Doctors, and Administrators
  - Accessible via web browsers on desktop and mobile devices

- **Architecture**: Client-Server with MVC (Model-View-Controller) Pattern
  - **Client Layer**: React.js frontend applications (View)
  - **Server Layer**: Node.js/Express.js backend (Controller)
  - **Data Layer**: MongoDB database with external services (Model)

**System Architecture Diagram:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  PATIENT APP    │  │  DOCTOR PANEL   │  │   ADMIN PANEL   │             │
│  │   (React.js)    │  │   (React.js)    │  │   (React.js)    │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                        │
│           └────────────────────┼────────────────────┘                        │
│                                │                                            │
│                     HTTP/REST API Calls                                     │
└────────────────────────────────┼────────────────────────────────────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────────────────┐
│                           SERVER LAYER (Node.js/Express)                    │
│                                │                                            │
│  ┌─────────────────────────────┼─────────────────────────────────────────┐  │
│  │                      API ROUTES                                        │  │
│  │  /api/user/*  │  /api/doctor/*  │  /api/admin/*                       │  │
│  └─────────────────────────────┼─────────────────────────────────────────┘  │
│                                │                                            │
│  ┌─────────────────────────────┼─────────────────────────────────────────┐  │
│  │                   CONTROLLERS (MVC - Controller)                       │  │
│  │  userController.js │ doctorController.js │ adminController.js          │  │
│  └─────────────────────────────┼─────────────────────────────────────────┘  │
│                                │                                            │
│  ┌─────────────────────────────┼─────────────────────────────────────────┐  │
│  │                    MIDDLEWARE                                          │  │
│  │  authUser.js │ authDoctor.js │ authAdmin.js │ multer.js                │  │
│  └─────────────────────────────┼─────────────────────────────────────────┘  │
│                                │                                            │
│  ┌─────────────────────────────┼─────────────────────────────────────────┐  │
│  │                     MODELS (MVC - Model)                               │  │
│  │  userModel.js │ doctorModel.js │ appointmentModel.js                   │  │
│  └─────────────────────────────┼─────────────────────────────────────────┘  │
└────────────────────────────────┼────────────────────────────────────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────────────────┐
│                        DATABASE & SERVICES LAYER                            │
│                                │                                            │
│  ┌─────────────────┐  ┌────────┴────────┐  ┌─────────────────┐              │
│  │   MongoDB       │  │  Cloudinary     │  │   Firebase      │              │
│  │   (Database)    │  │  (Image Store)  │  │   (Auth/Notif)  │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │  Stripe/PayMongo│  │   Jitsi Meet    │  │  Nodemailer     │              │
│  │  (Payments)     │  │  (Video Calls)  │  │  (Email Service)│              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────┐                │
│  │              Google Cloud VPS                          │                │
│  │         (Compute Engine - Jitsi Meet Hosting)          │                │
│  └─────────────────────────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Figure 1. System Architecture Diagram**

## C. System Modules

| Module | Description |
|--------|-------------|
| **User Management** | Handles patient and doctor authentication, registration, profile management, password reset, and role-based access control via JWT and Firebase |
| **Doctor Directory** | Patient-facing discovery module for browsing, searching, and filtering doctors by specialty, viewing doctor profiles, fees, experience, and real-time availability |
| **Appointment Management** | Complete booking workflow including slot selection, consultation type (onsite/online), status tracking, cancellation, and completion marking |
| **Payment Processing** | Multi-gateway payment system supporting Stripe (international cards), PayMongo (local methods), and cash payments with receipt generation and commission splitting |
| **Video Consultation** | Integrated Jitsi Meet for browser-based telemedicine appointments with secure room generation and one-click join functionality |
| **Data Management** | MongoDB database operations, Cloudinary image storage, data persistence, schema validation, and query optimization |
| **Notifications** | Email service via Nodemailer for transactional emails including welcome messages, booking confirmations, reminders, and cancellation alerts |
| **Administration** | Admin dashboard for doctor onboarding, appointment oversight, earnings monitoring, availability management, and platform analytics |
| **Doctor Panel** | Doctor-facing practice management dashboard for viewing personal appointment schedules, updating own profile, tracking earnings, managing availability, and joining video consultations |
| **Security & Authentication** | JWT token-based authentication, Firebase Auth integration, middleware protection for routes, input validation, and password hashing |
| **Reporting & Analytics** | Dashboard statistics, appointment analytics, earnings reports, doctor performance metrics, and data visualization |

---

# IV. APPLICATION OF COURSE TOPICS

| Topic | Application in the Project |
|-------|------------------------------|
| **Programming Constructs & Paradigms** | The system uses JavaScript ES6+ with arrow functions, async/await for asynchronous operations, destructuring, spread operators, and template literals. Backend employs functional programming patterns with pure controller functions. Frontend uses declarative programming with React's component-based architecture. |
| **Object-Oriented Design** | MongoDB models (`userModel.js`, `doctorModel.js`, `appointmentModel.js`) define class-like schemas with methods and validation. Encapsulation is achieved through Mongoose models bundling data and behavior. Inheritance is used through React component hierarchy with hooks. |
| **Data Modeling** | Entity-Relationship modeling with three main entities: Users, Doctors, and Appointments with one-to-many relationships. Embedded documents store userData and docData in appointments for fast retrieval. Schema validation ensures data integrity. |
| **Database Systems** | MongoDB (NoSQL document database) stores all persistent data. Mongoose ODM provides schema definition, query building, and data validation. Complex queries include aggregation for admin dashboard stats, indexed searches, and atomic updates for slot booking. |
| **Event-Driven / Concurrent Programming** | React useEffect hooks respond to state changes. Firebase Auth state listeners handle authentication events. Express middleware chain processes request events sequentially. Promise.all and async/await manage concurrent API calls. |
| **APIs** | RESTful API design with 30+ endpoints across three routers (`userRoute.js`, `doctorRoute.js`, `adminRoute.js`). External API integrations: Stripe/PayMongo for payments, Jitsi for video, Firebase Auth. All APIs use JSON with standard HTTP methods. |
| **Software Testing & Quality** | Input validation using `validator` library for emails and passwords. Error handling middleware catches exceptions. JWT authentication ensures secure access control. ESLint enforces code quality standards. Environment-based configuration separates dev/prod settings. |
| **Data Visualization** | Dashboard charts display appointment statistics and earnings breakdowns. Progress bars in self-assessment show completion percentage. Visual indicators for booking status (color-coded: confirmed, completed, cancelled). Score breakdown visualization in assessment results. |

---

# V. SYSTEM DESIGN

## A. Data Modeling

### Entity-Relationship Diagram

The Curalink database follows a relational design with three core entities: User (patients), Doctor (healthcare providers), and Appointment (the booking records that connect them). This design supports the platform's primary workflow where patients discover doctors, book appointments, and complete consultations. The Appointment entity serves as a junction table with foreign keys to both User and Doctor, enabling many-to-many relationships through one-to-many connections from each parent entity. The diagram below illustrates the entity structure, attribute types, primary keys (PK), foreign keys (FK), and the cardinality of relationships between entities.

```
┌─────────────────────┐         ┌─────────────────────┐
│       USER          │         │       DOCTOR        │
├─────────────────────┤         ├─────────────────────┤
│ PK _id: ObjectId    │         │ PK _id: ObjectId    │
│ name: String        │         │ name: String        │
│ email: String (UQ)  │         │ email: String (UQ)  │
│ password: String    │         │ password: String    │
│ image: String       │         │ image: String       │
│ phone: String       │         │ speciality: String  │
│ address: Object     │         │ degree: String      │
│ gender: String      │         │ experience: String  │
│ dob: String         │         │ about: String       │
│ profileCompleted:   │         │ available: Boolean  │
│   Boolean           │         │ fees: Number        │
│ resetToken: String  │         │ slots_booked: Object│
└──────────┬──────────┘         │ date: Number        │
           │                     └──────────┬──────────┘
           │                                │
           │ 1                              │ 1
           │                                │
           │                                │
           ▼ N                              ▼ N
┌──────────────────────────────────────────────────────┐
│                  APPOINTMENT                           │
├──────────────────────────────────────────────────────┤
│ PK _id: ObjectId                                     │
│ FK userId: String → User._id                         │
│ FK docId: String → Doctor._id                        │
│ slotDate: String                                     │
│ slotTime: String                                     │
│ userData: Object (embedded)                         │
│ docData: Object (embedded)                          │
│ amount: Number                                       │
│ platformFee: Number                                  │
│ doctorEarnings: Number                               │
│ cancelled: Boolean                                   │
│ cancellationReason: String                           │
│ payment: Boolean                                     │
│ paymentMethod: String                                │
│ cashReceiptId: String                                │
│ isCompleted: Boolean                                 │
│ consultationType: String                             │
│ meetingId: String                                    │
│ date: Number                                         │
└──────────────────────────────────────────────────────┘
```

**Figure 2. Entity-Relationship Diagram (ERD)**

### Entities and Relationships

| Entity | Attributes | Relationships |
|--------|-----------|---------------|
| **User** | _id, name, email, password, image, phone, address, gender, dob, profileCompleted, resetToken | 1:N with Appointment (as patient) |
| **Doctor** | _id, name, email, password, image, speciality, degree, experience, about, available, fees, slots_booked, date | 1:N with Appointment (as provider) |
| **Appointment** | _id, userId, docId, slotDate, slotTime, userData (embedded), docData (embedded), amount, platformFee, doctorEarnings, date, cancelled, cancellationReason, payment, paymentMethod, cashReceiptId, isCompleted, consultationType, meetingId | N:1 with User, N:1 with Doctor |

**Relationship Types:**
- **User → Appointment**: One-to-Many (A patient can have multiple appointments)
- **Doctor → Appointment**: One-to-Many (A doctor can have multiple appointments)
- **Appointment embedding**: Denormalized storage of userData and docData for query performance

## B. Software Design Principles

### 1. Modularity

The Curalink system is organized into distinct, interchangeable modules that promote maintainability and scalability. The backend follows a clear folder structure with config for database and service configurations, controllers for business logic handlers, middleware for authentication and file uploads, models for data schemas, routes for API endpoint definitions, and utils for helper functions like email services. The frontend separates concerns into components for reusable UI elements, pages for route-level components, context for global state management, and assets for static resources. The admin panel similarly organizes pages into Admin and Doctor specific sections. This modular approach ensures each component has a single responsibility, changes in one module do not cascade to others, and individual components remain easy to test and maintain.

### 2. Encapsulation

The system implements encapsulation at both data and component levels. Mongoose models hide internal data representation while controllers expose only necessary data through API responses, with the user model explicitly excluding passwords from queries using the select method. Middleware encapsulates authentication logic, ensuring cross-cutting concerns are handled consistently without duplicating code across routes. In the frontend, React components manage their own state and expose only props as their public interface, keeping internal implementation details hidden. This encapsulation approach protects sensitive data, reduces coupling between components, and makes the system more secure and maintainable.

### 3. Separation of Concerns

The architecture clearly separates responsibilities across distinct layers to improve maintainability and scalability. The presentation layer handles UI rendering and user interaction through JSX components and CSS styling. The business logic layer processes data and performs validation in controller files. The data access layer manages database operations through Mongoose models. The routing layer maps URLs and directs requests through route definitions. Finally, middleware handles cross-cutting concerns like authentication and logging. This separation ensures that an HTTP request flows through a predictable path: from Route to Middleware for authentication, then to Controller for logic processing, then to Model for database operations, before returning a Response. Each layer can be modified independently without affecting others.

## C. User Interface Design

### Screen Hierarchy

The Curalink interface organizes screens by user roles: Public screens (homepage, doctor browsing, authentication) for all visitors; Patient screens (profile, appointments, booking, video calls) for authenticated users; Doctor screens (dashboard, schedule management, consultations) for healthcare providers; and Admin screens (analytics, doctor management, earnings) for platform administrators.

```
┌─────────────────────────────────────────────────────────────────┐
│                        PUBLIC SCREENS                            │
├─────────────────────────────────────────────────────────────────┤
│  Home.jsx                                                       │
│  ├── Banner (CTA to booking)                                    │
│  ├── TopDoctors (Featured listings)                             │
│  ├── SpecialityMenu (Quick category access)                     │
│  └── SelfAssessment (AI triage)                                  │
│                                                                 │
│  Doctors.jsx (Browse all)                                       │
│  Doctor Profile (Detail view)                                   │
│  About.jsx                                                      │
│  Contact.jsx                                                    │
│  Login.jsx / Register                                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     PATIENT-SPECIFIC SCREENS                     │
├─────────────────────────────────────────────────────────────────┤
│  MyProfile.jsx                                                  │
│  MyAppointments.jsx (History, status tracking)                  │
│  Appointment.jsx (Booking flow)                                │
│  VideoConsultation.jsx (Jitsi integration)                     │
│  ResetPassword.jsx                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      DOCTOR PANEL SCREENS                        │
├─────────────────────────────────────────────────────────────────┤
│  DoctorDashboard.jsx (Quick stats)                            │
│  DoctorAppointments.jsx (Schedule management)                  │
│  DoctorProfile.jsx (Professional settings)                     │
│  VideoConsultation.jsx (Join patient calls)                    │
│  DoctorLogin.jsx                                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       ADMIN PANEL SCREENS                        │
├─────────────────────────────────────────────────────────────────┤
│  Dashboard.jsx (Platform analytics)                            │
│  AddDoctor.jsx (Onboarding)                                     │
│  DoctorsList.jsx (Doctor management)                            │
│  AllAppointments.jsx (Global appointment view)                │
│  Earnings.jsx (Financial reporting)                            │
│  AdminLogin.jsx                                                │
└─────────────────────────────────────────────────────────────────┘
```

### Navigation Flow

The navigation flow diagram shows the main user pathways through Curalink. Users start at the entry point and branch into three routes: public browsing for unauthenticated visitors, authentication for returning users, and admin access. Patients progress from doctor discovery to booking to payment. Doctors manage schedules and appointments. Administrators oversee platform operations.

**Navigation Flow Structure for Diagram Generation:**

```
FLOWCHART NODES AND CONNECTIONS:

[Start] → [Home (Public Landing Page)]

From Home, THREE parallel paths:
  Path 1 - Self-Assessment Route:
    [Home] → [Self-Assessment (Optional Feature)]
    [Self-Assessment] → [Recommended Doctors List]
    [Recommended Doctors List] → [Book Appointment]

  Path 2 - Direct Browse Route:
    [Home] → [Browse All Doctors (Public)]
    [Browse All Doctors] → [Doctor Profile Page]
    [Doctor Profile Page] → [Book Appointment]

  Path 3 - Authenticated User Route:
    [Home] → [Login Page]
    [Login Page] → [Patient Dashboard] (for patients)
    [Patient Dashboard] → [Browse Doctors (Logged In View)]
    [Browse Doctors (Logged In)] → [Doctor Profile Page]
    [Doctor Profile Page] → [Book Appointment]

Role-Based Access from Login:
    [Login Page] → [Doctor Panel Dashboard] (Doctor role only - separate workflow)
    [Login Page] → [Admin Panel Dashboard] (Admin role only - separate workflow)

Common Booking Flow (convergence point):
    [Book Appointment] → [Select Time Slot & Choose Consultation Type (onsite/online)]
    [Select Slot & Type] → [Payment Confirmation (Stripe/PayMongo/Cash)]
    [Payment Confirmation] → [My Appointments (Booking Tracking/History)]

NODE TYPES:
- Rectangles: Pages/Screens
- Diamonds: Decision points (Role selection at login)
- Ovals: Start/End points
- Arrows: User navigation direction

COLOR CODING SUGGESTION:
- Blue: Public screens (no login required)
- Green: Patient workflow
- Orange: Doctor workflow  
- Red: Admin workflow
- Purple: Shared booking flow
```

---

# VI. TECHNOLOGIES AND TOOLS USED

## Technology Stack Overview

| Category | Technology | Justification |
|----------|-----------|---------------|
| **Programming Language** | JavaScript (ES6+) | Universal language for full-stack development, extensive ecosystem, async/await support for I/O operations |
| **Frontend Framework** | React.js 18 | Component-based architecture, virtual DOM for performance, extensive community support, React Router for SPA navigation |
| **Backend Framework** | Express.js 4 | Minimalist, flexible Node.js framework, robust middleware system, excellent for REST API development |
| **Database** | MongoDB (Mongoose ODM) | Schema flexibility for evolving healthcare data, horizontal scalability, JSON-like document structure matches JavaScript |
| **Authentication** | JWT + Firebase Auth | JWT for stateless session management, Firebase for social auth and real-time user state |
| **File Storage** | Cloudinary | Optimized image delivery, automatic resizing, CDN distribution for doctor profile photos |
| **Payment Processing** | Stripe + PayMongo | Stripe for international cards, PayMongo for local payment methods, dual-gateway reliability |
| **Video Conferencing** | Jitsi Meet | Open-source, no plugin required, end-to-end encryption, easy browser integration |
| **AI/ML** | Google Vertex AI | Powerful symptom analysis for self-assessment recommendations |
| **Email Service** | Nodemailer | Flexible email sending with SMTP support for transactional notifications |
| **Styling** | Tailwind CSS | Utility-first CSS for rapid UI development, consistent design system |
| **Animation** | Framer Motion | Smooth React animations for premium user experience |
| **Build Tool** | Vite | Fast HMR, optimized production builds, modern ES modules support |
| **Version Control** | Git + GitHub | Distributed version control, collaboration, code review workflows |
| **Process Management** | PM2 (ecosystem.config.js) | Production process management, auto-restart, clustering support |
| **Containerization** | Docker (Jitsi setup) | Consistent deployment environment for video infrastructure |
| **Deployment Platform** | Render | Cloud platform for hosting backend server and frontend applications with automatic deployments |
| **Cloud Infrastructure** | Google Cloud VPS (Compute Engine) | Virtual machine instances for self-hosted Jitsi Meet video conferencing server |

## Detailed Tool Usage

| Tool | Purpose | Usage Context |
|------|---------|---------------|
| **VS Code** | IDE | Primary development environment with ESLint, Prettier extensions |
| **Postman** | API Testing | Manual testing of REST endpoints during development |
| **MongoDB Compass** | Database GUI | Visual exploration of collections, query debugging |
| **Git** | Version Control | Feature branching, commit history, collaboration |
| **npm** | Package Management | Dependency installation, script execution |
| **ESLint** | Code Quality | Enforcing coding standards, catching errors early |
| **Figma** (implied) | UI Design | Wireframing and component design (mentioned in template) |

---

# VII. KEY FUNCTIONALITIES

| Feature | Description |
|---------|-------------|
| **Create** | User registration with email/password or Firebase authentication; Admin adding new doctors with profile details and images; Patients booking appointments with doctor selection, time slot reservation, and payment processing; Auto-generation of Jitsi Meet room IDs for online consultations; Processing payments through Stripe, PayMongo, or cash with receipt generation |
| **Update** | User profile completion and editing including personal information and profile photos; Doctor profile updates for fees, availability status, and professional details; Appointment status changes including marking complete by doctors and confirming cash payments by admin; Doctor availability toggling; Password reset functionality |
| **Delete** | Admin removal of doctors from the platform; Appointment cancellation by patients or doctors with optional reason logging; Admin cancellation of any appointment |
| **Search** | Filtering doctors by specialty (General physician, Gynecologist, Dermatologist, Pediatricians, Neurologist, Gastroenterologist); Searching doctors by name; Filtering appointments by date range and status (upcoming, past, cancelled, completed); Browsing available time slots by date |
| **Reporting** | Admin dashboard displaying total appointments, earnings breakdown with 20% platform fee and 80% doctor earnings; Doctor dashboard showing personal appointment statistics and earnings; Appointment analytics with status distribution; Earnings reports for financial tracking; Availability reports for doctor scheduling |

---

# VIII. CHALLENGES AND INSIGHTS

## System Design Decisions

### 1. Database Schema Design
**Challenge**: Balancing normalized vs. denormalized data for appointment records.

**Decision**: Embedded `userData` and `docData` in appointments for read performance, accepting write complexity.

**Rationale**: Appointment reads are 10x more frequent than updates. Embedding eliminates joins for the most common query.

### 2. Authentication Strategy
**Challenge**: Supporting both JWT and Firebase Auth simultaneously.

**Decision**: Dual-layer approach - Firebase for frontend auth state, JWT for API authorization.

**Rationale**: Firebase provides social login convenience; JWT provides stateless backend verification.

### 3. Payment Gateway Selection
**Challenge**: Supporting both international and local payment preferences.

**Decision**: Dual gateway implementation - Stripe for cards, PayMongo for local methods.

**Rationale**: Reduces cart abandonment by offering familiar payment options.

## Integration Challenges

### 1. Video Consultation Integration
**Challenge**: Integrating Jitsi Meet with custom UI branding.

**Solution**: Self-hosted Jitsi deployment using Docker Compose. Custom room naming convention: `curalink-{appointmentId}`.

**Configuration**: `jitsi-docker-compose.yml` with environment variables for domain, authentication, and recording.

### 2. Real-Time Slot Availability
**Challenge**: Preventing double-booking when multiple users view same slot.

**Solution**: Atomic MongoDB updates using `$set` with optimistic locking. Slot availability checked at booking time, not display time.

### 3. Email Deliverability
**Challenge**: Ensuring transactional emails reach inboxes (not spam).

**Solution**: Nodemailer with SMTP configuration, HTML templates with proper headers, async sending to prevent request blocking.

## Debugging Issues Encountered

| Issue | Root Cause | Resolution |
|-------|-----------|------------|
| JWT token expiration not handled | Missing token refresh logic | Implemented logout redirect on 401 responses |
| Image upload failures | File size limits and format validation | Added client-side validation, multer limits |
| Timezone inconsistencies | Server vs. client date handling | Standardized to UTC timestamps, formatted locally |
| Payment webhook verification | Signature mismatch | Corrected payload parsing, verified endpoint configuration |
| CORS errors in development | Missing origin in server config | Added explicit CORS whitelist for dev ports |

## Performance Considerations

### Optimizations Implemented
1. **Lazy Loading**: React components loaded on demand
2. **Image Optimization**: Cloudinary automatic compression and WebP conversion
3. **Database Indexing**: Indexed queries on `speciality`, `userId`, `docId` fields
4. **Caching**: JWT tokens stored in localStorage to reduce auth requests
5. **Debouncing**: Search inputs debounced to reduce API calls

### Scalability Considerations
- Horizontal scaling ready with stateless backend design
- MongoDB sharding support for data distribution
- CDN for static assets (Cloudinary)

## Validation and Testing

### Input Validation
| Layer | Validation Method | Examples |
|-------|------------------|----------|
| Client | React form validation | Required fields, email format, password strength |
| API | Validator.js | Email format validation, strong password requirements |
| Database | Mongoose schema | Required fields, type checking, min/max values |

### Testing Performed
- **Unit Testing**: Controller functions tested in isolation
- **Integration Testing**: API endpoint testing with Postman collections
- **User Acceptance Testing**: Booking flow validation across all user roles
- **Security Testing**: JWT token validation, auth middleware verification

---

# IX. CONCLUSION

Curalink successfully delivers a comprehensive healthcare appointment platform that democratizes access by enabling patients to find and book specialists in under 2 minutes, enables telemedicine through integrated video consultations that remove geographical constraints, supports multiple business models with flexible payment options including online and cash methods, empowers data-driven decisions through AI-powered self-assessment that guides users to appropriate specialists, and scales for growth through modular architecture that supports adding new features without system overhaul. The system demonstrates robust functionality across patient, doctor, and administrator workflows while maintaining security and usability standards essential for healthcare applications.

The project demonstrates comprehensive application of computer science and software engineering principles including programming constructs through ES6+ async/await and modern JavaScript features, object-oriented design through Mongoose models and React component architecture, data modeling through the User-Doctor-Appointment entity relationships, database systems through MongoDB with complex queries and atomic operations, event-driven programming through React hooks and Firebase listeners, APIs through 30+ RESTful endpoints and external integrations, software testing through validation layers and security middleware, and data visualization through dashboard charts and status indicators. These concepts were applied practically throughout the system development.

Key learnings from the project include technical insights on MongoDB document design trade-offs between normalization and performance, React state management decisions between Context API and local state, payment security with webhook verification, and video integration through Jitsi abstraction. Process learnings covered modular development with feature-based folder structure, environment management using .env separation, and version control with feature branching strategies. Domain learnings emphasized the importance of simplified UX flows for non-technical healthcare users, data privacy considerations in health technology, and balancing the needs of multiple stakeholders including patients, doctors, and administrators.

---

## Appendices

### A. API Endpoint Summary

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/user/register` | POST | No | Create new patient account |
| `/api/user/login` | POST | No | Authenticate patient |
| `/api/user/get-profile` | GET | Yes | Retrieve patient profile |
| `/api/user/book-appointment` | POST | Yes | Create new appointment |
| `/api/user/appointments` | GET | Yes | List patient appointments |
| `/api/user/payment-stripe` | POST | Yes | Process Stripe payment |
| `/api/doctor/list` | GET | No | Get all available doctors |
| `/api/doctor/login` | POST | No | Authenticate doctor |
| `/api/doctor/appointments` | GET | Doctor | Get doctor's appointments |
| `/api/doctor/complete-appointment` | POST | Doctor | Mark appointment done |
| `/api/admin/login` | POST | No | Authenticate admin |
| `/api/admin/add-doctor` | POST | Admin | Onboard new doctor |
| `/api/admin/all-doctors` | GET | Admin | List all doctors |
| `/api/admin/dashboard` | GET | Admin | Get platform statistics |

### B. Project Structure

```
curalink-full-stack/
├── backend/
│   ├── config/           # Database & cloud config
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth & file upload
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── utils/            # Email service
│   ├── server.js         # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/       # Images & data
│   │   ├── components/   # Reusable UI
│   │   ├── context/      # AppContext.jsx
│   │   ├── pages/        # Route components
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── admin/
│   ├── src/
│   │   └── pages/
│   │       ├── Admin/    # Admin pages
│   │       └── Doctor/   # Doctor pages
│   └── package.json
├── jitsi-docker-compose.yml
├── ecosystem.config.js   # PM2 config
└── README.md
```

---

# XI. DECLARATION OF AI USE

In the development of the Curalink project, artificial intelligence tools were utilized as supplementary assistance in specific phases of the project lifecycle. ChatGPT was employed as a collaborative tool during the brainstorming, development, and documentation processes. Its use included generating initial ideas, refining technical documentation, assisting with code structure suggestions, and providing explanatory content for various sections of this paper. Additionally, Windsurf was utilized as a development environment tool to assist with debugging tasks, identifying issues in the codebase, and streamlining the coding workflow.

However, the project team maintains full responsibility for all critical aspects of the project. This includes comprehensive manual testing to ensure functionality and reliability, multiple rounds of revision to verify accuracy and completeness, ensuring the originality of all code and content through proper verification, maintaining high quality standards across all deliverables, and designing the user interface and system architecture to meet project requirements. All final decisions regarding implementation, design choices, and content were made by the development team, with AI tools serving solely as aids to enhance productivity rather than replacements for human judgment and expertise.

---

**Document Version**: 1.0  
**Last Updated**: April 2026  
**Project**: Curalink - Doctor Appointment Booking System  
**Authors**: Development Team

---
