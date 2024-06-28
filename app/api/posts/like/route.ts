import * as jwt from "jsonwebtoken"
import { Post } from "../../models/post"

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization")
        const token = authHeader?.split(' ')[1]

        if (!token || !await jwt.verify(token, process.env.SECRET!)) return new Response("Unauthorized", { status: 401})


        const decoded: any = await jwt.decode(token)
        const { postId } = await req.json()

        if (!postId || postId == "") return new Response("Post ID Is Required", { status: 400})
        const post = await Post.findById(postId)
        if (!post) return new Response("Post Not Found")

        if (post.likedUsers.includes(decoded.id)) return new Response("Post Already Liked", { status: 403})
        post.likes += 1 as any
        post?.likedUsers.push(decoded.id)

        await post.save()

        return Response.json(post)
    } catch (error: any) {
        return new Response(error.message, { status: 500 })
    }
}