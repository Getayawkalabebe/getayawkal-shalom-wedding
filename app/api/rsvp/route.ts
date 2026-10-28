import {getDb} from '../../../db';
import {validateRsvp} from '../../../lib/validate-rsvp.mjs';
export const runtime='nodejs';
export async function POST(request:Request){
 const fail=(error:string,status=400)=>Response.json({error},{status,headers:{'Cache-Control':'no-store'}});
 const origin=request.headers.get('origin');
 if(origin){try{if(new URL(origin).host!==new URL(request.url).host)return fail('Invalid origin.',403)}catch{return fail('Invalid origin.',403)}}
 if(!request.headers.get('content-type')?.includes('application/json'))return fail('JSON required.');
 if(Number(request.headers.get('content-length'))>12000)return fail('Response is too long.',413);
 const reader=request.body?.getReader();if(!reader)return fail('Invalid response.');
 const chunks:Uint8Array[]=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>12000){await reader.cancel();return fail('Response is too long.',413)}chunks.push(value)}
 let data;try{data=JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{return fail('Invalid response.')}
 const result=validateRsvp(data);if(result.error)return fail(result.error);
 const d=result.record!;
 try{
  const sql=getDb();
  await sql`INSERT INTO rsvps (request_id,name,phone,attendance,guests,side,message) VALUES (${d.requestId},${d.name},${d.phone},${d.attendance},${d.guests},${d.side},${d.message}) ON CONFLICT (request_id) DO UPDATE SET name=EXCLUDED.name,phone=EXCLUDED.phone,attendance=EXCLUDED.attendance,guests=EXCLUDED.guests,side=EXCLUDED.side,message=EXCLUDED.message,updated_at=NOW()`;
  return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
 }catch{return fail('We could not save your response. Please try again.',503)}
}
