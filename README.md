# Kehilas Lev V'Nefesh Website

Kehilas Lev V'Nefesh is a vibrant shteeble located in Bergenfield, New Jersey, dedicated to serving its community with a place of worship, learning, and gathering. This website is designed to provide community members with information on minyan times, announcements, event sponsorship opportunities, and more.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup and Installation](#setup-and-installation)
- [API Documentation](#api-documentation)
- [License](#license)
- [Contact Information](#contact-information)

## Features

- **Minyan Times**: Dynamic listing of daily and special minyan times.
- **Announcements**: Timely updates and important community information.
- **Sponsorship**: Opportunities for community members to sponsor events or programs.
- **File Uploads**: Ability for admins to upload important documents and files.
- **User Management**: Admin capabilities to manage minyan times and announcements.

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Payment Processing**: Stripe Integration for sponsorships
- **Hosting/Deployment**: Heroku

## Setup and Installation

To get the website running locally:

1. Clone the repo:
```bash
    git clone https://github.com/yaakovdavidovici/kehilaslevvnefesh-website.git
```
npm install
```
```
## Deployment

To deploy this project run

```
npm start
```

## API Reference

### Minyan Management

#### Get All Minyan Times

```http
GET /api/minyan
```

#### Get Specific Minyan Time

```http
GET /api/minyan/{id}
```

#### Add A Minyan Time

```http
POST /api/minyan
```

#### Update A Minyan By ID

```http
PUT /api/minyan/{id}
```

#### Delete A Minyan

```http
DELETE /api/minyan/{id}
```

#### Delete All Minyanim

```http
DELETE /api/minyan
```

### File Management

#### Upload a File

```http
POST /api/upload
```

#### Get Latest Uploaded File

```http
GET /api/files
```

#### Download a File

```http
GET /api/download
```

#### Delete All Files

```http
DELETE /api/files
```

### Announcement Management

#### Create an Announcement

```http
POST /api/announcement
```

#### Get All Announcements

```http
GET /api/announcement
```

#### Delete Specific Announcement

```http
DELETE /api/announcement/{id}
```

#### Clear All Announcements

```http
DELETE /api/announcement
```

### Authentication and User Management

#### Admin Login

```http
POST /admin/login
```

#### Admni Logout

```http
GET /logout
```

#### Check Authentication Status

```http
GET /api/auth/check
```

## Authors

- [Yaakov Davidovici](https://www.github/yaakovdavidovici)

## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)
