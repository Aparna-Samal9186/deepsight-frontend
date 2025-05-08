import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import WebcamCapture from './WebcamCapture';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs.jsx';

function ImageCapture() {
    const [activeTab, setActiveTab] = useState('upload'); // Default to upload

    return (
        <div className="mx-auto mt-10 w-[600px]">
            <Tabs value={activeTab} onValueChange={setActiveTab}> 
                <TabsList>
                    <TabsTrigger value="upload">Upload Image</TabsTrigger>
                    <TabsTrigger value="webcam">Webcam Capture</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                    <ImageUpload />
                </TabsContent>
                <TabsContent value="webcam">
                    <WebcamCapture />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default ImageCapture;