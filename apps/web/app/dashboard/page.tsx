"use client"

import { motion } from "framer-motion"
import { WelcomeBanner } from "./_components/welcome-banner"
import { CourseCard } from "./_components/course-card"
import { AchievementCard } from "./_components/achievement-card"
import { RightSidebar } from "./_components/right-sidebar"

const courses = [
    { 
        title: "Advanced Physics", 
        instructor: "Linda Cruz", 
        lessons: 3, 
        progress: 85, 
        image: "/dashboard/physics.png",
        color: "bg-blue-50 dark:bg-blue-900/20"
    },
    { 
        title: "Organic Chemistry", 
        instructor: "Jonathan Reyes", 
        lessons: 5, 
        progress: 60, 
        image: "/dashboard/chemistry.png",
        color: "bg-purple-50 dark:bg-purple-900/20"
    },
    { 
        title: "Pure Mathematics", 
        instructor: "Sarah Chen", 
        lessons: 2, 
        progress: 92, 
        image: "/dashboard/maths.png",
        color: "bg-orange-50 dark:bg-orange-900/20"
    },
]

const achievements = [
    {
        title: "Inorganic Chemistry",
        type: "Certificate",
        color: "bg-yellow-50 dark:bg-yellow-900/20",
        iconColor: "bg-yellow-400"
    },
    {
        title: "Social Philosophy",
        type: "Certificate",
        color: "bg-purple-50 dark:bg-purple-900/20",
        iconColor: "bg-purple-400"
    }
]

export default function DashboardPage() {
    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
            {/* Main Content Area */}
            <div className="flex-1 p-8 lg:p-10 space-y-10 overflow-hidden">
                
                {/* Welcome Section */}
                <WelcomeBanner />

                {/* Courses Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">My Courses</h2>
                        <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View All</button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course, index) => (
                            <motion.div
                                key={course.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <CourseCard {...course} />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Achievements Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Achievements</h2>
                        <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View All</button>
                    </div>

                    <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                        {achievements.map((achievement, index) => (
                            <motion.div
                                key={achievement.title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                            >
                                <AchievementCard {...achievement} />
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Right Sidebar Section */}
            <div className="hidden xl:block">
                <RightSidebar />
            </div>
        </div>
    )
}
