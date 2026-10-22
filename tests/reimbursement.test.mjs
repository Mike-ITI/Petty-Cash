import test from 'node:test';
import assert from 'node:assert/strict';
import {initialData,transact,balance,TODAY,activeAdvances,replenishable} from '../src/model.mjs';
const expense={id:'expense',category:'Office supplies',description:'Emergency filing labels',amount:10000,date:TODAY,payee:'Paper Shop',receipt:{name:'labels.png',url:'blob:labels',hash:'labels-hash'}};
const value=db=>({purpose:'Filing labels paid personally',method:'Bank transfer',items:[expense],declared:true,reviewedRequests:activeAdvances(db,'Isabella Reyes').map(r=>r.id)});
const create=(db=initialData())=>transact(db,{type:'saveReimbursement',value:value(db),submit:true},'requester');
const approve=(db,id)=>transact(db,{type:'reimbursementDecision',id,status:'Approved — Pending Payment'},'approver').db;
const payment=(id,source='Outside petty cash')=>({type:'payReimbursement',id,source,fund:'FND-001',account:'Operating account',date:TODAY,method:'Bank transfer',reference:'PAY-001',confirmed:true});

test('direct reimbursement needs no cash request, release or fund; submission and approval move no cash',()=>{
  const db=initialData(),before=JSON.stringify(db.movements),r=create(db);assert.equal(r.db.reimbursements[0].request,undefined);assert.equal(r.db.reimbursements[0].status,'Pending Approval');assert.equal(r.db.requests.length,db.requests.length);
  const accepted=approve(r.db,r.id);assert.equal(accepted.reimbursements[0].status,'Approved — Pending Payment');assert.equal(JSON.stringify(accepted.movements),before);
});
test('personal expense declaration, receipt, payee and outstanding request review are mandatory on submission',()=>{
  const db=initialData();for(const override of [{declared:false},{reviewedRequests:[]},{items:[{...expense,receipt:undefined}]},{items:[{...expense,payee:''}]}])assert.throws(()=>transact(db,{type:'saveReimbursement',submit:true,value:{...value(db),...override}},'requester'));
  assert.doesNotThrow(()=>transact(db,{type:'saveReimbursement',value:{...value(db),declared:false,items:[{...expense,receipt:undefined}]}},'requester'));
});
test('conversion cancels an approved advance and creates one draft; a subsequent cash release is rejected',()=>{
  const db=initialData(),id='PCR-2026-0003',before=JSON.stringify(db.movements);const r=transact(db,{type:'convertToReimbursement',id,confirmed:true},'superuser');
  const request=r.db.requests.find(x=>x.id===id),claim=r.db.reimbursements.find(x=>x.id===r.id);assert.equal(request.status,'Cancelled');assert.equal(request.convertedTo,claim.id);assert.equal(claim.convertedFrom,id);assert.equal(claim.owner,request.owner);assert.equal(claim.status,'Draft');assert.equal(claim.items[0].receipt,undefined);assert.equal(JSON.stringify(r.db.movements),before);
  assert.throws(()=>transact(r.db,{type:'release',id,confirmed:true,reference:'CV-LATE'},'custodian'),/approved/);
  assert.throws(()=>transact(r.db,{type:'convertToReimbursement',id,confirmed:true},'superuser'),/unreleased/);
  assert.throws(()=>transact(r.db,{type:'saveRequest',id,value:request,submit:true},'superuser'),/protected/);
});
test('release first blocks stale conversion and leaves no reimbursement draft behind',()=>{
  const id='PCR-2026-0003';const db=transact(initialData(),{type:'release',id,confirmed:true,reference:'CV-FIRST'},'custodian').db;const before=JSON.stringify(db);
  assert.throws(()=>transact(db,{type:'convertToReimbursement',id,confirmed:true},'superuser'),/unreleased/);assert.equal(JSON.stringify(db),before);
});
test('requesters cannot convert another employee advance or approve/pay their own reimbursement',()=>{
  assert.throws(()=>transact(initialData(),{type:'convertToReimbursement',id:'PCR-2026-0003',confirmed:true},'requester'),/own/);
  const r=create();assert.throws(()=>transact(r.db,{type:'reimbursementDecision',id:r.id,status:'Approved — Pending Payment'},'requester'),/role/);assert.throws(()=>transact(approve(r.db,r.id),payment(r.id),'requester'),/role/);
});
test('empty fund blocks payment atomically; approved liability remains and external payment works once',()=>{
  const r=create();let db=approve(r.db,r.id);db.movements=db.movements.filter(m=>m.fund!=='FND-001');const before=JSON.stringify(db);
  assert.throws(()=>transact(db,payment(r.id,'Petty cash fund'),'finance'),/enough/);assert.equal(JSON.stringify(db),before);assert.equal(db.reimbursements[0].status,'Approved — Pending Payment');
  db=transact(db,payment(r.id),'finance').db;assert.equal(db.reimbursements[0].status,'Paid');assert.equal(balance(db,'FND-001'),0);assert.equal(replenishable(db,'FND-001').some(x=>x.id===r.id),false);assert.throws(()=>transact(db,payment(r.id),'finance'),/unpaid/);
});
test('paid petty cash claim posts one cash-out, reserves for replenishment and replenishes exactly once',()=>{
  const r=create();let db=approve(r.db,r.id);const before=balance(db,'FND-001');assert.equal(replenishable(db,'FND-001').some(x=>x.id===r.id),false);
  db=transact(db,payment(r.id,'Petty cash fund'),'finance').db;assert.equal(balance(db,'FND-001'),before-expense.amount);assert.equal(db.movements.filter(m=>m.source===r.id).length,1);assert.ok(replenishable(db,'FND-001').some(x=>x.id===r.id));
  const rep=transact(db,{type:'saveReplenishment',value:{fund:'FND-001',liquidations:[r.id]},submit:true},'custodian');db=rep.db;assert.equal(replenishable(db,'FND-001').some(x=>x.id===r.id),false);
  assert.throws(()=>transact(db,{type:'saveReplenishment',value:{fund:'FND-001',liquidations:[r.id]},submit:true},'custodian'),/reserved/);
  db=transact(db,{type:'replenishmentDecision',id:rep.id,status:'Approved'},'finance').db;db=transact(db,{type:'postReplenishment',id:rep.id,reference:'FUND-001',confirmed:true},'finance').db;
  assert.equal(balance(db,'FND-001'),before);assert.equal(db.reimbursements.find(x=>x.id===r.id).replenished,true);assert.throws(()=>transact(db,{type:'postReplenishment',id:rep.id,reference:'DUP',confirmed:true},'finance'),/Approve/);
});
test('duplicate uploaded receipt fingerprint blocks a second claim even with a different blob URL and owner',()=>{
  const r=create(),v={...value(r.db),owner:'Carlos Mendoza',purpose:'Different purpose',items:[{...expense,description:'Changed wording',receipt:{...expense.receipt,url:'blob:second-upload'}}],reviewedRequests:activeAdvances(r.db,'Carlos Mendoza').map(x=>x.id)};
  assert.throws(()=>transact(r.db,{type:'saveReimbursement',value:v,submit:true},'superuser'),/Matching/);
  assert.throws(()=>transact(initialData(),{type:'saveReimbursement',submit:true,value:{...value(initialData()),items:[expense,{...expense,id:'second'}]}},'requester'),/same receipt/);
});
test('correction and rejection require feedback; resubmission retains claim identity',()=>{
  const r=create();assert.throws(()=>transact(r.db,{type:'reimbursementDecision',id:r.id,status:'Needs Correction'},'approver'),/feedback/);
  let db=transact(r.db,{type:'reimbursementDecision',id:r.id,status:'Needs Correction',note:'Clarify business purpose.'},'approver').db;
  db=transact(db,{type:'saveReimbursement',id:r.id,submit:true,value:{...value(db),purpose:'Clarified filing label purchase'}},'requester').db;assert.equal(db.reimbursements[0].id,r.id);assert.equal(db.reimbursements[0].status,'Pending Approval');
  db=transact(db,{type:'reimbursementDecision',id:r.id,status:'Rejected',note:'Not an approved business purchase.'},'approver').db;assert.equal(db.reimbursements[0].status,'Rejected');assert.throws(()=>transact(db,payment(r.id),'finance'),/unpaid/);
});
test('approved and paid claims cannot be withdrawn; paid claims cannot be financially edited even by Super User',()=>{
  const r=create();let db=approve(r.db,r.id);assert.throws(()=>transact(db,{type:'cancelReimbursement',id:r.id,note:'Stop'},'requester'),/unapproved/);db=transact(db,payment(r.id),'finance').db;
  assert.throws(()=>transact(db,{type:'saveReimbursement',id:r.id,value:value(db)},'superuser'),/cannot be edited/);
  const notes=transact(db,{type:'saveTransactionNotes',recordType:'reimbursements',id:r.id,notes:'Payment reference checked.'},'superuser').db;assert.equal(notes.reimbursements[0].notes,'Payment reference checked.');assert.deepEqual(notes.movements,db.movements);
});
test('an independent claim receipt cannot be reused in a liquidation',()=>{
  const r=create();assert.throws(()=>transact(r.db,{type:'saveLiquidation',submit:true,value:{request:'PCR-2026-0001',items:[expense],returned:240000}},'requester'),/Matching/);
});
