# How to Publish Your Website on GitHub Pages

## Step 1: Add and Commit Your Files

Run these commands in your terminal (from the repository directory):

```bash
# Add all files to git
git add .

# Commit with a message
git commit -m "Initial commit: Academic website setup"

# Push to GitHub
git push -u origin main
```

## Step 2: Enable GitHub Pages

1. Go to your GitHub repository: https://github.com/sarshaw/sarshaw.github.io
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch and **/ (root)** folder
6. Click **Save**

## Step 3: Wait for Build

- GitHub Pages will automatically build your site (takes 1-2 minutes)
- You'll see a green checkmark when it's done
- Your site will be live at: **https://sarshaw.github.io**

## Step 4: Verify Your Site

- Visit https://sarshaw.github.io after a few minutes
- If you see your site, you're done! 🎉

## For Future Updates

Whenever you make changes:

```bash
git add .
git commit -m "Description of your changes"
git push
```

GitHub Pages will automatically rebuild your site within 1-2 minutes.

## Troubleshooting

- If your site doesn't appear after 10 minutes, check the **Actions** tab in your GitHub repo for build errors
- Make sure your `_config.yml` has the correct URL: `https://sarshaw.github.io`
- Ensure you've pushed to the `main` branch (not `master`)

