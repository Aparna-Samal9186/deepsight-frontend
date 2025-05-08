import React, { useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from './ui/card.jsx';
import { HeartHandshake } from 'lucide-react';

function ImageUpload() {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [lostLocation, setLostLocation] = useState('');
    const [description, setDescription] = useState('');
    const [contact, setContact] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleUpload = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('image', image);
        formData.append('name', name);
        formData.append('age', age);
        formData.append('lost_location', lostLocation);
        formData.append('description', description);
        formData.append('contact', contact);

        try {
            const response = await axios.post(
                'http://localhost:8000/identify_missing_person',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setResult(response.data);
        } catch (error) {
            console.error('Upload error:', error);
            setResult({ error: 'Upload failed.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6 py-0">
            <div className="max-w-5xl mx-auto flex gap-8">
                <div className="w-full max-w-[60%]">
                    <Card className="rounded-2xl bg-white">
                        <CardHeader>
                            <CardTitle className="text-2xl text-gray-800 font-semibold">Report Missing Person</CardTitle>
                            <CardDescription className="text-gray-600">
                                Please provide details and upload an image of the missing person.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="grid gap-1">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="grid gap-1">
                                    <label htmlFor="age" className="text-sm font-medium text-gray-700">Age</label>
                                    <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                                </div>
                                <div className="grid gap-1">
                                    <label htmlFor="lostLocation" className="text-sm font-medium text-gray-700">Last Known Location</label>
                                    <Input id="lostLocation" value={lostLocation} onChange={(e) => setLostLocation(e.target.value)} />
                                </div>
                                <div className="grid gap-1">
                                    <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                                    <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                                </div>
                                <div className="grid gap-1">
                                    <label htmlFor="contact" className="text-sm font-medium text-gray-700">Contact</label>
                                    <Input id="contact" type="tel" value={contact} onChange={(e) => setContact(e.target.value)} />
                                </div>
                                <div className="grid gap-1">
                                    <label htmlFor="image" className="text-sm font-medium text-gray-700">Upload Image</label>
                                    <Input type="file" id="image" onChange={handleImageChange} />
                                </div>
                                <Button
                                    onClick={handleUpload}
                                    disabled={loading}
                                    className="bg-gradient-to-br from-slate-500 via-slate-400 to-gray-400 hover:from-white hover:to-gray-300 mt-4 font-semibold rounded-xl shadow-md transition-all duration-200"
                                >

                                    {loading ? 'Submitting...' : 'Submit Report'}
                                </Button>
                                {result && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
                                            <button
                                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                                                onClick={() => setResult(null)}
                                            >
                                                &times;
                                            </button>

                                            {result.message && (
                                                <p className="text-green-600 font-medium">{result.message}</p>
                                            )}

                                            {result.image_base64 && (
                                                <img
                                                    src={`data:image/jpeg;base64,${result.image_base64}`}
                                                    alt="Matched Person"
                                                    className="max-w-full rounded-lg border mt-3"
                                                />
                                            )}

                                            {result.error && (
                                                <p className="text-red-500 font-medium">{result.error}</p>
                                            )}

                                            <pre className="mt-4 w-full overflow-auto rounded-md bg-muted p-4 text-sm">
                                                {JSON.stringify(result, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Optional Right-side Banner/Info Panel */}
                <div className="hidden lg:block flex-1">
                    <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-gray-500 text-white rounded-2xl p-6 shadow-lg h-full flex flex-col">
                        <HeartHandshake className="w-16 h-16 mx-auto text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                        <h2 className="text-3xl font-semibold my-4 text-center">Help Us Reunite Families</h2>
                        <p className="text-lg opacity-90">
                            Your report could be a life-changing step. Upload clear photos and accurate details to improve identification chances.
                        </p>
                        <div className="mt-6">
                            <ul className="list-disc pl-5 space-y-2 text-sm opacity-90">
                                <li>Ensure the photo is recent and clearly shows the face.</li>
                                <li>Include clothing/accessory details in the description.</li>
                                <li>We’ll notify you if there’s a match.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImageUpload;
