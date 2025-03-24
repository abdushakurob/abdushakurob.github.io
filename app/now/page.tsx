'use client'
import { useState } from "react";

const nowUpdates = [
  { id: 1, title: "Sketching & Vectorizing Logos", category: "Exploring", description: "Daily practice of sketching 20 logos and vectorizing at least 15. Some turn out good, some don’t. But it’s the process that matters." },
  { id: 2, title: "Sui Move & Blockchain", category: "Learning", description: "Understanding Move, Web3 concepts, and decentralized systems. This is a deep dive, and I’m still figuring things out." },
  { id: 3, title: "Building My Portfolio", category: "Building", description: "Refining this site, adding more projects, making it reflect my work better." },
];

// Goals & Challenges
const goals = [
  { id: 1, goal: "Build and launch a full SaaS product before July 2025", status: "In Progress" },
  { id: 2, goal: "Participate in at least one major hackathon in 2025", status: "Upcoming" },
  { id: 3, goal: "Become comfortable with Sui Move and deploy a project", status: "In Progress" },
];

const dailyTasks = [
  { id: 1, task: "Sketch 20 logo ideas", completed: false },
  { id: 2, task: "Vectorize at least 15 logos", completed: false },
  { id: 3, task: "Write a daily log (even if it’s just a note)", completed: false },
];

const weeklyTasks = [
  { id: 1, task: "Ship one complete brand identity concept", completed: false },
  { id: 2, task: "Push a feature update to a project", completed: false },
  { id: 3, task: "Post progress update on social media", completed: false },
];

const monthlyTasks = [
  { id: 1, task: "Launch a mini-project", completed: false },
  { id: 2, task: "Do a deep-dive into a new skill", completed: false },
  { id: 3, task: "Write a reflection post on progress and lessons", completed: false },
];

export default function Now() {
  const [daily, setDaily] = useState(dailyTasks);
  const [weekly, setWeekly] = useState(weeklyTasks);
  const [monthly, setMonthly] = useState(monthlyTasks);

  const toggleTask = (list, setList, id) => {
    setList(list.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <h1 className="text-4xl font-bold text-green-600 mb-6">What I’m Working On</h1>
      <p className="text-lg text-gray-600">
        This page holds me accountable. A mix of what I’m doing now, goals I’ve set, challenges I’m taking on, 
        and a checklist for daily, weekly, and monthly targets.
      </p>

      {/* What I’m Doing Now */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-blue-500">What I’m Doing Now</h2>
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
