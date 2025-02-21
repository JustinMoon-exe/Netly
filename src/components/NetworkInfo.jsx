import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DOMPurify from 'dompurify';
import { FiRefreshCw, FiClipboard, FiMapPin, FiGlobe, FiClock, FiWifi, FiServer, FiX } from "react-icons/fi";
import { FiTerminal } from "react-icons/fi";
import "@fontsource/nunito";
import "@fontsource/nunito/700.css";
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import SignUp from './Auth/SignUp';
import Login from './Auth/Login';

import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';


const NetworkInfo = () => {
    const [networkData, setNetworkData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [showConcepts, setShowConcepts] = useState(false);
    const containerRef = useRef(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [userLogs, setUserLogs] = useState([]);
    const [showLogs, setShowLogs] = useState(false);


    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return unsubscribeAuth;
    }, []);

    useEffect(() => {
        fetchData();
    }, []); 

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("https://ipinfo.io/json", {
                headers: { "Accept": "application/json" }
            });
            
            const sanitizedData = {};
            for (const key in response.data) {
                if (typeof response.data[key] === 'string') {
                    sanitizedData[key] = DOMPurify.sanitize(response.data[key]);
                } else {
                    sanitizedData[key] = response.data[key];
                }
            }
            setNetworkData(sanitizedData);

        } catch (err) {
            console.error("Primary API failed, trying fallback", err);
            try {
                const ipResponse = await axios.get("https://api64.ipify.org?format=json");
                setNetworkData({ ip: ipResponse.data.ip });
            } catch (fallbackErr) {
                console.error("Both APIs failed", fallbackErr);
                setError("Unable to fetch network info.");
            }
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const saveNetworkData = async () => {
        if (!currentUser) {
            alert("Please log in to save network data.");
            return;
        }

        if (!networkData) {
            alert("No network data to save.");
            return;
        }

        try {
            const logsCollectionRef = collection(db, "networkLogs");
            await addDoc(logsCollectionRef, {
                userId: currentUser.uid,
                ipAddress: networkData.ip,
                isp: networkData.org?.replace('AS', ''),
                location: [networkData.city, networkData.region, networkData.country].filter(Boolean).join(', '),
                timezone: networkData.timezone,
                coordinates: networkData.loc,
                timestamp: serverTimestamp()
            });
            alert("Network data saved successfully!");
        } catch (error) {
            console.error("Error saving network data:", error);
            alert("Failed to save network data.");
        }
    };


    const handleViewLogs = async () => {
        if (!currentUser) {
            alert("Please log in to view your logs.");
            return;
        }

        setShowLogs(true);

        try {
            const logsCollectionRef = collection(db, "networkLogs");
            const q = query(logsCollectionRef,
                where("userId", "==", currentUser.uid),
                orderBy("timestamp", "desc")
            );
            const querySnapshot = await getDocs(q);
            const logsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUserLogs(logsData);
        } catch (error) {
            console.error("Error fetching user logs:", error);
            alert("Failed to fetch user logs.");
        }
    };

    const handleCloseLogs = () => {
        setShowLogs(false);
    };


    const NetworkingConcepts = () => (
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-8 animate-expand flex flex-col items-center justify-center">
            <button
                onClick={() => handleCloseConcepts()}
                className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-full text-gray-400 z-10"
            >
                <FiX className="text-xl" />
            </button>
            <h2 className="text-xl font-bold text-white mb-4">Networking Concepts Used</h2>
            <p className="text-white leading-relaxed text-center">
                Netly utilizes several essential networking concepts. It uses HTTP and APIs to fetch and display network data, which are data transfer protocols. The program also uses the DNS system to resolve your connection to a server, and IP addresses to verify your location. Lastly, the application is able to quickly deliver this data to you because of the usage of a CDN. For security, the program is able to transmit this data safely by making usage of HTTPS, ensuring your personal information stays safe.
            </p>
        </div>
    );

    const handleConceptsClick = () => {
        if (containerRef.current) {
            setShowConcepts(true);
        }
    };

    const handleCloseConcepts = () => {
        if (containerRef.current) {
            containerRef.current.classList.add('animate-shrink');
            setTimeout(() => {
                setShowConcepts(false);
                containerRef.current.classList.remove('animate-shrink');
            }, 500);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("User logged out");
        } catch (logoutError) {
            console.error("Logout error:", logoutError);
            setError("Logout failed.");
        }
    };

    const handleAuthModalOpen = () => setShowAuthModal(true);
    const handleAuthModalClose = () => setShowAuthModal(false);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
            <div ref={containerRef} className={`w-full max-w-4xl bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden relative ${showConcepts ? 'h-full' : ''}`}>
                      
<div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h1 className="text-5xl text-cyan-400 ">
                        Netly
                    </h1>
                    <div className="flex items-center"> 
                        <button
                            onClick={fetchData}
                            className={`p-2 rounded-lg hover:bg-white/10 transition-colors mr-2`} 
                        >
                            <FiRefreshCw
                                className={`text-cyan-400 text-xl ${loading ? 'animate-spin' : ''}`} 
                            />
                        </button>
                        {currentUser && ( 
                            <>
                                <button
                                    onClick={handleViewLogs}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2" 
                                >
                                    My Logs
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                        {!currentUser && ( 
                            <button
                                onClick={handleAuthModalOpen}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Login / Sign Up
                            </button>
                        )}
                    </div>
                </div>

    

                {loading ? (
                    <div className="p-8 flex justify-center items-center space-x-3">
                        <div className="animate-pulse h-8 w-8 bg-cyan-400/30 rounded-full" />
                        <span className="text-cyan-400">Fetching network data...</span>
                    </div>
                ) : error ? (
                    <div className="p-8 text-red-400 flex items-center space-x-2">
                        <FiServer className="text-xl" />
                        <span>{error}</span>
                    </div>
                ) : networkData && (
                    <>
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-8 transition-opacity duration-500 ${showConcepts ? 'opacity-0' : 'opacity-100'}`}>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-cyan-500/10 rounded-xl transform group-hover:scale-105 transition-all duration-300" />
                                <div className="relative p-6 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-4">
                                                <FiGlobe className="text-cyan-400 text-xl" />
                                                <h3 className="text-sm font-semibold text-cyan-400">PUBLIC IP</h3>
                                            </div>
                                            <p className="text-white truncate">{networkData.ip}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(networkData.ip)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <FiClipboard className="text-cyan-400" />
                                        </button>
                                    </div>
                                    {copied && (
                                        <div className="absolute bottom-2 right-2 text-xs text-cyan-400 animate-fade-in">
                                            Copied!
                                        </div>

                                    )}
                                    {currentUser && (
                                        <button
                                            onClick={saveNetworkData}
                                            className="mt-4 bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        >
                                            Save Data
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex items-center space-x-2 mb-4">
                                    <FiMapPin className="text-cyan-400 text-xl" />
                                    <h3 className="text-sm font-semibold text-cyan-400">LOCATION</h3>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-white">
                                        {[networkData.city, networkData.region, networkData.country].filter(Boolean).join(', ')}
                                    </p>
                                    {networkData.loc && (
                                        <p className="text-sm text-white/70">
                                            Coordinates: {networkData.loc}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex items-center space-x-2 mb-4">
                                    <FiWifi className="text-cyan-400 text-xl" />
                                    <h3 className="text-sm font-semibold text-cyan-400">INTERNET PROVIDER</h3>
                                </div>
                                <p className="text-white truncate">{networkData.org?.replace('AS', '')}</p>
                            </div>

                            <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex items-center space-x-2 mb-4">
                                    <FiClock className="text-cyan-400 text-xl" />
                                    <h3 className="text-sm font-semibold text-cyan-400">TIMEZONE</h3>
                                </div>
                                <p className="text-white">{networkData.timezone}</p>
                            </div>

                            <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex items-center space-x-2 mb-4">
                                    <FiTerminal className="text-cyan-400 text-xl" />
                                    <h3 className="text-sm font-semibold text-cyan-400">DEVELOPER</h3>
                                </div>
                                <p className="text-white">Justin Moonjeli | CSC 4220 Computer Networks</p>
                            </div>

                            <div onClick={handleConceptsClick} className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex items-center space-x-2 mb-4">
                                    <FiTerminal className="text-cyan-400 text-xl" />
                                    <h3 className="text-sm font-semibold text-cyan-400">NETWORKING CONCEPTS</h3>
                                </div>

                                <p className="text-white">Key Concepts Employed</p>
                            </div>
                        </div>
                    </>
                )}

                {showLogs && (
                    <div className="p-8 bg-white/5 rounded-xl border border-white/10 mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-white">My Network Logs</h2>
                            <button
                                onClick={handleCloseLogs}
                                className="p-2 hover:bg-white/10 rounded-full text-gray-400"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>
                        {userLogs.length > 0 ? (
                            <ul className="space-y-4">
                                {userLogs.map(log => (
                                    <li key={log.id} className="p-4 bg-slate-800/50 rounded-lg border border-white/10">
                                        <p className="text-white/80 text-sm">Timestamp: {log.timestamp?.toDate().toLocaleString()}</p>
                                        <p className="text-white">IP Address: {log.ipAddress}</p>
                                        <p className="text-white">ISP: {log.isp}</p>
                                        <p className="text-white">Location: {log.location}</p>
                                        <p className="text-white text-sm text-white/70">Coordinates: {log.coordinates}</p>
                                        <p className="text-white text-sm text-white/70">Timezone: {log.timezone}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-white/70">No logs saved yet.</p>
                        )}
                    </div>
                )}

                {showConcepts && <NetworkingConcepts onClose={handleCloseConcepts} />}

                {showAuthModal && (
                    <div className="absolute top-0 left-0 w-full h-full bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-8 animate-expand flex flex-col items-center justify-center">
                        <button
                            onClick={handleAuthModalClose}
                            className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-full text-gray-400 z-10"
                        >
                            <FiX className="text-xl" />
                        </button>
                        <div className="flex space-x-4">
                            <SignUp onClose={handleAuthModalClose} />
                            <Login onClose={handleAuthModalClose} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NetworkInfo;