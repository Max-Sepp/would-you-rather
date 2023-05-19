import NavBar from '~/components/NavBar'
import './globals.css'

export const metadata = {
  title: 'Would you rather?',
  description: 'Answer questions on what you would rather do and see if you agree with others',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='bg-white dark:bg-slate-800'>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
