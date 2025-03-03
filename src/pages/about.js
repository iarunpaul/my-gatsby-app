import React from "react";
import useRotateText from "../hooks/useRotateText";
import Layout from "../components/layout";

const AboutPage = () => {
  const rotatingText = useRotateText(["passion.", "fun.", "a journey.", "LIFE."], 200);

  return (
    <Layout pageTitle="About Page">
      <div className="container mx-auto p-4">
        <div className="title">
          <h1 className="text-4xl font-bold">
            Programming is <code className="text-blue-500">{rotatingText}</code>
          </h1>
        </div>
        <p className="mt-4">
          Here's a bit about me. I'm a software architect who loves to build things.
          I'm passionate about learning new technologies and sharing my knowledge with others.
          I'm excited to see what the future holds and can't wait to see where my career takes me.
        </p>
        <hr className="my-4" />
        <h3 className="text-2xl font-semibold">Here's a bit about me</h3>
        <ul className="list-disc list-inside mt-2">
          <li>👨‍🎓 Currently Studying at...</li>
          <li>🎮 Fun thing you have done...</li>
          <li>🖥️ Your work experience...</li>
          <li>👨‍🏭 Interesting project you have worked on</li>
          <li>🚵‍♂️ Hobbies...</li>
        </ul>
        <hr className="my-4" />
        <h3 className="text-2xl font-semibold">My Tech Stack</h3>
        <ul className="list-disc list-inside mt-2">
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
      </div>
    </Layout>
  );
};

export default AboutPage;