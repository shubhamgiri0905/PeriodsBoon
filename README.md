# PeriodsBoon

PeriodsBoon is a supportive menstrual cycle tracker and logging companion. It empowers users with knowledge about their bodies while fostering well-being through empathy-driven design.

## Features

- **Daily Logging:** Track period flow, symptoms, moods, and notes.
- **Cycle Predictions:** Get predictions for your next period and fertile window.
- **Personal Insights:** Receive daily affirmations, tips, and symptom insights.
- **Calendar View:** Visualize your cycle, symptoms, and predictions.
- **Journal:** Privately record thoughts and reflections with tags.
- **Data Privacy:** All data is stored locally on your device for maximum privacy.
- **Tutorial:** Guided onboarding to help you get started.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/PeriodsBoon.git
   cd PeriodsBoon
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Development

Start the development server:

```sh
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

To build for production:

```sh
npm run build
# or
yarn build
```

### Linting & Type Checking

```sh
npm run lint
npm run typecheck
```

## Project Structure

- `src/` - Main application source code
  - `components/` - React components (Dashboard, Calendar, Insights, Journal, Layout, Tutorial, Auth)
  - `contexts/` - React context providers (e.g., Auth)
  - `utils/` - Utility functions (insights, predictions, storage)
  - `types/` - TypeScript types and interfaces

## Technologies Used

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## Privacy

Your data is stored locally in your browser. PeriodsBoon does not share your personal information with any third parties.

## License

MIT

---

Made with ❤️ for your well-being.