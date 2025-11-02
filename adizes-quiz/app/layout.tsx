import "./globals.css";

export const metadata = {
  title: "Мини-тест по типологии Адизеса (PAEI)",
  description: "12 вопросов, вычисляет P/A/E/I профиль",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        {children}
      </body>
    </html>
  );
}
