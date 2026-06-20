import ScrollingTicker from "@/features/Home/components/Ticker";
import HomePage from "@/features/Home/page/Homepage";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Scrolling Ticker at the top */}
      <div className=" fixed">
        <ScrollingTicker />
      </div>

      {/* Your homepage content */}
      <HomePage />
    </div>
  );
}
