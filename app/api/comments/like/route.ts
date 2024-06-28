import * as jwt from "jsonwebtoken"
import { Comment } from "../../models/comment"

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization")
        const token = authHeader?.split(' ')[1]

        if (!token || !await jwt.verify(token, process.env.SECRET!)) return new Response("Unauthorized", { status: 401})
        
        const decoded: any = await jwt.decode(token)
        const { commentId } = await req.json()

        const comment = await Comment.findById(commentId)

        if (!comment) return new Response("Comment Not Found", { status: 404})

        if (comment.likedUsers.includes(decoded.id)) return new Response("Comment Already Liked", { status: 403})
        comment.likes += 1 as any
        comment.likedUsers.push(decoded.id)


        await comment.save()
        return Response.json(comment)
    } catch (error: any) {
        return new Response(error.message, { status: 500})
    }
}