import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const Overview = async () => {
  const session = await getServerSession(authOptions)

    return (
    <div>{session ? "session" : "Not session"}</div>
  )
}

export default Overview