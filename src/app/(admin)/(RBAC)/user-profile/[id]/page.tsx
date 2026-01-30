"use client"
import { useParams } from 'next/navigation'
import React from 'react'

function UserProfile() {
    const params = useParams<{ id: string }>()

    return (
        <div>MyProfile {params.id}</div>
    )
}

export default UserProfile