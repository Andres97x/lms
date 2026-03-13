import { deleteUser, insertUser, updateUser } from "@/features/users/db/users"
import { syncClerkUserMetadata } from "@/services/clerk"
import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const event = await verifyWebhook(req)

    const clerkUserId = event.data.id
    const eventType = event.type

    if (eventType === "user.created" || eventType === "user.updated") {
      const email = event.data.email_addresses.find(
        (email) => email.id === event.data.primary_email_address_id,
      )?.email_address
      const name = `${event.data.first_name} ${event.data.last_name}`.trim()

      if (!email || !name || !clerkUserId)
        throw new Error("Missing required user data from Clerk webhook")
      if (email === null) return new Response("No email", { status: 400 })
      if (name === "") return new Response("No name", { status: 400 })

      if (eventType === "user.created") {
        const newUser = await insertUser({
          clerkUserId,
          email,
          name,
          role: "user",
          imageUrl: event.data.image_url,
        })

        await syncClerkUserMetadata({
          clerkUserId,
          dbId: newUser?.id,
          role: newUser?.role,
        })
      }

      if (eventType === "user.updated") {
        await updateUser(
          { clerkUserId },
          {
            email,
            name,
            imageUrl: event.data.image_url,
            role: event.data.public_metadata.role,
          },
        )
      }
    }

    if (eventType === "user.deleted" && clerkUserId != null) {
      await deleteUser({ clerkUserId })
    }

    return new Response("Webhook received", { status: 200 })
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error verifying webhook", { status: 400 })
  }
}
