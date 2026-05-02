# Mbalo Platform: Detailed Architecture & Actor Overview

## 1. Introduction to Mbalo
Mbalo is a premium, interactive, gamified mathematics learning platform specifically designed for young learners (Grades 1 to 7). Guided by a playful "Safari" theme and a friendly dog mascot, the platform transforms the standard CAPS (Curriculum and Assessment Policy Statement) curriculum into an engaging adventure. 

The core philosophy of Mbalo is to promote active recall, minimize text-heavy instruction, and provide positive reinforcement through micro-animations, text-to-speech support, and rich visual feedback.

---

## 2. Platform Actors

### A. The Learner (Primary Actor)
The core user of the application. The Learner is typically a primary school student.
**Key Interactions:**
* **Onboarding & Profile Setup:** Selects their current grade to tailor the curriculum.
* **Curriculum Navigation:** Navigates a "Course Map" of Chapters and Modules organized by topic (Addition, Subtraction, Multiplication, Division).
* **Quizzes & Lessons:** Interacts with diverse interactive question types (emoji counting, dragging/matching, number lines, column math).
* **Practice Hub:** Engages in personalized practice using "Mixer" tools (e.g., Division Mixer, Column Addition) to master specific operations.
* **Progress Tracking:** Earns points, achieves ranks (e.g., "Safari Hero"), unlocks milestones, and reviews their daily goals.

### B. The Parent / Guardian (Secondary Actor)
While there is no dedicated "Parent Portal" yet, the platform is designed with parents in mind to track their child's educational journey.
**Key Interactions:**
* **Progress Analytics Dashboard:** Parents can review the dashboard alongside the learner to see total time spent, accuracy percentages, and module mastery.
* **Mission Review (Struggles):** Parents can see exactly which questions the learner struggled with, enabling targeted at-home intervention.
* **Account Management:** Handles legal consents (POPI Act), manages the subscription/account details, and adjusts "At-Home Study" settings (like Dark Mode).

### C. The Administrator / Educator (Backend Actor)
A hidden actor responsible for managing the platform's content and ensuring smooth operation.
**Key Interactions:**
* **Curriculum Management:** Uses administrative tools (e.g., the hidden "Upload Curriculum" feature) to seed the Firebase database with structured JSON lesson data.
* **Data Oversight:** Monitors aggregate learner progress via the Firebase backend.

---

## 3. Core Features & Functionality

### 3.1 Authentication & Profile Management
* **Secure Login:** Supports email/password and Google OAuth via Firebase.
* **Grade-Specific Routing:** Upon account creation, the user's selected grade dictates the curriculum served.
* **Profile Customization:** Users can edit their display names and toggle Dark Mode to reduce eye strain.

### 3.2 Dynamic Curriculum Engine
* **Hierarchical Learning Path:** Content is structured as `Grade -> Chapter -> Module -> Lesson -> Questions`.
* **Course Map:** A visual roadmap where learners unlock sequential modules. Completed lessons are visually checked off to show progression.

### 3.3 Interactive Quiz Engine
The heart of Mbalo, featuring 9 diverse, interactive question types to cater to different learning styles:
1. **Multiple Choice & True/False:** Standard testing formats.
2. **Emoji Counting:** Visual counting exercises using playful icons.
3. **Sequence / Pattern Grids:** Logical reasoning tasks.
4. **Sum Composition:** Building numbers out of visual pieces.
5. **Interactive Number Line:** Dragging sliders to visualize addition and subtraction.
6. **Drag & Match:** Kinesthetic matching of equations to answers.
7. **Long Division / Column Math:** Specialized UI for structured written mathematics.

*Includes accessibility features like Text-to-Speech (TTS) and interactive calculators.*

### 3.4 The Practice Hub & "Mixers"
A dedicated sandbox for focused mastery, completely decoupled from the main curriculum:
* **Addition, Subtraction & Division Mixers:** Tools that generate random equations, allowing students to guess, watch an animated visual explanation, and celebrate correct answers.
* **Vertical Mixers:** Simulates pen-and-paper column addition and subtraction, including specific UI inputs for "carries" and "borrows".
* **Multiplication Table Tool:** A phased learning tool (Learn -> Try -> Celebrate) focusing on rote memorization of timetables.

### 3.5 Adaptive Analytics & Progress Tracking
* **The "Struggle" System:** If a learner gets a question wrong twice, it is recorded as a "struggle" and sent to the Practice Hub's Mission Review. Once they master it later, it is cleared.
* **Milestones & Ranks:** The platform awards titles and visual badges (e.g., "First Lesson", "Perfect Score") based on the stats tracked in the `authService`.
* **Mastery Bars:** Visual percentage bars show exactly how close a student is to mastering a specific mathematical module.

---

## 4. Technical Architecture
* **Frontend:** React, TypeScript, Vite.
* **Styling & UI:** Pure CSS, Framer Motion (for bouncy, kid-friendly animations), SweetAlert2 (for modals), and Lucide React (for icons).
* **Backend / Database:** Firebase (Auth & Firestore) for state persistence and real-time syncing.
* **Testing Infrastructure:** Vitest and React Testing Library ensure the integrity of the math logic and critical user paths.
