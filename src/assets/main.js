import React , { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {io} from 'socket.io-client';
const SERVER_URL = 'localhost:8080';
function App() {
    const [status, setStatus] = useState('connecting...');
    useEffect(() => {
        const socket = io(SERVER_URL, {
            transports: ['websocket'],
        });
        const myUserId = 'user_abc_1234';
        socket.on('connect', () => {
            setStatus('connected!');
            console.log('socket id:', socket.id);
            socket.emit('register-user', myUserId);
        });
        socket.on('notification-received', (data) => {
            console.log('new notification:', data);
        });
        socket.on('disconnect', () => {
            setStatus('disconnected!');
        });
        return () => {
            socket.disconnect();
        };
    }, []);
    return (
        <>
            <OrderLineDashboard />
        </>
    )
}