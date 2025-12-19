import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Users, Copy, Check, X, PhoneOff } from 'lucide-react';

const MeetingPage = () => {
    const navigate = useNavigate();
    const jitsiContainerRef = useRef(null);
    const [meetingId, setMeetingId] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const [copied, setCopied] = useState(false);
    const [jitsiApi, setJitsiApi] = useState(null);

    // Generate a random meeting ID on load
    useEffect(() => {
        const randomId = 'SNPSU-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        setMeetingId(randomId);
    }, []);

    const startMeeting = () => {
        if (!meetingId) return;
        setIsJoined(true);
    };

    useEffect(() => {
        if (isJoined && jitsiContainerRef.current) {
            // Load Jitsi script
            const script = document.createElement('script');
            script.src = 'https://meet.jit.si/external_api.js';
            script.async = true;
            script.onload = () => {
                const domain = 'meet.jit.si';
                const options = {
                    roomName: meetingId,
                    width: '100%',
                    height: '100%',
                    parentNode: jitsiContainerRef.current,
                    configOverwrite: {
                        startWithAudioMuted: true,
                        disableDeepLinking: true,
                    },
                    interfaceConfigOverwrite: {
                        SHOW_JITSI_WATERMARK: false,
                        SHOW_WATERMARK_FOR_GUESTS: false,
                        TOOLBAR_BUTTONS: [
                            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                            'security'
                        ],
                    },
                    userInfo: {
                        displayName: 'Admin User' // We could pull this from auth context
                    }
                };

                const api = new window.JitsiMeetExternalAPI(domain, options);
                setJitsiApi(api);

                api.addEventListeners({
                    videoConferenceLeft: () => {
                        handleLeave();
                    },
                });
            };
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
                if (jitsiApi) jitsiApi.dispose();
            };
        }
    }, [isJoined]);

    const handleLeave = () => {
        if (jitsiApi) jitsiApi.dispose();
        setIsJoined(false);
        setJitsiApi(null);
    };

    const copyLink = () => {
        const link = `https://meet.jit.si/${meetingId}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col">
            {!isJoined ? (
                <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 m-4">
                    <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
                        <div className="w-20 h-20 bg-[hsl(var(--primary))/0.1] rounded-full flex items-center justify-center mx-auto mb-6 text-[hsl(var(--primary))]">
                            <Video size={40} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Virtual Meeting Room</h1>
                        <p className="text-gray-500 mb-8">Create a secure video conference for faculty meetings, student counseling, or interviews.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Meeting ID</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={meetingId}
                                        onChange={(e) => setMeetingId(e.target.value)}
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none font-mono text-center tracking-wider"
                                    />
                                    <button
                                        onClick={() => {
                                            const randomId = 'SNPSU-' + Math.random().toString(36).substring(2, 8).toUpperCase();
                                            setMeetingId(randomId);
                                        }}
                                        className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                        title="Generate New ID"
                                    >
                                        <Users size={20} />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={startMeeting}
                                className="w-full py-3 bg-[hsl(var(--primary))] text-white rounded-xl font-bold hover:bg-[hsl(var(--primary))/0.9] transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-900/20"
                            >
                                Start Meeting
                            </button>

                            <button
                                onClick={() => navigate('/dashboard/admin')}
                                className="w-full py-3 text-gray-500 font-medium hover:text-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col bg-gray-900 rounded-xl overflow-hidden relative shadow-2xl m-4">
                    {/* Header Overlay */}
                    <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-start pointer-events-none">
                        <div className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-lg pointer-events-auto flex items-center gap-3">
                            <span className="font-mono font-bold tracking-wider">{meetingId}</span>
                            <button
                                onClick={copyLink}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                                title="Copy Link"
                            >
                                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                            </button>
                        </div>
                        <button
                            onClick={handleLeave}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg pointer-events-auto shadow-lg transition-colors"
                            title="End Meeting"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Jitsi Container */}
                    <div ref={jitsiContainerRef} className="w-full h-full bg-black" />
                </div>
            )}
        </div>
    );
};

export default MeetingPage;
