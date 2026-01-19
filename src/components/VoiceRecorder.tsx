"use client";

import { useState, useRef } from "react";

interface VoiceRecorderProps {
    onTranscriptionComplete: (data: any) => void;
    language?: string;
}

export default function VoiceRecorder({ onTranscriptionComplete, language = "hi" }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transcription, setTranscription] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            setError(null);
            setTranscription(null);

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Create media recorder
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            // Collect audio chunks
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            // Handle recording stop
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
                await transcribeAudio(audioBlob);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            // Start recording
            mediaRecorder.start();
            setIsRecording(true);
        } catch (err: any) {
            setError("Failed to access microphone: " + err.message);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const transcribeAudio = async (audioBlob: Blob) => {
        try {
            setIsProcessing(true);
            setError(null);

            // Create form data
            const formData = new FormData();
            formData.append("audio", audioBlob, "recording.webm");
            formData.append("language", language);

            // Send to transcription API
            const response = await fetch("/api/voice/transcribe", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setTranscription(data.transcription);
                onTranscriptionComplete(data.needData);
            } else {
                setError(data.error || "Transcription failed");
            }
        } catch (err: any) {
            setError("Failed to transcribe: " + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="rounded-lg border bg-card p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">🎤 Voice Recording</h3>
                <p className="text-sm text-muted-foreground">
                    Speak in Hindi or any language to report a need
                </p>
            </div>

            {/* Recording Button */}
            <div className="flex items-center gap-4">
                {!isRecording && !isProcessing && (
                    <button
                        onClick={startRecording}
                        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/90"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                        </svg>
                        Start Recording
                    </button>
                )}

                {isRecording && (
                    <button
                        onClick={stopRecording}
                        className="flex items-center gap-2 rounded-lg bg-error px-6 py-3 text-white hover:bg-error/90 animate-pulse"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="12" r="8"></circle>
                        </svg>
                        Stop Recording
                    </button>
                )}

                {isProcessing && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        Transcribing...
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 rounded-lg border border-error bg-error/10 p-3">
                    <p className="text-sm text-error">{error}</p>
                </div>
            )}

            {/* Transcription Result */}
            {transcription && (
                <div className="mt-4 rounded-lg border bg-success/10 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-success">
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M5 13l4 4L19 7"></path>
                        </svg>
                        Transcription Complete
                    </div>
                    <p className="text-sm">{transcription}</p>
                </div>
            )}

            {/* Instructions */}
            <div className="mt-4 rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                    <strong>Tip:</strong> Speak clearly and mention: cluster name, issue type,
                    grade level, infrastructure level, and language.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    <strong>Example:</strong> "कांके ब्लॉक में FLN की समस्या है, प्राइमरी कक्षा 1-3,
                    कम बुनियादी ढांचा, हिंदी माध्यम"
                </p>
            </div>
        </div>
    );
}
