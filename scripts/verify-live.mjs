import postgres from 'postgres';
import {randomUUID} from 'node:crypto';
import assert from 'node:assert/strict';
const origin='https://getayawkal-shalom-wedding.vercel.app';
const sql=postgres(process.env.DATABASE_URL,{max:1,prepare:false});
const requestId='deployment-check-'+randomUUID();
const body={requestId,name:'Deployment verification',contact:'0000000000',attendance:'yes',guests:2,side:'both',message:'Temporary automated verification',website:''};
try {
 const send=async data=>fetch(origin+'/api/rsvp',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(data)});
 const accepted=await send(body);assert.equal(accepted.status,200);assert.equal((await accepted.json()).ok,true);
 let rows=await sql`SELECT attendance,guests FROM rsvps WHERE request_id=${requestId}`;assert.equal(rows.length,1);assert.equal(rows[0].guests,2);
 const updated=await send({...body,attendance:'no',guests:0});assert.equal(updated.status,200);
 rows=await sql`SELECT attendance,guests FROM rsvps WHERE request_id=${requestId}`;assert.equal(rows.length,1);assert.equal(rows[0].attendance,'no');assert.equal(rows[0].guests,0);
 const invalid=await send({...body,guests:7});assert.equal(invalid.status,400);
 console.log('Live RSVP verified: save, database persistence, update, and invalid-input rejection.');
} finally {
 await sql`DELETE FROM rsvps WHERE request_id=${requestId}`;
 await sql.end();console.log('Temporary verification response removed.');
}
