## In-Browser SQL Terminal

A browser-based SQL terminal that runs entirely client-side using SQL.js (WebAssembly). Practice SQL queries with a pre-loaded schema and sample data, with your work automatically saved in localStorage.

## Feb 9, 2025

##  Features

- No backend required - runs completely in your browser
- Persistent storage using localStorage
- Pre-loaded schema and sample data
- SQL query execution with real-time results
- Support for common SQL operations (SELECT, INSERT, UPDATE, DELETE, etc.)
- Practice problems with hints and solutions
- Syntax highlighting for SQL queries
- Table schema viewer
- Keyboard shortcuts (Ctrl/Cmd + Enter to execute queries)

##  Tech Stack

- React 18.3
- Vite
- SQL.js (WebAssembly-based SQLite)
- Tailwind CSS
- Shadcn/ui Components
- PrismJS for syntax highlighting
- LocalStorage for data persistence

##  Prerequisites

- Node.js (v18.18.0 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sql-terminal.git
cd sql-terminal
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Configuration

The project uses Vite for development and building. Key configurations:

- `vite.config.js`: Contains WASM configuration and SQL.js setup
- `tailwind.config.js`: Tailwind CSS customization
- Default database schema is defined in `src/context/DatabaseContext.jsx`

## Database Schema

The application comes with a pre-loaded schema including:

- Departments
- Employees
- Offices
- Projects
- Employee Projects

Sample data is automatically loaded when you first launch the application.

## WebAssembly (SQL.js) Setup

This project uses SQL.js, a WebAssembly-based SQLite implementation. The WASM file is loaded from:

```javascript
locateFile: (file) => `https://sql.js.org/dist/${file}`
```

To use a local copy instead:

1. Download SQL.js files from [sql.js releases](https://github.com/sql-js/sql.js/releases)
2. Place `sql-wasm.wasm` in your public directory
3. Update the locateFile path in `DatabaseContext.jsx`

## Key Features Usage

### Query Execution
- Type SQL queries in the editor
- Press Ctrl/Cmd + Enter or click Execute
- Results display in a table format below

### Practice Problems
- Access pre-made SQL problems from the menu
- Problems include hints and solutions
- Copy solutions directly to the query editor

### Schema Viewer
- Click "Show Schema" to view table structures
- Includes column names, types, and constraints

## CORS Configuration

The application requires specific CORS headers for WebAssembly:

```javascript
headers: {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
}
```

## Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request



