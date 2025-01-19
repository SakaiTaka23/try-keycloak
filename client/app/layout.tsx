"use client"

import "./globals.css";
import React, {useEffect, useState} from "react";
import {redirect} from "next/navigation";
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

const KEYCLOAK_URL = 'http://localhost:8080/realms/myrealm/protocol/openid-connect/auth'
const params = new URLSearchParams({
    client_id: 'frontend-client',
    redirect_uri: 'http://localhost:3000/api/callback',
    response_type: 'code',
    scope: 'openid profile email',
});

type DecodedToken = {
    preferred_username?: string
}

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    const [nickname, setNickname] = useState<string | undefined>(undefined)
    useEffect(() => {
        const token = Cookies.get('id_token')
        if (token) {
            const decoded = jwt.decode(token) as DecodedToken
            setNickname(decoded?.preferred_username)
        }
    }, [])

    const loginUrl = `${KEYCLOAK_URL}?${params.toString()}`
    const handleLogin = () => {
        redirect(loginUrl);
    }

    return (
        <html lang="en">
        <body>
        <button onClick={handleLogin}>login</button>
        <button>register</button>
        <h1>{nickname}</h1>
        {children}
        </body>
        </html>
    );
}
