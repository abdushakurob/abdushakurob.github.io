"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type ProgressItem = {
  id: number;
  title: string;
  category: "Exploring" | "Building" | "Learning";
  progress: string;
  total: number | null;
  description: string;
};

type Goal = {
  id: number;
  goal: string;
  status: "In Progress" | "Upcoming" | "Completed";
};

type Task = {
  id: number;
  task: string;
  completed: boolean;
};

// ✅ Sample dynamic API data (will be fetched from backend)
const progressData: ProgressItem[] = [
  { id: 1, title: "Sketching Logos", category: "Exploring", progress: "15/30", total: 30, description: "Sketching & vectorizing 20+ logos daily." },
  { id: 2, title: "Sui Move & Blockchain", category: "Learning", progress: "30%", total: null, description: "Understanding Move, Web3 concepts, and decentralized systems." },
  { id: 3, title: "Building My Portfolio", category: "Building", progress: "80%", total: null, description: "Refining this site, adding more projects, making it reflect my work better." },
];

// ✅ Goals and challenges
const goals: Goal[] = [
  { id: 1, goal: "Launch a SaaS product before July 2025", status: "In Progress" },
  { id: 2, goal: "Participate in a major hackathon this year", status: "Upcoming" },
  { id: 3, goal: "Deploy my first Sui Move project", status: "In Progress" },
  { id: 4, goal: "Get my first paid gig from my projects", status: "Upcoming" },
  { id: 5, goal: "Grow my online presence by sharing my work", status: "In Progress" },
];

// ✅ Daily, weekly, and monthly task trackers
const dailyTasks: Task[] = [
  { id: 1, task: "Sketch 20 logo ideas", completed: false },
  { id: 2, task: "Vectorize at least 15 logos", completed: false },
  { id: 3, task: "Write a daily log update", completed: false },
];

const weeklyTasks: Task[] = [
  { id: 1, task: "Ship one complete brand identity", completed: false },
  { id: 2, task: "Push a feature update to a project", completed: false },
  { id: 3, task: "Post progress on social media", completed: false },
];

const monthlyTasks: Task[] = [
  { id: 1, task: "Launch a mini-project", completed: false },
  { id: 2, task: "Do a deep dive into a new skill", completed: false },
  { id: 3, task: "Write a reflection on progress & lessons", completed: false },
];

export default function Now() {
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [daily, setDaily] = useState(dailyTasks);
  const [weekly, setWeekly] = useState(weeklyTasks);
  const [monthly, setMonthly] = useState(monthlyTasks);

  useEffect(() => {
    // Simulate fetching progress updates
    setProgress(progressData);
  }, []);

  const toggleTask = (list: Task[], setList: React.Dispatch<React.SetStateAction<Task[]>>, id: number) => {
    setList(list.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <h1 className="text-4xl font-bold text-green-600 mb-6">What I’m Working On</h1>
      <p className="text-lg text-gray-600">
        This is my **build-in-public** accountability corner.  
        Tracking what I’m currently working on, my progress, and the challenges I’ve set for myself.
      </p>

      {/* ✅ Live Progress Tracker */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-blue-500">Live Progress</h2>
        <div className="space-y-6 mt-4">
          {progress.map((update) => (
            <div key={update.id} className="card bg-base-200 shadow-lg p-6">
              <h2 className="text-xl font-semibold text-blue-500">{update.title}</h2>
              <p className="text-gray-600">{update.category} • Progress: {update.progress}</p>
              <p className="text-gray-600 mt-2">{update.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Goals & Challenges */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-blue-500">Goals & Challenges</h2>
        <div className="space-y-4 mt-4">
          {goals.map(goal => (
            <div key={goal.id} className="card bg-base-200 shadow-lg p-4 flex justify-between items-center">
              <p className="text-gray-600">{goal.goal}</p>
              <span className={`px-3 py-1 rounded-lg text-white ${goal.status === "In Progress" ? "bg-yellow-500" : "bg-gray-500"}`}>
                {goal.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Task Checklists */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-blue-500">Daily, Weekly & Monthly Goals</h2>

        {/* Daily Tasks */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-green-600">Daily</h3>
          <ul className="list-none mt-2">
            {daily.map(task => (
              <li key={task.id} className="flex items-center space-x-3">
                <input type="checkbox" checked={task.completed} onChange={() => toggleTask(daily, setDaily, task.id)} />
                <p className={`text-gray-600 ${task.completed ? "line-through" : ""}`}>{task.task}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Last Updated */}
      <p className="text-gray-500 text-sm mt-10">Last updated: just now</p>
    </div>
  );
}
