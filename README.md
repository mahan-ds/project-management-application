# 📱 Freelancer Project Management App

> A complete offline mobile app for freelancers to manage their projects, tasks, and deadlines — built with **React Native** and **Expo**.

---

## 🛰 Overview
This application allows freelancers to create and manage multiple projects with task boards, track progress over time, and visualize deadlines.  
Everything is stored locally using **AsyncStorage**, so the app works completely **offline**.

---

## 🧩 Features

### 🗂 Project Management
- Create new projects with the following details:
  - Project Name  
  - Budget  
  - Client Name  
  - Estimated Time (hours)  
  - Description  
- Start and complete projects  
- Confirmation dialog before starting a project  
- Shows **deadline** and **remaining time** dynamically  
- Limits free users to 5 projects (simulated subscription)

### ✅ Task & Checklist
- Add a checklist inside each project  
- Mark tasks as completed  
- Displays visual progress percentage  

### 🧾 Notes
- Add project notes and comments  

### ⏱ Time Tracking
- When starting a project, the app:
  - Shows the calculated deadline based on estimated time  
  - Continuously updates remaining time  
  - Visually displays progress (progress bar)

---

## ⚙️ Technologies Used

| Category | Technology | Description |
|-----------|-------------|-------------|
| **Framework** | React Native + Expo | Cross-platform mobile framework |
| **Navigation** | React Navigation | Stack navigation between screens |
| **UI Styling** | React Native StyleSheet | Native styling system |
| **Local Database** | AsyncStorage | Persistent offline data |
| **Notifications (optional)** | Expo Notifications | Local alerts for deadlines |
| **State Management** | React Hooks | `useState`, `useEffect` |

---

## 📁 Project Structure
```
project-management/
├── App.js
├── screens/
│   ├── HomeScreen.js        # Project list and filters
│   ├── NewProject.js        # Add new project form
│   ├── ProjectDetail.js     # Deadline, progress, and checklist
├── components/
│   ├── ProjectCard.js
│   └── TimeTracker.js
├── utils/
│   └── storage.js           # AsyncStorage logic
└── assets/
```

---

## 🚀 Run the App from Source

### 🔧 Prerequisites
Make sure these are installed:
- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- **Expo Go App** on your phone  
  📱 Android → [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)  
  🍎 iOS → [App Store](https://apps.apple.com/app/expo-go/id982107779)

---

### 🪄 Step 1 — Clone the Repository
```bash
git clone https://github.com/<your-username>/project-management-app.git
cd project-management-app
```

### 🪄 Step 2 — Install Dependencies
```bash
npm install
```

### 🪄 Step 3 — Run the App
```bash
npx expo start
```

### 🪄 Step 4 — Connect to Your Phone
- Open **Expo Go** on your mobile device  
- Scan the **QR Code** shown in your terminal or browser  
- The app will open instantly on your phone 🎉  

> Every time you save a file, the app auto-refreshes on your device.

---

## 🧱 Run on Web or Emulator

- Web:
  ```bash
  npm run web
  ```
- Android emulator:
  ```bash
  npm run android
  ```
- iOS simulator (Mac only):
  ```bash
  npm run ios
  ```

---

## 📦 Build an APK (Offline App)

To generate an installable APK for Android:
```bash
npx expo prebuild
npx expo run:android
```

APK will be saved at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

You can transfer this file to any Android phone and install it manually.

---

## 💾 Data Persistence
- All data is stored using **AsyncStorage** (local storage on device)
- No backend or server required
- Data stays saved even after app restarts

---

## 💡 Troubleshooting
If progress bars don’t move:
1. Ensure you entered a valid **Estimated Time** when creating a project  
2. Make sure you clicked **Start Project** and confirmed it  
3. Background timers must not be restricted in Expo Go  
4. For testing, set `fastProgress: true` inside `ProjectDetail.js`

---

## 👨‍💻 Author
**Developer:** [Your Name]  
**GitHub:** [https://github.com/YourUsername](https://github.com/YourUsername)  
**Technologies:** React Native, Expo, AsyncStorage, React Navigation

---

## 🧠 License
This project is open-source. You can use or modify it freely for learning or development.
