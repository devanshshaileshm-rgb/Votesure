# VoteSecure — GitHub Pages Demo

This is a **static HTML/CSS/JavaScript demonstration** designed to publish on GitHub Pages. It does not require XAMPP, PHP, Composer, Node.js, MySQL, or a build step.

## Publish on GitHub Pages

1. Extract this ZIP.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the **root** of your GitHub repository (not inside another nested folder).
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose branch `main` and folder `/ (root)`, then click **Save**.
6. Wait for the deployment to finish. The Pages settings screen will show the published site link.

For repository `devanshshaileshm-rgb/Votesure`, the expected URL is:
https://devanshshaileshm-rgb.github.io/Votesure/

## Features

- Voter name/email registration
- Simulated six-digit OTP verification (code appears on screen)
- Candidate selection and one vote per email in the same browser
- Results dashboard
- Demo account status and reset option
- Responsive layout

## Important limitations

This is a browser-only educational demo. Data is stored in that browser's `localStorage`; it is not shared across devices or users, and users can modify local data. The OTP is not sent by SMS/email. There is no real backend, secure identity verification, or production-grade election security. Do not use real voter data or use it for real elections.
