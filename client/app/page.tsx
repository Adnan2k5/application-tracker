import Link from "next/dist/client/link";
import { getCurrentUser } from "./lib/sessions/session";

export default async function Home() {
  const user = await getCurrentUser();
  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
        Welcome to Application Tracker!
      </h1>
      {user ? (
        <p className="text-zinc-700 dark:text-zinc-300">
          You are logged in as {user.email}. <br />
          <Link className="text-blue-400" href={"dashboard"}>
            Dashboard
          </Link>
        </p>
      ) : (
        <Link href={"login"}>Click here to Sign in</Link>
      )}
    </div>
  );
}
