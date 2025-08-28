"use client"

import { z } from "zod"

const formSchema = z.object({
    username: z.string().min(2).max(50),
})

const AuthForm = () => {
    return (
        <div>AuthForm</div>
    )
}
export default AuthForm
