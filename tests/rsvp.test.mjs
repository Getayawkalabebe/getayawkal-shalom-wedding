import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateRsvp} from '../lib/validate-rsvp.mjs';
const valid={requestId:'01234567-89ab-cdef-0123-456789abcdef',name:' Local Test ',contact:'+1 202 555 0100',attendance:'yes',guests:2,side:'both',message:' Best wishes ',website:''};
test('accepts and trims a valid RSVP',()=>{const {record,error}=validateRsvp(valid);assert.equal(error,undefined);assert.equal(record.name,'Local Test');assert.equal(record.message,'Best wishes');assert.equal(record.guests,2)});
test('declines require zero guests',()=>{assert.ok(validateRsvp({...valid,attendance:'no'}).error);assert.equal(validateRsvp({...valid,attendance:'no',guests:0}).error,undefined)});
test('rejects invalid guest counts, contact, side and honeypot',()=>{for(const change of [{guests:7},{guests:0},{guests:1.5},{contact:'-------'},{side:'other'},{website:'spam'},{name:'a'},{message:'a'.repeat(2001)}])assert.ok(validateRsvp({...valid,...change}).error)});
test('retains request ID for idempotent updates',()=>assert.equal(validateRsvp(valid).record.requestId,valid.requestId));
