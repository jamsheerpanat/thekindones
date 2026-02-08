# Deploying Multiple Websites on Hostinger VPS (KVM4)

This guide will walk you through setting up your VPS to host **The Kind Ones** and other future websites using Nginx as a reverse proxy and PM2 for process management.

## 1. Initial VPS Setup
Connect to your VPS via SSH (`ssh root@your_vps_ip`). Then run these commands to install necessary tools:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (Latest LTS)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (Process Manager) globally
sudo npm install -g pm2

# Install Nginx (Web Server)
sudo apt install nginx -y

# Install Certbot (For Free SSL)
sudo apt install certbot python3-certbot-nginx -y
```

## 2. Deploying "The Kind Ones" (Website #1)

### Step A: Transfer Project Logic
Upload your project files to the VPS (e.g., to `/var/www/thekindones`).
*   **Method 1 (Git):** Push your code to GitHub, then `git clone` on the VPS.
*   **Method 2 (SFTP):** Use FileZilla or `scp` to copy files directly.

### Step B: Build & Setup
On the VPS, navigate to your project folder:
```bash
cd /var/www/thekindones

# Install dependencies
npm install

# Generate Prisma Client (Database)
npx prisma generate

# Build the Next.js app
npm run build
```

### Step C: Start with PM2
We've included an `ecosystem.config.js` file in the project root. Use it to start the app:

```bash
pm2 start ecosystem.config.js
pm2 save  # Saves the process list so it restarts on reboot
pm2 startup # Generates startup script (run the output command it gives you)
```
*Your app is now running internally on port `3000`.*

### Step D: Configure Nginx (Public Access)
Create a new Nginx configuration file for your domain:

```bash
sudo nano /etc/nginx/sites-available/thekindones
```

Paste the following configuration (replace `yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000; # Points to The Kind Ones (Port 3000)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/thekindones /etc/nginx/sites-enabled/
sudo nginx -t # Test for syntax errors
sudo systemctl restart nginx
```

### Step E: Secure with SSL (HTTPS)
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 3. Adding a Second Website (Website #2)

To host another website on the same VPS, simply repeat the process but use a **different port**.

1.  **Transfer & Build:** Upload your second project (e.g., `/var/www/my-second-site`).
2.  **Start on New Port:** When starting with PM2, specify a different port (e.g., `3001`).
    ```bash
    # Inside the second project folder:
    PORT=3001 pm2 start npm --name "second-site" -- start
    ```
3.  **New Nginx Config:** Create a new file `/etc/nginx/sites-available/second-site` and set `proxy_pass` to port **3001**.
    ```nginx
    server {
        listen 80;
        server_name second-site.com;

        location / {
            proxy_pass http://localhost:3001; # Different Port!
        }
    }
    ```
4.  **Enable & Secure:** Link the file, restart Nginx, and run Certbot for the new domain.

## Summary of Ports
*   **The Kind Ones:** Localhost:3000 -> `thekindones.com`
*   **Second Site:** Localhost:3001 -> `second-site.com`
*   **Third Site:** Localhost:3002 -> `third-site.com`
