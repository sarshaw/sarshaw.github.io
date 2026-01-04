# Troubleshooting 404 Error on GitHub Pages

## Common Issues and Solutions

### 1. Check GitHub Pages Settings
- Go to: https://github.com/sarshaw/sarshaw.github.io/settings/pages
- Verify:
  - **Source**: `Deploy from a branch`
  - **Branch**: `main` (or `master` if that's your default)
  - **Folder**: `/ (root)`
  - Click **Save**

### 2. Check Build Status
- Go to: https://github.com/sarshaw/sarshaw.github.io/actions
- Look for any failed builds (red X)
- If there are errors, check the build logs

### 3. Wait for Build
- After pushing changes, wait 1-2 minutes for GitHub to build
- You'll see a green checkmark when it's done

### 4. Repository Name Must Match
- Repository must be exactly: `sarshaw.github.io`
- Username must match: `sarshaw`
- I've already fixed this in `_config.yml`

### 5. Clear Browser Cache
- Try accessing in incognito/private mode
- Or clear your browser cache

### 6. Check the URL
- Make sure you're visiting: **https://sarshaw.github.io** (not http://)
- Wait a few minutes after first publish

### 7. Force Rebuild
If the site still doesn't work, try forcing a rebuild:

```bash
git commit --allow-empty -m "Trigger GitHub Pages rebuild"
git push
```

### 8. Check for Jekyll Errors
- Go to Actions tab and check for any build errors
- Common issues:
  - Syntax errors in `_config.yml`
  - Missing required files
  - Plugin issues

### 9. Verify Files Are Pushed
Make sure all files are committed and pushed:

```bash
git status  # Should show "nothing to commit, working tree clean"
git log --oneline -3  # Should show your commits
```

### 10. Check GitHub Pages Build Logs
- Go to: Settings > Pages > Build and deployment
- Check "View deployment" to see build status
- Look for any error messages

## Still Not Working?

1. Check if the repository is public (required for free GitHub Pages)
2. Verify the branch name is `main` (not `master`)
3. Make sure `_config.yml` has correct URL: `https://sarshaw.github.io`
4. Wait 5-10 minutes after first publish (can take time to propagate)

