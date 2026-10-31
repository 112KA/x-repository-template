import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8">
        <h1>app-nextjs</h1>
        <Button>Start</Button>
        <div>
          <ul>
            <li className="list-disc">
              <a className="text-blue-500 underline" href="/examples/transitions/">Transition Example</a>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
