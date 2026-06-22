import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Live from "./pages/Live";
import ImportPage from "./pages/Import";
import About from "./pages/About";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import PageTransition from "./components/animations/PageTransition";
import ScrollToTop from "./components/ScrollToTop";

function RouteHandler() {
	const location = useLocation();
	return (
		<AnimatePresence mode="wait">
			<Routes location={location} key={location.pathname}>
				<Route
					path="/"
					element={
						<PageTransition>
							<Home />
						</PageTransition>
					}
				/>
				<Route
					path="/live"
					element={
						<PageTransition>
							<Live />
						</PageTransition>
					}
				/>
				<Route
					path="/import"
					element={
						<PageTransition>
							<ImportPage />
						</PageTransition>
					}
				/>
				<Route
					path="/about"
					element={
						<PageTransition>
							<About />
						</PageTransition>
					}
				/>
				<Route
					path="/projects"
					element={
						<PageTransition>
							<Projects />
						</PageTransition>
					}
				/>
				<Route
					path="*"
					element={
						<PageTransition>
							<NotFound />
						</PageTransition>
					}
				/>
			</Routes>
		</AnimatePresence>
	);
}

function App() {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Layout>
				<RouteHandler />
			</Layout>
		</BrowserRouter>
	);
}

export default App;
