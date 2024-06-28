import * as jwt from "jsonwebtoken"
import { Post } from "../../models/post"
import { Comment } from "../../models/comment"

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization")
        const token = authHeader?.split(' ')[1]

        if (!token || !await jwt.verify(token, process.env.SECRET!)) return new Response("Unauthorized", { status: 401})

        const { postId } = await req.json()

        const comments = await Comment.find({ postId })

        return Response.json(comments)
    } catch (error: any) {
        return new Response(error.message)
    }
}