# EcoAlerte - Environmental Awareness Platform

## Overview

EcoAlerte is a French-language environmental awareness web platform designed for the "IA For Good" hackathon. The project aims to educate users about ecological issues through interactive content, quizzes, and actionable advice. The platform uses AI-generated content to create engaging educational experiences with the motto "Chaque clic compte pour la planète" (Every click counts for the planet).

## System Architecture

### Frontend Architecture
- **Framework**: Traditional HTML templates with Jinja2 templating
- **Styling**: Bootstrap 5.3.0 for responsive design with custom CSS
- **JavaScript**: Vanilla JavaScript for interactivity (quiz functionality, animations, counters)
- **Icons**: Font Awesome 6.4.0 for consistent iconography
- **Fonts**: Google Fonts (Poppins) for modern typography

### Backend Architecture
- **Framework**: Flask 3.1.1 (Python web framework)
- **Application Structure**: Simple Flask app with route-based architecture
- **Session Management**: Flask sessions with secret key configuration
- **Logging**: Python's built-in logging module for debugging

## Key Components

### 1. Web Pages
- **Homepage** (`/`): Hero section with compelling environmental messaging and call-to-action
- **Information Page** (`/info`): Environmental data, statistics, and educational content
- **Quiz Page** (`/quiz`): Interactive environmental knowledge quiz with scoring
- **Actions Page** (`/actions`): Practical eco-friendly tips categorized by home, transport, food, and waste
- **Share Page** (`/share`): Social media integration for spreading awareness

### 2. API Endpoints
- **Quiz Submission** (`/api/quiz/submit`): POST endpoint for handling quiz answers and calculating scores
- Scoring logic with predefined correct answers for environmental questions

### 3. Static Assets
- **CSS**: Custom styling with CSS variables for ecological color scheme (greens, blues)
- **JavaScript**: 
  - `script.js`: General site functionality, animations, counters
  - `quiz.js`: Interactive quiz logic with timer and progress tracking

## Data Flow

1. **User Navigation**: Users access different pages through Flask routes
2. **Quiz Interaction**: 
   - Frontend collects quiz answers via JavaScript
   - Answers submitted to `/api/quiz/submit` endpoint
   - Backend processes answers and returns results
3. **Content Display**: Jinja2 templates render dynamic content
4. **Social Sharing**: JavaScript functions handle social media integration

## External Dependencies

### Python Packages
- **Flask 3.1.1**: Web framework
- **Flask-SQLAlchemy 3.1.1**: Database ORM (prepared for future database integration)
- **Gunicorn 23.0.0**: WSGI HTTP server for production deployment
- **psycopg2-binary 2.9.10**: PostgreSQL adapter (for future database needs)
- **email-validator 2.2.0**: Email validation utilities

### Frontend Libraries
- **Bootstrap 5.3.0**: CSS framework via CDN
- **Font Awesome 6.4.0**: Icon library via CDN
- **Google Fonts**: Poppins font family via CDN
- **Chart.js**: Charting library for quiz results visualization

## Deployment Strategy

### Development Environment
- **Runtime**: Python 3.11 on Nix stable-24_05
- **Development Server**: Flask development server with debug mode
- **Hot Reload**: Gunicorn with `--reload` flag for development

### Production Deployment
- **Platform**: Replit autoscale deployment
- **Web Server**: Gunicorn bound to 0.0.0.0:5000
- **Process Management**: Gunicorn handles multiple workers
- **Environment**: Nix-based environment with OpenSSL and PostgreSQL packages

### Configuration
- **Session Secret**: Environment variable `SESSION_SECRET` with fallback
- **Port Configuration**: Configurable via environment, defaults to 5000
- **Logging**: DEBUG level logging enabled for development

## Changelog

Changelog:
- June 18, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.