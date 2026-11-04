import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Edu Institute | Academic & Course Management",
  description:
    "Edu Institute portal featuring student authentication, course feedback, and academic journal content editing.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-800 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
