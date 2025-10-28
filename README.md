# BrainChainPSIT - Learning Platform

A comprehensive learning platform built with React, featuring programming courses, interview questions, discussion forums, and certificates.

## 🌟 Features

- **📚 Course Library** - Free courses on Python, JavaScript, React, Java, C++, and more
- **📖 Interactive Learning** - Step-by-step lessons with code examples and quizzes
- **💼 Interview Prep** - LeetCode and HackerRank style coding questions
- **💬 Discussion Forum** - Community discussions and solution sharing
- **🏆 Certificates** - Earn certificates and badges on course completion
- **📊 Progress Tracking** - Track your learning progress in real-time
- **🌙 Dark/Light Theme** - Toggle between themes
- **📱 Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### For Developers

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Open in browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

### For Deployment (WhatsApp Sharing)

**Option 1: Use the deployment script (Easiest)**
```bash
./deploy.sh
```
Then choose option 1 (Vercel) and follow the prompts.

**Option 2: Manual Vercel deployment**
```bash
npm install -g vercel
vercel
```

**Option 3: Build for production**
```bash
npm run build
```

📖 **See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions**

## 📱 Sharing on WhatsApp

After deploying to Vercel/Netlify, you'll get a link like:
- `https://your-app.vercel.app`

Share this link on WhatsApp with a message like:
```
🎓 Check out BrainChainPSIT - Free Learning Platform!

🔗 https://your-app.vercel.app

✅ Free programming courses
✅ Interview questions
✅ Discussion forum  
✅ Earn certificates

Try it now! 🚀
```

## 🛠️ Tech Stack

- **React** 19.2.0
- **lucide-react** - Icons
- **CSS3** - Styling with animations
- **Create React App** - Build tooling

## 📂 Project Structure

```
my-app/
├── public/           # Static files
├── src/
│   ├── components/   # React components
│   │   ├── Header.js
│   │   ├── Sidebar.js
│   │   ├── Dashboard.js
│   │   ├── Explore.js
│   │   ├── CourseViewer.js
│   │   ├── Interview.js
│   │   ├── Discuss.js
│   │   ├── Certificates.js
│   │   └── Problems.js
│   ├── App.js       # Main app component
│   └── index.js     # Entry point
├── deploy.sh        # Deployment helper script
└── DEPLOYMENT_GUIDE.md  # Detailed deployment guide
```

## 🎯 Main Sections

1. **Home** - Dashboard with stats and progress
2. **Explore** - Browse and enroll in courses
3. **Problems** - Coding challenges
4. **Interview** - Interview preparation questions
5. **Discuss** - Community forum
6. **Certificates** - View earned certificates and badges

## 📚 Course Features

- Video lessons
- Reading materials
- Code examples with syntax highlighting
- Interactive quizzes
- Progress tracking
- Certificate generation on completion

## 🏆 Achievement System

- Completion badges
- Course certificates
- Progress statistics
- Downloadable certificates

## Available Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
