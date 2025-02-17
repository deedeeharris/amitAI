# Bot Generator Project Context

## Project Overview
The Bot Generator is a web application designed for Amit Educational Network teachers to create AI-powered educational bots. The application allows teachers to create, customize, and manage learning companion bots that can assist students in various subjects.

## Project Structure
```
frontend/
├── index.html                # Main entry point, contains bot library view
├── pages/
│   ├── my-bots.html         # Personal bot collection page
│   ├── create-bot.html      # Bot creation wizard
│   └── bot-details.html     # Individual bot view/edit page
├── styles/
│   ├── main.css             # Global styles, variables, and common components
│   ├── library.css          # Bot library specific styles
│   ├── my-bots.css          # Personal collection styles
│   └── create-bot.css       # Bot creation wizard styles
├── js/
│   ├── common/
│   │   ├── config.js        # Global configuration (API endpoints, constants)
│   │   ├── api.js           # API interaction utilities
│   │   └── utils.js         # Shared helper functions
│   ├── components/
│   │   ├── preview.js       # Bot chat preview functionality
│   │   ├── steps.js         # Creation wizard step navigation
│   │   └── forms.js         # Form handling and validation
│   ├── pages/
│   │   ├── library.js       # Bot library page logic
│   │   ├── my-bots.js       # Personal collection management
│   │   └── create-bot.js    # Bot creation wizard logic
│   └── state/
│       └── store.js         # State management and persistence
└── assets/
    ├── icons/               # UI icons and graphics
    └── images/              # Static images and resources

## Key Features

### 1. Bot Library (index.html)
- Browse existing bots
- Search and filter functionality
- Quick preview and test options
- Categories and tags

### 2. My Bots (my-bots.html)
- Personal bot collection
- Edit and delete capabilities
- Usage statistics
- Sharing options

### 3. Bot Creation (create-bot.html)
- Step-by-step wizard interface
- Basic info configuration
- Data source management
- Prompt and scenario setup
- Real-time preview

### 4. Bot Preview Component
- Real-time chat simulation
- Voice selection
- Temperature adjustment
- Dynamic responses

## Technical Details

### State Management
- Local storage for persistence
- Real-time form autosave
- Cross-page state maintenance

### API Integration
- Mock services for development
- Structured API utilities
- Error handling patterns

### Styling
- RTL (Right-to-Left) support
- Responsive design
- CSS variables for theming
- Mobile-first approach

### JavaScript Architecture
- Modular component design
- Event-driven interactions
- Async/await patterns
- Form validation

## Current Implementation Status

### Completed Features
- Basic navigation structure
- Form layouts and styling
- Preview component base
- Step navigation logic

### In Progress
- State management implementation
- API integration
- Advanced form validation
- Real-time preview enhancements

### Pending
- Advanced search functionality
- User authentication
- Bot sharing capabilities
- Analytics integration

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
- RTL Support: Yes

### Components
- Border Radius: 8px
- Shadow: 0 2px 4px rgba(0,0,0,0.1)
- Spacing: 8px, 16px, 24px units

## Development Workflow
1. Feature branch creation
2. Local development
3. Testing and validation
4. Pull request submission
5. Code review
6. Merge to main branch

## Testing Requirements
- Cross-browser compatibility
- Mobile responsiveness
- RTL layout verification
- Form validation
- State persistence
- Preview functionality

---

To request a new feature or modification, please provide:
1. Feature description
2. Target page/component
3. Expected behavior
4. Any specific requirements
5. Priority level

Example request:
"Please implement the temperature control slider in the create-bot.html page. It should:
- Allow values between 0 and 1
- Update in real-time
- Persist across page reloads
- Show current value
- Affect bot preview responses
Priority: High"
