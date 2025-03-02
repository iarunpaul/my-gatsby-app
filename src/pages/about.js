import React from "react";
import useRotateText from "../hooks/useRotateText";
import "../hooks/about.css"; // Add styles if needed
import Layout from "../components/layout";

const AboutPage = () => {
  const rotatingText = useRotateText(["passion.", "fun.", "a journey.", "LIFE."], 200);

  return (
    <Layout pageTitle="About Page">
        <div className="container">
            <div className="title">
                <h1>
                Programming is <code>{rotatingText}</code>
                </h1>
            </div>
            <p>
                Here's a bit about me. I'm a software architect who loves to build things.
                I'm passionate about learning new technologies and sharing my knowledge with others.
                I'm excited to see what the future holds and can't wait to see where my career takes me.
            </p>
            <hr />
            <h3>Here's a bit about me</h3>
            <ul>
                <li>👨‍🎓 Currently Studying at...</li>
                <li>🎮 Fun thing you have done...</li>
                <li>🖥️ Your work experience...</li>
                <li>👨‍🏭 Interesting project you have worked on</li>
                <li>🚵‍♂️ Hobbies...</li>
            </ul>
            <hr />
            <h3>My Tech Stack</h3>
            <ul>
                <li>📜 TypeScript</li>
                <li>🅰️ Angular</li>
                <li>🖥️ Bash</li>
                <li>☁️ Azure</li>
                <li>⛵ Kubernetes</li>
                <li>🐳 Docker</li>
                <li>🐍 Python</li>
                <li>🔥 Firebase</li>
                <li>📱 Flutter</li>
                <li>📦 Nx</li>
                <li>Java: ☕</li>
                <li>C#: 🔷</li>
            </ul>
            <hr />
            <div className="git-stats"></div>
        </div>
    </Layout>
   
  );
};

export default AboutPage;
