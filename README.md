# Bot Generator (מחולל מלווי למידה)

## Overview
The Bot Generator is a web application designed for Amit Educational Network teachers to create AI-powered educational bots. The application enables teachers to create, customize, and manage learning companion bots that can assist students in various subjects.

## Project Structure
```
frontend/
├── index.html                # Main entry point
├── pages/                    # Individual page templates
├── styles/                   # CSS stylesheets
├── js/                      
│   ├── common/              # Shared utilities and configuration
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page-specific logic
│   └── state/               # State management
└── assets/                  # Static resources
```

## Key Features
- Bot Library with search and filtering
- Personal bot collection management
- Step-by-step bot creation wizard
- Real-time bot preview and testing
- RTL (Right-to-Left) support for Hebrew
- Responsive, mobile-first design

## Technical Stack
- HTML5
- CSS3 (with CSS Variables)
- Vanilla JavaScript (ES6+)
- Local Storage for persistence
- RESTful API integration

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local development server

### Installation
1. Clone the repository:
```bash
git clone [repository-url]
cd bot-generator
```

2. Set up a local development server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

3. Open `http://localhost:8000` in your browser

## Development

### Code Organization
- `js/common/`: Shared utilities and configuration
  - `config.js`: Global settings and constants
  - `api.js`: API communication layer
  - `utils.js`: Helper functions

- `js/components/`: Reusable UI components
  - `preview.js`: Bot chat preview
  - `steps.js`: Wizard navigation
  - `forms.js`: Form handling

- `js/pages/`: Page-specific logic
  - `library.js`: Bot library
  - `my-bots.js`: Personal collection
  - `create-bot.js`: Bot creation

### Styling
- Mobile-first approach
- RTL support for Hebrew
- CSS Variables for theming
- Responsive breakpoints

### State Management
- Local Storage for persistence
- Real-time form autosave
- Cross-page state maintenance

## Pages Implementation

### 1. Bot Library (index.html)
The main entry point of the application, displaying a collection of available bots.

#### Features
- Browse existing bots in a grid/list view
- Search and filter functionality
- Quick preview and testing
- Sort by various criteria
- Share bot capabilities

#### Status
- ✅ Basic layout and structure
- ✅ Preview component
- ❌ Search implementation
- ❌ Filter system
- ❌ Sharing mechanism

### 2. My Bots (my-bots.html)
Personal bot management page for teachers.

#### Features
- Personal bot collection
- Usage statistics
- Quick edit and delete options
- Bot duplication
- Export capabilities

#### Status
- ✅ Basic layout
- ✅ Bot list view
- ❌ Statistics integration
- ❌ CRUD operations
- ❌ Export system

### 3. Create Bot (create-bot.html)
Step-by-step bot creation wizard.

#### Features
- Multi-step creation process
- Real-time preview
- Source material management
- Voice and personality settings
- Deployment options

#### Status
- ✅ Wizard navigation
- ✅ Form layouts
- ✅ Preview component
- ❌ File upload system
- ❌ Deployment options

### 4. Bot Details (bot-details.html)
Detailed view and management of individual bots.

#### Features
- Comprehensive bot information
- Usage analytics
- Chat history
- Settings management
- Integration options

#### Status
- ✅ Basic layout
- ❌ Analytics dashboard
- ❌ Chat history
- ❌ Settings panel
- ❌ Integration tools

## Development Status

### Completed Components
- ✅ Global configuration
- ✅ API service layer
- ✅ Utility functions
- ✅ Preview component
- ✅ Basic navigation
- ✅ RTL support

### In Progress
- 🔄 Search functionality
- 🔄 Form validation
- 🔄 State management
- 🔄 Mobile optimization

### Pending
- ❌ User authentication
- ❌ Analytics integration
- ❌ Advanced search
- ❌ File management
- ❌ Deployment system

## Contributing
1. Create a feature branch
2. Implement changes
3. Test thoroughly
4. Submit a pull request

## Testing
- Cross-browser compatibility
- Mobile responsiveness
- RTL layout verification
- Form validation
- State persistence
- Preview functionality

## Design Guidelines

### Colors
- Primary: #2196F3
- Secondary: #FFC107
- Surface: #FFFFFF
- Background: #F5F5F5
- Text: #333333

### Typography
- Font Family: Assistant
- Heading Sizes: 24px, 20px, 16px
- Body Text: 14px

### Components
- Border Radius: 8px
- Shadow: 0 2px 4px rgba(0,0,0,0.1)
- Spacing: 8px, 16px, 24px units

## License
[License details to be added]

## Contact
[Contact information to be added]
