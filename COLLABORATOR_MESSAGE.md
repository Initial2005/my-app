Hello 👋

You've been invited to collaborate on the repository Initial2005/my-app. Below are simple, copy-paste steps to accept the invite, set up SSH (recommended), and get started.

1) Accept the invitation
- Check the email you used for GitHub or visit https://github.com/notifications and accept the repository invitation.

2) Clone the repo (SSH recommended)
```bash
# clone over SSH (preferred)
git clone git@github.com:Initial2005/my-app.git
cd my-app
```

If you prefer HTTPS, use:
```bash
git clone https://github.com/Initial2005/my-app.git
cd my-app
```

3) (Optional but recommended) Configure SSH keys so you won't need to enter browser/device codes in future
```bash
# generate a new key (if you don't already have one)
ssh-keygen -t ed25519 -C "your_email@example.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
# print your public key to copy into GitHub -> Settings -> SSH and GPG keys
cat ~/.ssh/id_ed25519.pub
```

4) Install dependencies & run locally
```bash
npm install
npm start
```

5) Branching & PR workflow (short)
- Create a feature branch: `git checkout -b feat/short-description`
- Make changes, commit, push: `git push -u origin feat/short-description`
- Open a Pull Request on GitHub. `CODEOWNERS` will auto-request @TanuDubey-13, @TanuGupta2108, and @Vaish1004 as reviewers for PRs.

6) Troubleshooting
- If you don't see the invitation: check https://github.com/settings/repository_invitations
- If `git push` asks for browser/device authentication and you'd prefer not to use it, configure SSH as above.

If you want, reply here and I'll add a short welcome message that you can paste into a team chat (WhatsApp/Slack) to help everyone accept and get started.
