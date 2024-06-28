import * as jwt from "jsonwebtoken"
import { Post } from "../../models/post"
import { Comment } from "../../models/comment"

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization")
        const token = authHeader?.split(' ')[1]

        if (!token || !await jwt.verify(token, process.env.SECRET!)) return new Response("Unauthorized", { status: 401})

        const decoded: any = await jwt.decode(token)

        const { title, text, postId } = await req.json()
        
        const post = await Post.findById(postId)

        if (!post) return new Response("Post Not Found", { status: 404})
        const comment = new Comment({
            title,
            text,
            postId
        })

        post?.comments.push(comment._id)

        await post.save()
        await comment.save()

        return Response.json(comment)
    } catch (error: any) {
        return new Response(error.message, { status: 500 })
    }
}