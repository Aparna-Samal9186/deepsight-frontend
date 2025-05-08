"use client"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card.jsx"
import { Button } from "./ui/button.jsx"
import ImageUpload from "./ImageUpload"
import WebcamCapture from "./WebcamCapture"
import axios from 'axios';

const StatsCard = ({ title, value, percentage, color }) => {
    return (
        <div className="card shadow-sm hover:shadow-md transition-shadow">
            <div className="card-header pb-2">
                <h3 className="text-gray-700">{title}</h3>
            </div>
            <div className="card-content">
                <div className={`text-2xl font-bold text-${color}-900`}>{value}</div>
                <p className={`text-xs text-${percentage > 0 ? "green" : "amber"}-600 mt-1`}>
                    {percentage > 0 ? `+${percentage}% from last month` : `${percentage}% from last month`}
                </p>
            </div>
        </div>
    );
};


const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("overview")
    const [missingPersons, setMissingPersons] = useState([]);
    const [stats, setStats] = useState({
        totalIdentifications: 0,
        foundCount: 0,
        activeCases: 0,
    });
    const [loading, setLoading] = useState(true);

    // const [missingPersons] = useState([
    //     {
    //         _id: "1",
    //         name: "John Doe",
    //         age: 35,
    //         lost_location: "New York City",
    //         timestamp: new Date("2025-04-16T10:00:00Z"),
    //     },
    //     {
    //         _id: "2",
    //         name: "Jane Smith",
    //         age: 28,
    //         lost_location: "Los Angeles",
    //         timestamp: new Date("2025-04-15T15:30:00Z"),
    //     },
    //     { _id: "3", name: "Peter Jones", age: 42, lost_location: "Chicago", timestamp: new Date("2025-04-14T08:45:00Z") },
    //     { _id: "4", name: "Alice Brown", age: 19, lost_location: "Houston", timestamp: new Date("2025-04-13T20:12:00Z") },
    //     {
    //         _id: "5",
    //         name: "Bob Williams",
    //         age: 60,
    //         lost_location: "Philadelphia",
    //         timestamp: new Date("2025-04-12T12:55:00Z"),
    //     },
    //     { _id: "6", name: "Eva Garcia", age: 22, lost_location: "Phoenix", timestamp: new Date("2025-04-11T18:20:00Z") },
    //     {
    //         _id: "7",
    //         name: "Carlos Martinez",
    //         age: 51,
    //         lost_location: "San Antonio",
    //         timestamp: new Date("2025-04-10T09:00:00Z"),
    //     },
    //     {
    //         _id: "8",
    //         name: "Sophia Rodriguez",
    //         age: 12,
    //         lost_location: "San Diego",
    //         timestamp: new Date("2025-04-09T14:05:00Z"),
    //     },
    //     { _id: "9", name: "David Lee", age: 70, lost_location: "Dallas", timestamp: new Date("2025-04-08T22:30:00Z") },
    //     { _id: "10", name: "Olivia Hall", age: 25, lost_location: "San Jose", timestamp: new Date("2025-04-07T07:10:00Z") },
    // ])

    useEffect(() => {
        axios.get('http://localhost:8000/missing-persons')
            .then(res => setMissingPersons(res.data))
            .catch(err => console.error('Error fetching data:', err));
    }, []);

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString(); // e.g., 4/19/2025
    }

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/stats");
                const data = await response.json();
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching stats:", error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fixed inset-0 flex bg-gray-50">
            {/* Sidebar - fixed height with scrolling */}
            <div className="w-64 bg-white border-r shadow-sm overflow-y-auto">
                <div className="p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
                </div>
                <div className="p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`text-left w-full px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "overview" ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("uploadImage")}
                        className={`text-left w-full px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "uploadImage" ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Upload Image
                    </button>
                    <button
                        onClick={() => setActiveTab("webcamCapture")}
                        className={`text-left w-full px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "webcamCapture" ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Webcam Capture
                    </button>
                </div>
            </div>

            {/* Main Content - fixed height with scrolling */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4 md:p-6 max-w-full">
                    {activeTab === "overview" && (
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left column */}
                            <div className="flex flex-col space-y-12 lg:w-3/5">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-gray-700">Total Identifications</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-gray-900">{stats.totalIdentifications}</div>
                                            <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-gray-700">Missing Persons Found</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-gray-900">{stats.foundCount}</div>
                                            <p className="text-xs text-green-600 mt-1">+5% from last month</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-gray-700">Active Cases</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-gray-900">{stats.activeCases}</div>
                                            <p className="text-xs text-amber-600 mt-1">+8% from last month</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Chart - reduced height */}
                                <Card className="shadow-sm bg-white">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-gray-800">Identification Trends</CardTitle>
                                        <CardDescription className="text-gray-500">Monthly trend of total identifications</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="relative h-40 md:h-48 bg-gray-50 rounded-md border border-gray-200">
                                            {/* Animated Bar Chart (Gray Theme) */}
                                            <div
                                                className="absolute bottom-0 left-4 w-[16%] bg-gray-400 rounded-t-md"
                                                style={{ height: "20%", animation: "grow-bar 2s ease-in-out infinite alternate" }}
                                            >
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-xs text-gray-600 mb-1">
                                                    Jan
                                                </div>
                                            </div>
                                            <div
                                                className="absolute bottom-0 left-[20%] w-[16%] ml-4 bg-gray-500 rounded-t-md"
                                                style={{ height: "50%", animation: "grow-bar 2.5s ease-in-out 0.5s infinite alternate" }}
                                            >
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-xs text-gray-600 mb-1">
                                                    Feb
                                                </div>
                                            </div>
                                            <div
                                                className="absolute bottom-0 left-[40%] w-[16%] ml-4 bg-gray-600 rounded-t-md"
                                                style={{ height: "80%", animation: "grow-bar 3s ease-in-out 1s infinite alternate" }}
                                            >
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-xs text-gray-600 mb-1">
                                                    Mar
                                                </div>
                                            </div>
                                            <div
                                                className="absolute bottom-0 left-[60%] w-[16%] ml-4 bg-gray-500 rounded-t-md"
                                                style={{ height: "60%", animation: "grow-bar 2.8s ease-in-out 1.5s infinite alternate" }}
                                            >
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-xs text-gray-600 mb-1">
                                                    Apr
                                                </div>
                                            </div>
                                            <div
                                                className="absolute bottom-0 left-[80%] w-[16%] ml-4 bg-gray-400 rounded-t-md"
                                                style={{ height: "40%", animation: "grow-bar 2.2s ease-in-out 2s infinite alternate" }}
                                            >
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-xs text-gray-600 mb-1">
                                                    May
                                                </div>
                                            </div>
                                            <style>
                                                {`
          @keyframes grow-bar {
              0% {
                  transform: scaleY(0.85);
                  transform-origin: bottom;
              }
              100% {
                  transform: scaleY(1);
                  transform-origin: bottom;
              }
          }
        `}
                                            </style>
                                        </div>
                                    </CardContent>
                                </Card>

                            </div>

                            {/* Missing person list - right column */}
                            <Card className="lg:w-2/5 shadow-sm">
                                <CardHeader className="pb-2 border-b sticky top-0 bg-white z-10">
                                    <CardTitle className="text-lg font-semibold text-gray-800">
                                        Recently Reported Missing Persons
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="max-h-[calc(100vh-12rem)] overflow-auto no-scrollbar rounded-xl border border-gray-200 shadow-sm">
                                        <Table className="min-w-full text-sm text-left text-gray-700">
                                            <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                                                <TableRow>
                                                    <TableHead className="px-4 py-3 font-semibold text-gray-600">Name</TableHead>
                                                    <TableHead className="px-4 py-3 font-semibold text-gray-600">Age</TableHead>
                                                    <TableHead className="px-4 py-3 font-semibold text-gray-600">Location</TableHead>
                                                    <TableHead className="px-4 py-3 font-semibold text-gray-600">Date</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {[...missingPersons]
                                                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                                    .map((person, index) => (
                                                        <TableRow
                                                            key={person._id}
                                                            className={`transition-all hover:bg-gray-50 cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                                }`}
                                                        >
                                                            <TableCell className="px-4 py-3 font-medium">{person.name}</TableCell>
                                                            <TableCell className="px-4 py-3">{person.age || "N/A"}</TableCell>
                                                            <TableCell className="px-4 py-3">{person.lost_location || "N/A"}</TableCell>
                                                            <TableCell className="px-4 py-3">{formatDate(person.timestamp)}</TableCell>
                                                        </TableRow>
                                                    ))}

                                            </TableBody>
                                        </Table>

                                    </div>

                                </CardContent>
                                <CardFooter className="border-t bg-gray-50 py-2 sticky bottom-0">
                                    <Button variant="outline" size="sm" className="ml-auto">
                                        View All
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    )}

                    {activeTab === "uploadImage" && (
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Upload Image</CardTitle>
                                <CardDescription>Upload an image from your local device to identify missing persons.</CardDescription>
                            </CardHeader>
                            <CardContent className="max-h-[calc(100vh-6rem)] overflow-auto no-scrollbar">
                                <ImageUpload />
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "webcamCapture" && (
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Webcam Capture</CardTitle>
                                <CardDescription>Capture an image using your webcam to identify missing persons.</CardDescription>
                            </CardHeader>
                            <CardContent className="max-h-[calc(100vh-12rem)] overflow-auto no-scrollbar">
                                <WebcamCapture />
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
