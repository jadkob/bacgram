import * as jwt from "jsonwebtoken"
import { Post } from "../models/post"
import { User } from "../models/user"
import { isEmpty } from "../isEmpty"

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization")
        const token = authHeader?.split(' ')[1]

        if (!token || !await jwt.verify(token, process.env.SECRET!)) return new Response("Unauthorized", { status: 401})
        
        const decoded: any = await jwt.decode(token)

        const user = await User.findById(decoded.id)
        const posts = await Post.find({
            viewedUsers: { $nin: decoded.id }
        })
        
        if (posts.length == 0) {
            if (Array.isArray(user?.viewedPosts) && user?.viewedPosts.length > 0) {
                return new Response("No More Posts To View")
            }else if (Array.isArray(user?.viewedPosts) && user?.viewedPosts.length == 0) {
                return new Response("No Posts To View")
            }
        }
        return Response.json(posts)
    } catch (error: any) {
        return new Response(error.message)
    }
}
export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization")
        const token = authHeader?.split(' ')[1]

        if (!token || !await jwt.verify(token, process.env.SECRET!)) return new Response("Unauthorized", { status: 401})

        const decoded: any = await jwt.decode(token)
        const { title, text } = await req.json()

        if (!title || !text || isEmpty([title, text])) return new Response("All Fields Are Required", { status: 400})

        const post = new Post({ title, text })
        const user = await User.findById(decoded.id)

        await post.save()

        user?.posts.push(post)

        await user?.save()

        return Response.json(post)
    } catch (error: any) {
        return new Response(error.message, { status: 500 })
    }
}