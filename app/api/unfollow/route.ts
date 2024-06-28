import * as jwt from "jsonwebtoken"
import { User } from "../models/user"

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization")
        const token = authHeader?.split(' ')[1]

        if (!token || !await jwt.verify(token, process.env.SECRET!)) return new Response("Unauthorized", { status: 401})
        
        const decoded: any = await jwt.decode(token)

        const { userID } = await req.json()

        const user1 = await User.findById(userID)
        const user2 = await User.findById(decoded.id)

        if (!user1?.followers.includes(user2?._id as any)) return new Response("User not followed", { status: 409})
        user1?.followers.pull(user2?._id as any)
        user2?.following.pull(user1?._id as any)

        await user1?.save()
        await user2?.save()

        return new Response("User Unfollowed")
    } catch (error: any) {
        return new Response(error.message, { status: 500})
    }
}