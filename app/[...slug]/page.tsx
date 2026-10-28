import {notFound,redirect} from 'next/navigation';
import WeddingSite from '../wedding-site';
import {pageNames} from '../wedding-data';
export default async function WeddingPage({params}:{params:Promise<{slug:string[]}>}){
 const {slug}=await params;const page=slug.join('/');
 if(page==='invitation.html')redirect('/invitation');
 if(!(page in pageNames))notFound();
 return <WeddingSite initialPage={page}/>;
}
