const fetch = require('node-fetch');

async function GetGroupRank(RobloxId, GroupId) {
    let response = await fetch(`https://assetgame.roblox.com/Game/LuaWebService/HandleSocialRequest.ashx?method=GetGroupRank&playerid=${RobloxId}&groupid=${GroupId}`).then(); 
    if (response.status != 200) {return false;}
    let data = await response.text();
    let RankString = data.substring(data.indexOf('>')).substring(1);
    return RankString.substring(0, RankString.indexOf('<'));     
}

async function GetRobloxId(Username) {
    let response = await fetch(`https://api.roblox.com/users/get-by-username?username=${Username}`).then(); 
    if (response.status != 200) {return false;}
    let data = await response.json();
    return data.Id;
}

async function CheckForCode(userId, Code) {
    let response = await fetch(`https://www.roblox.com/users/${userId}/profile`).then();  
    if (response.status != 200) {return false;}
    let html = await response.text();
    if (html.indexOf(Code) != -1) {
        return true;
    }
    return false;
}

async function GetRobloxName(userId) {
    let response = await fetch(`https://api.roblox.com/users/${userId}`).then(); 
    if (response.status != 200) {return false;}
    let data = await response.json();
    return data.Username;
}

module.exports = {GetGroupRank, GetRobloxId, CheckForCode, GetRobloxName}