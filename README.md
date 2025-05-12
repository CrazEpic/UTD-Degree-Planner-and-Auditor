# UTD Degree Planner and Auditor

## Project Overview

### Participants

| Person  | Role |
| ------------- | ------------- |
| Dr. Nandika D'Souza  | Project Sponsor  |
| Daniel Nguyen  | Developer  |
| Hayden Rogers  | Developer  |

### Problem we are addressing 

- Navigating degree requirements can be complex due to prerequisite chains, corequisite dependencies, and transfer credit evaluation, often leading to inefficient course planning, extended graduation timelines, and unnecessary coursework. 
- Academic advisors must continuously update degree plans to reflect curriculum changes across different catalog years. 
- Students need a way to track their degree progress and the ability to create plans that align with their current situation. 
  - E.g. student who wants to graduate in the shortest amount of time but has to limit their hours for a certain semester. Which courses are most important? 

### Solution

Placeholder

### Future Considerations

Placeholder

## Tech Stack

- **Frontend:** React.js
- **Backend:** Express.js
- **Database:** SQLite with Prisma ORM

## Setting Up Development Environment (local)

Ensure Node.js, npm, Visual Studio Code, Git are installed. Ensure that everyone is working on the latest Long-Term-Support (LTS) Node.js version.

Usually, you can get away with using Git Bash (on its own or within VS Code) as your terminal.

### Install the repo

```bash
git clone https://github.com/CrazEpic/UTD-Degree-Planner-and-Auditor.git
cd UTD-Degree-Planner-and-Auditor
npm install
```

### Set up environment variables

```bash
# Fill out the environment variables accordingly
cp .env.example .env
```

### Database Setup

```bash
# Initialize the database and test data seeding
npx prisma migrate dev --name init
```

### Running the Application

```bash
npm run dev
```

### Useful Dev Tips

#### Prettier Formatting

```bash
npm run format
```

#### Prisma

```bash
# Prisma GUI to view database
npx prisma studio
```

#### Postman

Use Postman to test HTTP, SSE, and WebSockets. Keep in mind that some features like SSE do not work on the Postman extension for VSCode, so have the Postman desktop app for full functionality.

## Deploying the Application (AWS EC2)*
*This is a test setup for now. There is probably a more efficient and secure way to do this. We have to manually set up the SQLite database locally since the database seeding needs more than 1 GB of ram.

**AWS EC2 Details**
- **Amazon Machine Image (AMI):** Amazon Linux 2023 AMI
- **Instance Type:** t2.micro

### Local Building
```
git clone https://github.com/CrazEpic/UTD-Degree-Planner-and-Auditor.git
cd UTD-Degree-Planner-and-Auditor
npm install
cp .env.example .env
# Set up the database locally
npx prisma migrate dev --name init
```

Make sure to zip UTD-Degree-Planner-and-Auditor in order to copy UTD-Degree-Planner-and-Auditor.zip to AWS.

### Copy and Setup on AWS
```bash
# Copy the zip file to the EC2 instance
scp -i ./YOUR_KEY.pem /path/to/UTD-Degree-Planner-and-Auditor.zip ec2-user@AWS_PUBLIC_IPV4_DNS:/home/ec2-user/
# SSH into the EC2 instance
ssh -i "YOUR_KEY.pem" ec2-user@AWS_PUBLIC_IPV4_DNS
# Install NVM and Node.js (LTS version)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
# Unzip the project and set it up
unzip UTD-Degree-Planner-and-Auditor.zip rm UTD-Degree-Planner-and-Auditor.zip cd UTD-Degree-Planner-and-Auditor
# Clean install
rm -rf node_modules/ package-lock.json npm install
# Run the production build
npm run prod
```

## Documentation and Considerations

Placeholder
