"use client"

import React, { useState } from 'react'; // <-- 1. Import useState
import { Github, Linkedin, Twitter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Developer data - easy to update
const developers = [
  {
    name: "Humanshu Ise",
    role: "Full-Stack Developer & UI Designer",
    avatar: <img src="/humanshu.jpg" alt="Humanshu Ise" className="w-24 h-24 rounded-full pixel-border transition-transform duration-300 hover:scale-110" />,
    bio: "The visionary behind CodeRiot's immersive interface and real-time architecture. Specializes in React, WebSocket technologies, and crafting user experiences that feel like the future.",
    links: {
      github: "https://github.com/HumanshuIse",
      linkedin: "https://linkedin.com/in/humanshu-ise",
      twitter: "https://twitter.com/bithumanshu",
    }
  },
  {
    name: "Aditya Shelar",
    role: "Full-Stack Developer & Algorithm Engineer",
    avatar: <img src="/aditya.png" alt="Aditya Shelar" className="w-24 h-24 rounded-full pixel-border transition-transform duration-300 hover:scale-110" />,
    bio: "The powerhouse who engineered the smart matchmaking system and robust FastAPI backend. Passionate about graph algorithms, database optimization, and ensuring every battle is fair and fast.",
    links: {
      github: "https://github.com/aditya7276",
      linkedin: "https://linkedin.com/in/aditya-shelar06",
      twitter: "https://twitter.com/aditya57275163",
    }
  }
];

const SocialLink = ({ href, icon, label }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors duration-300 font-tech">
        {icon}
        <span>{label}</span>
    </a>
);


const AboutUs = () => {
    // <-- 2. Add state to track the enlarged avatar's source URL
    const [enlargedAvatar, setEnlargedAvatar] = useState(null);

    const fontPixelClassName = "font-pixel bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-shadow-neon";
    const fontTechClassName = "font-tech text-gray-300";
    const cardClassName = "bg-gray-900/70 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-700 pixel-border animate-glow-slow h-full flex flex-col";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center py-12 px-4 relative z-10">
        <div className="w-full max-w-5xl">
            <div className="text-center mb-12">
                <h1 className={`text-4xl md:text-5xl ${fontPixelClassName} mb-4`}>
                    Meet the Developers
                </h1>
                <p className={`text-lg ${fontTechClassName} max-w-3xl mx-auto`}>
                    The two-person team that brought the CodeRiot arena to life.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {developers.map((dev) => (
                    <Card key={dev.name} className={cardClassName}>
                        <CardHeader className="text-center">
                            {/* <-- 3. Make the avatar clickable --> */}
                            <div
                                className="mx-auto mb-4 cursor-pointer"
                                onClick={() => setEnlargedAvatar(dev.avatar.props.src)}
                            >
                                {dev.avatar}
                            </div>
                            <CardTitle className="text-3xl font-pixel text-white">
                                {dev.name}
                            </CardTitle>
                            <p className="font-tech text-purple-400">{dev.role}</p>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between">
                            <p className="text-gray-400 font-tech text-center mb-6">
                                {dev.bio}
                            </p>
                            <div className="flex justify-center items-center space-x-6 border-t border-gray-800 pt-4 mt-auto">
                                <SocialLink href={dev.links.github} icon={<Github className="w-5 h-5"/>} label="GitHub" />
                                <SocialLink href={dev.links.linkedin} icon={<Linkedin className="w-5 h-5"/>} label="LinkedIn" />
                                <SocialLink href={dev.links.twitter} icon={<Twitter className="w-5 h-5"/>} label="Twitter" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="text-center mt-16">
                 <h2 className={`text-3xl ${fontPixelClassName} mb-4`}>
                    Our Philosophy
                </h2>
                <p className={`text-base ${fontTechClassName} max-w-3xl mx-auto text-gray-400`}>
                    We built CodeRiot with a passion for competitive programming and a love for retro aesthetics. Our goal was to create a platform that is not only challenging and fair but also fun and visually engaging. Every line of code was written with the community in mind.
                </p>
            </div>
        </div>

        {/* <-- 4. Add the Modal for the enlarged avatar --> */}
        <div
            // This container handles the blurred background and closing functionality
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${enlargedAvatar ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setEnlargedAvatar(null)} // Click background to close
        >
            <img
                src={enlargedAvatar}
                alt="Enlarged Avatar"
                // Prevent the click on the image itself from closing the modal
                onClick={(e) => e.stopPropagation()}
                // This class handles the smooth scaling of the image
                className={`max-w-[90vw] max-h-[90vh] rounded-full object-contain pixel-border shadow-2xl shadow-cyan-500/50 transition-transform duration-300 ease-in-out ${enlargedAvatar ? 'scale-100' : 'scale-90'}`}
            />
        </div>
    </div>
  );
};

export default AboutUs;