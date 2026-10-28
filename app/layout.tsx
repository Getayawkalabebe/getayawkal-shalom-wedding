import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Getayawkal & Shalom — November 21, 2026',description:'An invitation to our forever. November 21, 2026 · Kotabe Full Gospel Church, Addis Ababa.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><head><link rel="preload" href="/fonts/editorial-regular.otf" as="font" type="font/otf" crossOrigin="anonymous"/><link rel="preload" href="/fonts/work-sans.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body>{children}</body></html>}
