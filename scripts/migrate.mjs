import postgres from 'postgres';
import {readFile} from 'node:fs/promises';
if(!process.env.DATABASE_URL)throw new Error('Set DATABASE_URL before running the migration.');
const sql=postgres(process.env.DATABASE_URL,{max:1,prepare:false});
try{await sql.unsafe(await readFile(new URL('../db/schema.sql',import.meta.url),'utf8'));console.log('RSVP schema is ready.')}finally{await sql.end()}
