# AI Bot Playground for Teachers – Frontend

Welcome to the AI Bot Playground for Teachers! This project enables educators to design, configure, and deploy AI bots tailored for classroom use. Teachers can select from a rich set of modular features to customize their bot's behavior, personality, and data sources. Once a bot is configured, the backend processes the setup and returns a unique Bot ID, which can then be embedded into course settings for student interaction.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [File Structure](#file-structure)
- [Development Timeline](#development-timeline)
- [Flow Diagram](#flow-diagram)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Overview

The AI Bot Playground for Teachers is a web-based platform that empowers educators to create customized AI assistants for their classrooms. This frontend repository contains all the necessary components for the user interface and interaction logic.

## Key Features

- Intuitive bot creation wizard
- Real-time bot preview
- Customizable bot personality
- Multiple data source integration
- Dynamic prompt configuration
- Hebrew and English language support
- Voice selection options
- Temperature control for response variation
- File upload capabilities
- Scenario-based configuration

## Architecture & Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Local Storage for state management
- Mock services for development

## File Structure

```
frontend/
├── index.html
├── styles/
│   └── main.css
├── js/
│   ├── main.js
│   ├── navigation.js
│   ├── autosave.js
│   ├── botPreview.js
│   ├── mockService.js
│   ├── dataSourcesScreen.js
│   └── scenarioScreen.js
└── README.md
```

## Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/deedeeharris/amitAI.git
cd amitAI/frontend
```

2. Open `index.html` in your browser to start using the application.

## Usage

1. Click "יצירת מלווה למידה חדש" to start creating a new bot
2. Follow the three-step wizard:
   - Basic Information
   - Data Sources
   - Scenario Configuration
3. Preview your bot in real-time
4. Save and deploy when ready

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
