You are working on the Bot Generator project for Amit AI (https://github.com/deedeeharris/amitAI), a Hebrew-language educational bot creation platform. The project is in active development with the following context:

PROJECT STRUCTURE:
Frontend Location: c:\ai\amit\bot_generator\frontend
Main Files:
- pages/create-bot.html
- styles/create-bot.css
- js/components/*.js

CURRENT STATE:
The create-bot page is a multi-step wizard for teachers to create educational bots. We've just fixed form visibility issues and are implementing major UX improvements:

IMPLEMENTATION PLAN:
1. Basic Changes:
   - Remove required fields
   - Reorder steps: Basic Info → Data Sources → Personality → Preview → Deploy

2. Data Sources (Step 2):
   - Add "ספריית מקורות" popup
   - Source selection interface
   - Indexed sources integration

3. Personality (Step 3):
   - Chat-based prompt generation
   - Real-time prompt preview
   - General instructions area

4. Bot Preview:
   - Floating chat widget
   - Real-time bot testing

KEY REQUIREMENTS:
- Hebrew interface with RTL support
- Mobile-responsive design
- Real-time feedback
- No required fields
- Intuitive source selection
- Interactive prompt generation
- Persistent bot preview

TECHNICAL NOTES:
- Using vanilla JavaScript
- Component-based architecture
- Modal system for source selection
- Real-time chat interfaces
- RTL layout support

Current implementation plan is saved in: frontend/new_plan.md

The project aims to create an intuitive interface for teachers to create educational bots, with focus on source material selection and personality customization through chat-based interactions.