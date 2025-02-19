# DataFoot

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.0.

# Sportner

Sportner is a social networking application designed to connect sports enthusiasts. Users can create profiles, swipe through potential matches, chat with matched users, and manage their sports interests.

## Table of Contents

- [Features](#features)

- [API Endpoints](#api-endpoints)

## Features

- User registration and authentication
- Profile creation and management
- Swipe functionality to find matches based on sports interests
- Real-time messaging with matched users
- View and manage partner requests
- Geolocation-based matching

- ## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate a user and return a JWT token

### User Profile

- `GET /user/:userId` - Fetch user profile
- `PUT /user/:userId` - Update user profile
- `DELETE /user/profile` - Delete user profile
- `GET /user/:userId/matched-users` - Fetch matched users

### Swiping

- `POST /swiping/like` - Like a user
- `POST /swiping/dislike` - Dislike a user

### Notifications

- `GET /notifications/:userId` - Fetch notifications for a user

### Messages

- `POST /messages` - Send a message
- `GET /messages/:chatId` - Fetch previous messages
- `PUT /messages/:chatId/read` - Mark messages as read

### Partner

- `GET /partner/requests` - Fetch partner requests
- `POST /partner/accept` - Accept a partner request
- `POST /partner/decline` - Decline a partner request

### Likes

- `GET /like/:userId` - Fetch likes for a user

### Matches

- `GET /match/:userId` - Fetch matches for a user
