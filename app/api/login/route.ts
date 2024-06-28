import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcrypt"
import { isEmpty } from "../isEmpty"
import { User } from "../models/user"

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json()

        if (!username || !password || isEmpty([username, password])) return new Response("All fields required", { status: 400})
        
        const user = await User.findOne({ username })

        if (!user) return new Response("Username Not Found", { status: 400 })
        
        if (!await bcrypt.compare(password, user.password as string)) return new Response("Password Incorrect")

        const token = await jwt.sign({ username, id: user.id}, process.env.SECRET as string)

        return Response.json(token)
    } catch (error: any) {
        return new Response(error.message, { status: 500 })
    }
}