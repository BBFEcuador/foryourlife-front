## 🚀 Features

- **Framework:** Vue 3 with TypeScript.
- **Styling:** Vuetify and Tailwind CSS for modern interfaces.
- **State Management:** Pinia with state persistence.
- **Form Validation:** Vee-Validate and Yup.
- **Interactive Charts:** Integration with ApexCharts.
- **Internationalization:** Multi-language support using Vue I18n.
- **Animations and Dynamic Design:** Uses AOS, Lottie, and auto-animate.
- **Notifications and Alerts:** Implemented with Vue SweetAlert2 and Vue3 Toastify.
- **Printing:** Print support with Vue3 Print NB.

## 📂 Project Structure

The project structure follows best practices for Vue 3 with Vite. The `src` directory contains the main components, views, routes, and configurations.

```
src/
├── assets/       # Static resources like images and fonts
├── components/   # Reusable Vue components
├── views/        # Main application views
├── store/        # State management with Pinia
├── router/       # Routing configuration with Vue Router
├── plugins/      # Plugin configurations
└── main.ts       # Main entry point
```

## 📦 Key Dependencies

This project includes a wide range of modern libraries and tools:

- **UI and Components:** Vuetify, Tailwind CSS, Vue3 Carousel, Vue Easy Lightbox.
- **State Management:** Pinia with persistence plugin.
- **Validations:** Vee-Validate, Yup, and Vuelidate.
- **Charts and Tables:** ApexCharts, Vue3 ApexCharts, Vue3 Easy Data Table.
- **Notifications:** Vue SweetAlert2, Vue3 Toastify.
- **Internationalization:** Vue I18n.
- **Utilities:** Lodash, Moment.js, Axios.

## 🛠️ Installation

Follow these steps to install and run the project locally:

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/matdash.git
   cd matdash
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

To generate optimized production files, run:

```bash
npm run build
```

The output files will be in the `dist` directory.

## 🧪 Available Scripts

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the project for production.
- **`npm run preview`**: Previews the production build on port `5050`.
- **`npm run typecheck`**: Runs TypeScript type checking.
- **`npm run lint`**: Runs ESLint to check and fix formatting issues.

