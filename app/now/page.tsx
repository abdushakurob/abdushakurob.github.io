"use client";
import { useState } from "react";

type Task = {
  id: number;
  task: string;
  completed: boolean;
};

type Goal = {
  id: number;
  goal: string;
  status: "In Progress" | "Upcoming" | "Completed";
};

const nowUpdates = [
  { id: 1, title: "Sketching & Vectorizing Logos", category: "Exploring", description: "Daily practice of sketching 20 logos and vectorizing at least 15. Some turn out good, some don’t. But it’s the process that matters." },
  { id: 2, title: "Sui Move & Blockchain", category: "Learning", description: "Understanding Move, Web3 concepts, and decentralized systems. This is a deep dive, and I’m still figuring things out." },
  { id: 3, title: "Building My Portfolio", category: "Building", description: "Refining this site, adding more projects, making it reflect my work better." },
];

// Long-Term Goals & Challenges
const goals: Goal[] = [
  { id: 1, goal: "Build and launch a full SaaS product before July 2025", status: "In Progress" },
  { id: 2, goal: "Participate in at least one major hackathon in 2025", status: "Upcoming" },
  { id: 3, goal: "Become comfortable with Sui Move and deploy a project", status: "In Progress" },
  { id: 4, goal: "Get my first paid gig from my projects", status: "Upcoming" },
  { id: 5, goal: "Grow my online presence by consistently sharing my process", status: "In Progress" },
];

// Task Checklists
const dailyTasks: Task[] = [
  { id: 1, task: "Sketch 20 logo ideas", completed: false },
  { id: 2, task: "Vectorize at least 15 logos", completed: false },
  { id: 3, task: "Write a daily log (even if it’s just a note)", completed: false },
];

const weeklyTasks: Task[] = [
  { id: 1, task: "Ship one complete brand identity concept", completed: false },
  { id: 2, task: "Push a feature update to a project", completed: false },
  { id: 3, task: "Post progress update on social media", completed: false },
];

const monthlyTasks: Task[] = [
  { id: 1, task: "Launch a mini-project", completed: false },
  { id: 2, task: "Do a deep-dive into a new skill", completed: false },
  { id: 3, task: "Write a reflection post on progress and lessons", completed: false },
];

export default function Now() {
  const [daily, setDaily] = useState<Task[]>(dailyTasks);
  const [weekly, setWeekly] = useState<Task[]>(weeklyTasks);
  const [monthly, setMonthly] = useState<Task[]>(monthlyTasks);

  const toggleTask = (list: Task[], setList: React.Dispatch<React.SetStateAction<Task[]>>, id: number) => {
    setList(list.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <h1 className="text-4xl font-bold text-green-600 mb-6">What I’m Working On</h1>
      <p className="text-lg text-gray-600">
        This is my accountability corner. A mix of things I’m working on, what I plan to do, 
        goals I’ve set, challenges I’m pushing myself into, and my daily/weekly/monthly checklist.
      </p>

      {/* What I’m Doing Now */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-blue-500">What I’m Doing Now</h2>
        <p className="text-gray-600 mt-2">
          These are the things currently keeping me busy. Some are ongoing projects, some are experiments, 
          and some are things I’m forcing myself to stay consistent with.
        </p>
        <div className="space-y-6 mt-4">
          {nowUpdates.map((update) => (
            <div key={update.id} className="card bg-base-200 shadow-lg p-6">
              <h2 className="text-xl font-semibold text-blue-500">{update.title}</h2>
              <p className="text-gray-600">{update.category}</p>
              <p className="text-gray-600 mt-2">{update.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Goals & Challenges */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-blue-500">Goals & Challenges</h2>
        <p className="text-gray-600 mt-2">
          These are bigger things I’m aiming for. Some of them are long-term goals, some are challenges 
          I’ve set for myself to get uncomfortable and grow.
        </p>
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

      {/* Checklists */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-blue-500">Daily, Weekly & Monthly Goals</h2>
        <p className="text-gray-600 mt-2">
          These are the things I’m tracking regularly. If I stay consistent, I know I’ll make progress.  
          (And if I don’t, I’ll have proof that I need to stop slacking).
        </p>

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

        {/* Weekly Tasks */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-green-600">Weekly</h3>
          <ul className="list-none mt-2">
            {weekly.map(task => (
              <li key={task.id} className="flex items-center space-x-3">
                <input type="checkbox" checked={task.completed} onChange={() => toggleTask(weekly, setWeekly, task.id)} />
                <p className={`text-gray-600 ${task.completed ? "line-through" : ""}`}>{task.task}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Monthly Tasks */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-green-600">Monthly</h3>
          <ul className="list-none mt-2">
            {monthly.map(task => (
              <li key={task.id} className="flex items-center space-x-3">
                <input type="checkbox" checked={task.completed} onChange={() => toggleTask(monthly, setMonthly, task.id)} />
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
