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

### User Profile

- `GET /user/:userId` - Fetch user profile
- `PUT /user/:userId` - Update user profile
- `DELETE /user/profile` - Delete user profile
- `GET /user/:userId/matched-users` - Fetch matched users

### Messaging

- `POST /messages` - Send a message
- `GET /messages/:chatId` - Fetch previous messages
- `PUT /messages/:chatId/read` - Mark messages as read
