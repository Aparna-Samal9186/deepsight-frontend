import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { Camera, Loader2, Upload } from "lucide-react"

import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Separator } from "./ui/separator"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

const WebcamCapture = () => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [missingPersonData, setMissingPersonData] = useState({
        name: '',
        age: '',
        lostLocation: '',
        description: '',
        contact: ''
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
            console.error("getScreenshot() returned null — webcam may not be ready");
            return;
        }
        setImgSrc(imageSrc);
    };

    const dataURLtoBlob = (dataurl) => {
        console.log("dataurl:", dataurl);  // 🔍 Debug the image
        if (!dataurl || !dataurl.startsWith("data:image")) {
            console.error("Invalid or missing data URL");
            return null;
        }

        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    const handleSubmitMissingPerson = async () => {
        if (!imgSrc) {
            console.error("imgSrc is null — cannot submit");
            return;
        }

        const blob = dataURLtoBlob(imgSrc);
        if (!blob) {
            console.error("Blob conversion failed");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', blob, 'captured_image.jpeg');
            formData.append('name', missingPersonData.name || 'Unknown');
            formData.append('age', missingPersonData.age || '0');
            formData.append('lost_location', missingPersonData.lostLocation || 'Unknown');
            formData.append('description', missingPersonData.description || 'Unknown');
            formData.append('contact', missingPersonData.contact || 'Unknown');

            // Debug log
            console.log("🧾 FormData:");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await axios.post(
                'http://localhost:8000/identify_missingPerson',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setResult(response.data);
            console.log("✅ API response:", response.data);
        } catch (error) {
            console.error('❌ Error submitting missing person info:', error);
            setResult({ error: 'Failed to submit missing person info.' });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setImgSrc(null)
        setMissingPersonData({
            name: "",
            age: "",
            lostLocation: "",
            description: "",
            contact: "",
        })
        setResult(null)
    }

    return (
        <div className="container mx-auto py-0 px-6">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Missing Person Identification</CardTitle>
                    <CardDescription>Capture a photo and provide details about the missing person</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex flex-col items-center space-y-4">
                            {/* Webcam View */}
                            <div className="aspect-video w-full overflow-hidden rounded-lg border border-border relative">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    className="w-full h-full object-cover"
                                    width={640}
                                    height={480}
                                    videoConstraints={{
                                        width: 640,
                                        height: 480,
                                        facingMode: "user"
                                    }}
                                />
                            </div>
                            <Button onClick={capture} className="w-full md:w-auto" size="lg">
                                <Camera className="mr-2 h-4 w-4" />
                                Capture Photo
                            </Button>
                        </div>

                        {/* Captured Image & Form */}
                        <div className="space-y-4">
                            {imgSrc ? (
                                <div className="space-y-4">
                                    <div className="aspect-video relative rounded-lg border border-border overflow-hidden">
                                        <img src={imgSrc || "/placeholder.svg"} alt="Captured" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button variant="outline" onClick={resetForm} size="sm">
                                            Retake Photo
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-video flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/50">
                                    <div className="text-center">
                                        <Camera className="mx-auto h-10 w-10 text-muted-foreground" />
                                        <p className="mt-2 text-sm text-muted-foreground">Captured image will appear here</p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {imgSrc && (
                        <>
                            <Separator />

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Missing Person Details</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name">Name</label>
                                        <Input
                                            id="name"
                                            placeholder="Full name"
                                            value={missingPersonData.name}
                                            onChange={(e) => setMissingPersonData({ ...missingPersonData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="age">Age</label>
                                        <Input
                                            id="age"
                                            placeholder="Age"
                                            type="number"
                                            value={missingPersonData.age}
                                            onChange={(e) => setMissingPersonData({ ...missingPersonData, age: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="lostLocation">Last Seen Location</label>
                                        <Input
                                            id="lostLocation"
                                            placeholder="Where the person was last seen"
                                            value={missingPersonData.lostLocation}
                                            onChange={(e) => setMissingPersonData({ ...missingPersonData, lostLocation: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="contact">Contact Information</label>
                                        <Input
                                            id="contact"
                                            placeholder="Phone number or email"
                                            value={missingPersonData.contact}
                                            onChange={(e) => setMissingPersonData({ ...missingPersonData, contact: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="description">Description</label>
                                        <Textarea
                                            id="description"
                                            placeholder="Physical description, clothing, or any other relevant details"
                                            rows={3}
                                            value={missingPersonData.description}
                                            onChange={(e) => setMissingPersonData({ ...missingPersonData, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {result && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
                                {/* Close Button */}
                                <button
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                                    onClick={() => setResult(null)}
                                >
                                    &times;
                                </button>

                                {/* Title */}
                                <h2 className={`text-xl font-semibold ${result.error ? "text-red-600" : "text-green-600"}`}>
                                    {result.error ? "Error" : "Results"}
                                </h2>

                                {/* Separator Line */}
                                <div className="my-4 h-px w-full bg-gray-300" />

                                {/* JSON Result Block */}
                                <pre className="mt-2 w-full overflow-auto rounded-md bg-gray-100 p-4 text-sm text-gray-800">
                                    {JSON.stringify(result, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}

                </CardContent>

                <CardFooter>
                    {imgSrc && (
                        <Button onClick={handleSubmitMissingPerson} disabled={loading} className="ml-auto bg-gradient-to-br from-slate-700 via-slate-600 to-gray-500 text-white" size="lg">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Submit Report
                                </>
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default WebcamCapture;
