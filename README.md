# Client/Freelancer Platform Backend

## Introduction
This is the frontend repository for a client/freelancer platform where clients can post jobs and freelancers can apply for those jobs. The backend is built using Spring Security with JWT authentication for handling user authentication. Users can register as either clients or freelancers, and their respective profiles are managed accordingly.

## Features
- **User Authentication:** Registration and login system with JWT authentication.
- **Roles:** Two main roles: Client and Freelancer.
- **Client Functionality:**
  - View profile information, including contact info, company data, and socials.
  - View the number of live jobs and archived jobs.
  - View a list of freelancers with details.
  - Manage projects: view, archive, delete, or unarchive jobs.
  - View job applicants along with their messages.
  - Create new job postings with various fields such as description, required skills, salary type, and job type.
- **Freelancer Functionality:**
  - View their own profile information.
  - Browse available projects posted by clients.
  - Apply for jobs with a personalized message to the client.
