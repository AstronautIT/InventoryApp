# BeerInventoryApp

A modern web application for managing craft beer store inventory. Built with Node.js, Express, and SQLite.

## Features

- 🍺 **Browse Beers**: View all beers in a clean, modern grid layout
- ➕ **Add Beers**: Add new beers with details like name, SKU, price, quantity (cases), and beer type
- ✏️ **Edit Beers**: Update beer information and quantities
- 🗑️ **Delete Beers**: Remove beers from inventory
- 🔍 **Search**: Search beers by name, SKU, description, or beer type
- 📊 **Statistics**: View total beers, inventory value, and low stock alerts
- 🎨 **Modern UI**: Responsive design with beer-themed amber color scheme

## Installation

1. Clone the repository:
```bash
git clone https://github.com/AstronautIT/InventoryApp.git
cd InventoryApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Pre-populated Database

The application comes with a SQLite database pre-populated with 20 craft beer products across different styles:
- Lagers
- Ales
- IPAs
- Stouts & Porters
- Wheat Beers
- Sours

Each beer entry includes:
- Beer name
- Description with ABV and flavor profile
- Price per case
- Current stock quantity
- Beer type/category
- Unique SKU

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: SQLite with better-sqlite3
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Modern CSS with amber/beer-themed color scheme

## API Endpoints

- `GET /api/products` - Get all beers
- `GET /api/products/:id` - Get a single beer
- `POST /api/products` - Create a new beer entry
- `PUT /api/products/:id` - Update a beer
- `DELETE /api/products/:id` - Delete a beer

## Project Structure

```
InventoryApp/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # CSS styling (beer-themed)
│   └── app.js          # Frontend JavaScript
├── database.js         # Database initialization with beer products
├── server.js           # Express server
├── package.json        # Dependencies
└── README.md          # Documentation
```

## License

MIT