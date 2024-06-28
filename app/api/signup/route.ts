import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcrypt"
import { isEmpty } from "../isEmpty"
import { User } from "../models/user"

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json()

        if (!username || !password || isEmpty([username, password])) return new Response("All fields required", { status: 400})

        const userCheck = await User.findOne({ username })

        if (userCheck) return new Response("Username taken", { status: 409 })

        const newUser = new User({ username, password: await bcrypt.hash(password, 10)})

        await newUser.save()
        const token = await jwt.sign({ username, id: newUser.id}, process.env.SECRET!)
        return Response.json(token)
    } catch (error: any) {
        return new Response(error.message, {status: 500})
    }
}