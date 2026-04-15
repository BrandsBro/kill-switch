import './globals.css'

export const metadata = {
  title: 'Link Killer',
  description: 'Kill any link with a message',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
