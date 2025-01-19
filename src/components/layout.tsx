import type { PropsWithChildren } from "react";
import Header from "./header";
import { useTheme } from "@/context/theme-provider";

const Layout = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className={`${
        isDark
          ? "bg-gradient-to-br from-[#120d1b] to-[#02001b]"
          : "bg-gradient-to-br from-[#f0eef1] to-[#eef6ff]"
      }`}
    >
      <Header />
      <main className="min-h-screen container mx-auto min-w-[100vw]">
        {children}
      </main>

      <footer
        className={`border-t backdrop-blur py-12 mt-10 ${
          isDark
            ? "supports-[backdrop-filter]:bg-[#0a0a0a]/40"
            : "supports-[backdrop-filter]:bg-[#ffffff]/40"
        }`}
      >
        <div
          className={`container mx-auto px-4 text-center ${
            isDark ? "text-gray-500" : "text-gray-700"
          }`}
        >
          <p> @Cloudia | Visit again</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
