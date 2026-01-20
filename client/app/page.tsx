import Link from "next/dist/client/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
        Welcome to Application Tracker!
      </h1>
      <Link href={"login"}>Click here to Sign in</Link>
    </div>
  );
}
