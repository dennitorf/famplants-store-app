import WelcomeGate from "./components/home/welcome-gate";
import HomePage from "./home/page";

export default function LandingPage() {
  return (
    <WelcomeGate>
      <HomePage />
    </WelcomeGate>
  );
}
