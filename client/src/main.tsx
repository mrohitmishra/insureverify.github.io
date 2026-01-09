import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

try {
	const storedTheme = localStorage.getItem("theme");
	if (storedTheme === "dark") {
		document.documentElement.classList.add("dark");
	}
	if (storedTheme === "light") {
		document.documentElement.classList.remove("dark");
	}
} catch {
	// ignore storage access failures
}

createRoot(document.getElementById("root")!).render(<App />);
