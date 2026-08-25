import{a as t}from"./index-By5wH8Ob.js";const i=async(a=null)=>{const{data:s}=await t.get("/game-positions/list",{params:{teamId:a}});return s?.gamePositions??[]};export{i as f};
