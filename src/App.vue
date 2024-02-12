<template>
    <div class="container-fluid">
        <div class="row g-0 h-100">
            <div class="col scrollable-col">
                <div class="accordion" id="accordion_event_categories">
                    <template v-for="(eventCategory, categoryIndex) in eventCategories" :key="categoryIndex">
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse_' + categoryIndex">
                                    {{ eventCategory.category }} Events
                                </button>
                            </h2>
                            <div :id="'collapse_' + categoryIndex" class="accordion-collapse collapse" data-bs-parent="#accordion_event_categories">
                                <div class="accordion-body">
                                    <template v-for="(event, eventIndex) in eventCategory.events" :key="eventIndex">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch" :id="'switch_' + categoryIndex + '_' + eventIndex" @change="onHookCheckStateChanged(event)">
                                            <label class="form-check-label user-select-none" :for="'switch_' + categoryIndex + '_' + eventIndex" data-bs-toggle="tooltip" data-bs-html="true" :data-bs-title="'Event: ' + event.name + '<br />Id: ' + event.id + '<br />Args: ' + event.args.join(', ')">
                                                {{ event.title }}
                                            </label>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div class="accordion-item" v-if="userSnippets.length > 0">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target='#collapse_usersnippets'>
                                User Snippets
                            </button>
                        </h2>
                        <div id="collapse_usersnippets" class="accordion-collapse collapse" data-bs-parent="#accordion_event_categories">
                            <div class="accordion-body">
                                <div class="d-grid gap-2">
                                    <button type="button" class="btn btn-primary" @click="generateCode">Hide Current User Snippet</button>
                                </div>
                                <div v-if="elunaState === 'multistate'">
                                    <template v-for="(snippet, index) in multistateSnippets" :key="index">
                                        <div class="card mt-1">
                                            <div class="card-body">
                                                <h5 class="card-title">{{ snippet.name }}</h5>
                                                <h6 class="card-subtitle mb-2 text-body-secondary">by {{ snippet.author }}</h6>
                                                <button type="button" class="btn btn-primary" @click="onShowUserSnippet(snippet)">Show</button>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                                <div v-else>
                                    <template v-for="(snippet, index) in singleThreadedSnippets" :key="index">
                                        <div class="card mt-1">
                                            <div class="card-body">
                                                <h5 class="card-title">{{ snippet.name }}</h5>
                                                <h6 class="card-subtitle mb-2 text-body-secondary">by {{ snippet.author }}</h6>
                                                <button type="button" class="btn btn-primary" @click="onShowUserSnippet(snippet)">Show</button>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card mt-2">
                    <div class="card-body">
                        <h5 class="card-title">Options</h5>
                        <div class="btn-group" role="group">
                            <input v-model="elunaState" type="radio" value="multistate" class="btn-check" id="elunamultistate" name="elunaState" autocomplete="off" @change="generateCode" checked>
                            <label class="btn btn-outline-primary" for="elunamultistate">Multistate</label>

                            <input v-model="elunaState" type="radio" class="btn-check" value="singlethreaded" id="elunasinglethreaded" name="elunaState" autocomplete="off" @change="generateCode">
                            <label class="btn btn-outline-secondary" for="elunasinglethreaded">Single Threaded</label>
                        </div>
                        <div class="form-floating mt-2" v-if="elunaState === 'multistate'">
                            <input v-model="mapId" type="number" class="form-control" id="mapId" placeholder="1" @input="generateCode">
                            <label for="mapId">Map Id</label>
                        </div>

                        <p class="card-text mt-2">Add your own user snippets on the <a href="https://github.com/Kaev/ElunaSnippetGenerator/">GitHub repository</a>.</p>
                        <p class="card-text">Made with <span style="color: red;">♡</span> by Kaev for the <a href="https://discord.gg/2FVqBGCkvk">WoW Modding</a> and <a href="https://discord.gg/h8jdsgGTg8">Eluna</a> communities.</p>
                    </div>
                </div>
            </div>
            <div class="col scrollable-col h-100">
                <div class="relative-container">
                    <div class="button-container">
                        <button type="button" class="btn btn-dark btn-sm d-flex align-items-center justify-content-center" @click="copySnippet">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" height="16" fill="white">
                                <path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/>
                            </svg>
                        </button>
                    </div>
                    <highlightjs class="m-0" language="lua" :code="code" />
                </div>
            </div>
        </div>
    </div>
    <div ref="toast" class="toast bg-success align-items-center" role="alert" data-bs-delay="2500">
        <div class="toast-body text-white">
            Copied
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, watchEffect } from 'vue'
    import { Toast, Tooltip } from 'bootstrap'
    import * as Sqrl from 'squirrelly/dist/browser/squirrelly.min.js'
    
    const eventCategories = ref([
    {
        category: "Battleground",
        events: [
            { name: "BG_EVENT_ON_START", id: "1", args:  [ "event", "bg", "bgId", "instanceId" ], title: "Start" },
            { name: "BG_EVENT_ON_END", id: "2", args:  [ "event", "bg", "bgId", "instanceId", "winner" ], title: "End" },
            { name: "BG_EVENT_ON_CREATE", id: "3", args:  [ "event", "bg", "bgId", "instanceId" ], title: "Create" },
            { name: "BG_EVENT_ON_PRE_DESTROY", id: "4", args:  [ "event", "bg", "bgId", "instanceId" ], title: "Pre Destroy" },
        ],
        registerHookName: "RegisterBGEvent"
    },
    {
        category: "Creature",
        events: [
            { name: "CREATURE_EVENT_ON_ENTER_COMBAT", id: "1", args:  [ "event", "creature", "target" ], title: "Enter Combat" },
            { name: "CREATURE_EVENT_ON_LEAVE_COMBAT", id: "2", args:  [ "event", "creature" ], title: "Leave Combat" },
            { name: "CREATURE_EVENT_ON_TARGET_DIED", id: "3", args:  [ "event", "creature", "victim" ], title: "Target Died" },
            { name: "CREATURE_EVENT_ON_DIED", id: "4", args:  [ "event", "creature", "killer" ], title: "Died" },
            { name: "CREATURE_EVENT_ON_SPAWN", id: "5", args:  [ "event", "creature" ], title: "Spawn" },
            { name: "CREATURE_EVENT_ON_REACH_WP", id: "6", args:  [ "event", "creature", "type", "id" ], title: "Reach Waypoint" },
            { name: "CREATURE_EVENT_ON_AIUPDATE", id: "7", args:  [ "event", "creature", "diff" ], title: "AI Update" },
            { name: "CREATURE_EVENT_ON_RECEIVE_EMOTE", id: "8", args:  [ "event", "creature", "player", "emoteId" ], title: "Receive Emote" },
            { name: "CREATURE_EVENT_ON_DAMAGE_TAKEN", id: "9", args:  [ "event", "creature", "attacker", "damage" ], title: "Damage Taken" },
            { name: "CREATURE_EVENT_ON_PRE_COMBAT", id: "10", args:  [ "event", "creature", "target" ], title: "Pre Combat" },
            { name: "CREATURE_EVENT_ON_OWNER_ATTACKED", id: "12", args:  [ "event", "creature", "target" ], title: "Owner Attacked" },
            { name: "CREATURE_EVENT_ON_OWNER_ATTACKED_AT", id: "13", args:  [ "event", "creature", "attacker" ], title: "Owner Attacked At" },
            { name: "CREATURE_EVENT_ON_HIT_BY_SPELL", id: "14", args:  [ "event", "creature", "caster", "spellId" ], title: "Hit By Spell" },
            { name: "CREATURE_EVENT_ON_SPELL_HIT_TARGET", id: "15", args:  [ "event", "creature", "target", "spellId" ], title: "Spell Hit Target" },
            { name: "CREATURE_EVENT_ON_JUST_SUMMONED_CREATURE", id: "19", args:  [ "event", "creature", "summon" ], title: "Just Summoned Creature" },
            { name: "CREATURE_EVENT_ON_SUMMONED_CREATURE_DESPAWN", id: "20", args:  [ "event", "creature", "summon" ], title: "Summoned Creature Despawn" },
            { name: "CREATURE_EVENT_ON_SUMMONED_CREATURE_DIED", id: "21", args:  [ "event", "creature", "summon", "killer" ], title: "Summoned Creature Died" },
            { name: "CREATURE_EVENT_ON_SUMMONED", id: "22", args:  [ "event", "creature", "summoner" ], title: "Summoned" },
            { name: "CREATURE_EVENT_ON_RESET", id: "23", args:  [ "event", "creature" ], title: "Reset" },
            { name: "CREATURE_EVENT_ON_REACH_HOME", id: "24", args:  [ "event", "creature" ], title: "Reach Home" },
            { name: "CREATURE_EVENT_ON_CORPSE_REMOVED", id: "26", args:  [ "event", "creature", "respawnDelay" ], title: "Corpse Removed" },
            { name: "CREATURE_EVENT_ON_MOVE_IN_LOS", id: "27", args:  [ "event", "creature", "unit" ], title: "Move in LoS" },
            { name: "CREATURE_EVENT_ON_DUMMY_EFFECT", id: "30", args:  [ "event", "caster", "spellId", "effIndex", "creature" ], title: "Dummy Effect" },
            { name: "CREATURE_EVENT_ON_QUEST_ACCEPT", id: "31", args:  [ "event", "player", "creature", "quest" ], title: "Quest Accept" },
            { name: "CREATURE_EVENT_ON_QUEST_REWARD", id: "34", args:  [ "event", "player", "creature", "quest", "opt" ], title: "Quest Reward" },
            { name: "CREATURE_EVENT_ON_DIALOG_STATUS", id: "35", args:  [ "event", "player", "creature" ], title: "Dialog Status" },
            { name: "CREATURE_EVENT_ON_ADD", id: "36", args:  [ "event", "creature" ], title: "Add" },
            { name: "CREATURE_EVENT_ON_REMOVE", id: "37", args:  [ "event", "creature" ], title: "Remove" },
        ],
        registerHookName: "RegisterCreatureEvent"
    },
    {
        category: "CreatureGossip",
        events: [
            { name: "GOSSIP_EVENT_ON_HELLO", id: "1", args:  [ "event", "player", "creature" ], title: "Hello" },
            { name: "GOSSIP_EVENT_ON_SELECT", id: "2", args:  [ "event", "player", "creature", "sender", "intId", "code", "menuId" ], title: "Select" },
        ],
        registerHookName: "RegisterCreatureGossipEvent"
    },
    {
        category: "GameObject",
        events: [
            { name: "GAMEOBJECT_EVENT_ON_AIUPDATE", id: "1", args:  [ "event", "gameObject", "diff" ], title: "AI Update" },
            { name: "GAMEOBJECT_EVENT_ON_SPAWN", id: "2", args:  [ "event", "gameObject" ], title: "Spawn" },
            { name: "GAMEOBJECT_EVENT_ON_DUMMY_EFFECT", id: "3", args:  [ "event", "caster", "spellId", "effIndex", "gameObject" ], title: "Dummy Effect" },
            { name: "GAMEOBJECT_EVENT_ON_QUEST_ACCEPT", id: "4", args:  [ "event", "player", "gameObject", "quest" ], title: "Quest Accept" },
            { name: "GAMEOBJECT_EVENT_ON_QUEST_REWARD", id: "5", args:  [ "event", "player", "gameObject", "quest", "opt" ], title: "Quest Reward" },
            { name: "GAMEOBJECT_EVENT_ON_DIALOG_STATUS", id: "6", args:  [ "event", "player", "gameObject" ], title: "Dialog Status" },
            { name: "GAMEOBJECT_EVENT_ON_DESTROYED", id: "7", args:  [ "event", "gameObject", "player" ], title: "Destroyed" },
            { name: "GAMEOBJECT_EVENT_ON_DAMAGED", id: "8", args:  [ "event", "gameObject", "player" ], title: "Damaged" },
            { name: "GAMEOBJECT_EVENT_ON_LOOT_STATE_CHANGE", id: "9", args:  [ "event", "gameObject", "state" ], title: "Loot State Changed" },
            { name: "GAMEOBJECT_EVENT_ON_GO_STATE_CHANGED", id: "10", args:  [ "event", "gameObject", "state" ], title: "Go State Changed" },
            { name: "GAMEOBJECT_EVENT_ON_ADD", id: "12", args:  [ "event", "gameObject" ], title: "Add" },
            { name: "GAMEOBJECT_EVENT_ON_REMOVE", id: "13", args:  [ "event", "gameObject" ], title: "Remove" },
            { name: "GAMEOBJECT_EVENT_ON_USE", id: "14", args:  [ "event", "gameObject", "player" ], title: "Use" },
        ],
        registerHookName: "RegisterGameObjectEvent"
    },
    {
        category: "GameObjectGossip",
        events: [
            { name: "GOSSIP_EVENT_ON_HELLO", id: "1", args:  [ "event", "player", "gameObject" ], title: "Hello" },
            { name: "GOSSIP_EVENT_ON_SELECT", id: "2", args:  [ "event", "player", "gameObject", "sender", "intId", "code", "menuId" ], title: "Select" },
        ],
        registerHookName: "RegisterGameObjectGossipEvent"
    },
    {
        category: "Group",
        events: [
            { name: "GROUP_EVENT_ON_MEMBER_ADD", id: "1", args:  [ "event", "group", "guid" ], title: "Member Add", inWorldState: true },
            { name: "GROUP_EVENT_ON_MEMBER_INVITE", id: "2", args:  [ "event", "group", "guid" ], title: "Member Invite", inWorldState: true },
            { name: "GROUP_EVENT_ON_MEMBER_REMOVE", id: "3", args:  [ "event", "group", "guid", "method" ], title: "Member Remove", inWorldState: true },
            { name: "GROUP_EVENT_ON_LEADER_CHANGE", id: "4", args:  [ "event", "group", "newLeaderGuid", "oldLeaderGuid" ], title: "Leader Change", inWorldState: true },
            { name: "GROUP_EVENT_ON_DISBAND", id: "5", args:  [ "event", "group" ], title: "Disband", inWorldState: true },
            { name: "GROUP_EVENT_ON_CREATE", id: "6", args:  [ "event", "group", "leaderGuid", "groupType" ], title: "Create", inWorldState: true },
            { name: "GROUP_EVENT_ON_MEMBER_ACCEPT", id: "7", args:  [ "event", "group", "player" ], title: "Member Accept", inWorldState: true },
        ],
        registerHookName: "RegisterGroupEvent"
    },
    {
        category: "Guild",
        events: [
            { name: "GUILD_EVENT_ON_ADD_MEMBER", id: "1", args:  [ "event", "guild", "player", "rank" ], title: "Add Member", inWorldState: true },
            { name: "GUILD_EVENT_ON_REMOVE_MEMBER", id: "2", args:  [ "event", "guild", "player", "isDisbanding" ], title: "Remove Member", inWorldState: true },
            { name: "GUILD_EVENT_ON_MOTD_CHANGE", id: "3", args:  [ "event", "guild", "newMOTD" ], title: "MOTD Change", inWorldState: true },
            { name: "GUILD_EVENT_ON_INFO_CHANGE", id: "4", args:  [ "event", "guild", "newInfo" ], title: "Info Change", inWorldState: true },
            { name: "GUILD_EVENT_ON_CREATE", id: "5", args:  [ "event", "guild", "leader", "name" ], title: "Create", inWorldState: true },
            { name: "GUILD_EVENT_ON_DISBAND", id: "6", args:  [ "event", "guild" ], title: "Disband", inWorldState: true },
            { name: "GUILD_EVENT_ON_MONEY_WITHDRAW", id: "7", args:  [ "event", "guild", "player", "amount", "isRepair" ], title: "Money Withdraw", inWorldState: true },
            { name: "GUILD_EVENT_ON_MONEY_DEPOSIT", id: "8", args:  [ "event", "guild", "player", "amount" ], title: "Money Deposit", inWorldState: true },
            { name: "GUILD_EVENT_ON_ITEM_MOVE", id: "9", args:  [ "event", "guild", "player", "item", "isSrcBank", "srcContainer", "srcSlotId", "isDestBank", "destContainer", "destSlotId" ], title: "Item Move", inWorldState: true },
            { name: "GUILD_EVENT_ON_EVENT", id: "10", args:  [ "event", "guild", "eventType", "playerGuidLow1", "playerGuidLow2", "newRank" ], title: "Event", inWorldState: true },
            { name: "GUILD_EVENT_ON_BANK_EVENT", id: "11", args:  [ "event", "guild", "eventType", "tabId", "playerGuidLow", "itemOrMoney", "itemStackCount", "destTabId" ], title: "Bank Event", inWorldState: true },
        ],
        registerHookName: "RegisterGuildEvent"
    },
    {
        category: "Instance",
        events: [
            { name: "INSTANCE_EVENT_ON_INITIALIZE", id: "1", args:  [ "event", "instanceData", "map" ], title: "Initialize" },
            { name: "INSTANCE_EVENT_ON_LOAD", id: "2", args:  [ "event", "instanceData", "map" ], title: "Load" },
            { name: "INSTANCE_EVENT_ON_UPDATE", id: "3", args:  [ "event", "instanceData", "map", "diff" ], title: "Update" },
            { name: "INSTANCE_EVENT_ON_PLAYER_ENTER", id: "4", args:  [ "event", "instanceData", "map", "player" ], title: "Player Enter" },
            { name: "INSTANCE_EVENT_ON_CREATURE_CREATE", id: "5", args:  [ "event", "instanceData", "map", "creature" ], title: "Creature Create" },
            { name: "INSTANCE_EVENT_ON_GAMEOBJECT_CREATE", id: "6", args:  [ "event", "instanceData", "map", "gameObject" ], title: "Gameobject Create" },
            { name: "INSTANCE_EVENT_ON_CHECK_ENCOUNTER_IN_PROGRESS", id: "7", args:  [ "event", "instanceData", "map" ], title: "Check Encounter In Progress" },
        ],
        registerHookName: "RegisterInstanceEvent"
    },
    {
        category: "Item",
        events: [
            { name: "ITEM_EVENT_ON_DUMMY_EFFECT", id: "1", args:  [ "event", "caster", "spellId", "effIndex", "item" ], title: "Dummy Effect" },
            { name: "ITEM_EVENT_ON_USE", id: "2", args:  [ "event", "player", "item", "target" ], title: "Use" },
            { name: "ITEM_EVENT_ON_QUEST_ACCEPT", id: "3", args:  [ "event", "player", "item", "quest" ], title: "Quest Accept" },
            { name: "ITEM_EVENT_ON_EXPIRE", id: "4", args:  [ "event", "player", "itemId" ], title: "Expire" },
            { name: "ITEM_EVENT_ON_REMOVE", id: "5", args:  [ "event", "player", "item" ], title: "Remove" },
            { name: "ITEM_EVENT_ON_ADD", id: "6", args:  [ "event", "player", "item" ], title: "Add" },
        ],
        registerHookName: "RegisterItemEvent"
    },
    {
        category: "ItemGossip",
        events: [
            { name: "GOSSIP_EVENT_ON_HELLO", id: "1", args:  [ "event", "player", "item" ], title: "Hello" },
            { name: "GOSSIP_EVENT_ON_SELECT", id: "2", args:  [ "event", "player", "item", "sender", "intId", "code", "menuId" ], title: "Select" },
        ],
        registerHookName: "RegisterItemGossipEvent"
    },
    {
        category: "Map",
        events: [
            { name: "INSTANCE_EVENT_ON_INITIALIZE", id: "1", args:  [ "event", "instanceData", "map" ], title: "Initialize" },
            { name: "INSTANCE_EVENT_ON_LOAD", id: "2", args:  [ "event", "instanceData", "map" ], title: "Load" },
            { name: "INSTANCE_EVENT_ON_UPDATE", id: "3", args:  [ "event", "instanceData", "map", "diff" ], title: "Update" },
            { name: "INSTANCE_EVENT_ON_PLAYER_ENTER", id: "4", args:  [ "event", "instanceData", "map", "player" ], title: "Player Enter" },
            { name: "INSTANCE_EVENT_ON_CREATURE_CREATE", id: "5", args:  [ "event", "instanceData", "map", "creature" ], title: "Creature Create" },
            { name: "INSTANCE_EVENT_ON_GAMEOBJECT_CREATE", id: "6", args:  [ "event", "instanceData", "map", "gameObject" ], title: "Gameobject Create" },
            { name: "INSTANCE_EVENT_ON_CHECK_ENCOUNTER_IN_PROGRESS", id: "7", args:  [ "event", "instanceData", "map" ], title: "Check Encounter In Progress" },
        ],
        registerHookName: "RegisterMapEvent"
    },
    {
        category: "Packet",
        events: [
            { name: "PACKET_EVENT_ON_PACKET_RECEIVE", id: "5", args:  [ "event", "packet", "player" ], title: "Packet Receive" },
            { name: "PACKET_EVENT_ON_PACKET_SEND", id: "7", args:  [ "event", "packet", "player" ], title: "Packet Send" },
        ],
        registerHookName: "RegisterPacketEvent"
    },
    {
        category: "Player",
        events: [
            { name: "PLAYER_EVENT_ON_CHARACTER_CREATE", id: "1", args:  [ "event", "player" ], title: "Character Create", inWorldState: true },
            { name: "PLAYER_EVENT_ON_CHARACTER_DELETE", id: "2", args:  [ "event", "guid" ], title: "Character Delete", inWorldState: true },
            { name: "PLAYER_EVENT_ON_LOGIN", id: "3", args:  [ "event", "player" ], title: "Login" },
            { name: "PLAYER_EVENT_ON_LOGOUT", id: "4", args:  [ "event", "player" ], title: "Logout" },
            { name: "PLAYER_EVENT_ON_SPELL_CAST", id: "5", args:  [ "event", "player", "spell", "skipCheck" ], title: "Spell Cast" },
            { name: "PLAYER_EVENT_ON_KILL_PLAYER", id: "6", args:  [ "event", "killer", "killed" ], title: "Kill Player" },
            { name: "PLAYER_EVENT_ON_KILL_CREATURE", id: "7", args:  [ "event", "killer", "killed" ], title: "Kill Creature" },
            { name: "PLAYER_EVENT_ON_KILLED_BY_CREATURE", id: "8", args:  [ "event", "killer", "killed" ], title: "Killed By Creature" },
            { name: "PLAYER_EVENT_ON_DUEL_REQUEST", id: "9", args:  [ "event", "target", "challenger" ], title: "Duel Request" },
            { name: "PLAYER_EVENT_ON_DUEL_START", id: "10", args:  [ "event", "player1", "player2" ], title: "Duel Start" },
            { name: "PLAYER_EVENT_ON_DUEL_END", id: "11", args:  [ "event", "winner", "loser", "type" ], title: "Duel End" },
            { name: "PLAYER_EVENT_ON_GIVE_XP", id: "12", args:  [ "event", "player", "amount", "victim" ], title: "Give XP" },
            { name: "PLAYER_EVENT_ON_LEVEL_CHANGE", id: "13", args:  [ "event", "player", "oldLevel" ], title: "Level Change" },
            { name: "PLAYER_EVENT_ON_MONEY_CHANGE", id: "14", args:  [ "event", "player", "amount" ], title: "Money Change" },
            { name: "PLAYER_EVENT_ON_REPUTATION_CHANGE", id: "15", args:  [ "event", "player", "factionId", "standing", "incremental" ], title: "Reputation Change" },
            { name: "PLAYER_EVENT_ON_TALENTS_CHANGE", id: "16", args:  [ "event", "player", "points" ], title: "Talents Change" },
            { name: "PLAYER_EVENT_ON_TALENTS_RESET", id: "17", args:  [ "event", "player", "noCost" ], title: "Talents Reset" },
            { name: "PLAYER_EVENT_ON_CHAT", id: "18", args:  [ "event", "player", "msg", "type", "lang" ], title: "Chat" },
            { name: "PLAYER_EVENT_ON_WHISPER", id: "19", args:  [ "event", "player", "msg", "type", "lang", "receiver" ], title: "Whisper" },
            { name: "PLAYER_EVENT_ON_GROUP_CHAT", id: "20", args:  [ "event", "player", "msg", "type", "lang", "group" ], title: "Group Chat" },
            { name: "PLAYER_EVENT_ON_GUILD_CHAT", id: "21", args:  [ "event", "player", "msg", "type", "lang", "guild" ], title: "Guild Chat" },
            { name: "PLAYER_EVENT_ON_CHANNEL_CHAT", id: "22", args:  [ "event", "player", "msg", "type", "lang", "channelId" ], title: "Channel Chat" },
            { name: "PLAYER_EVENT_ON_EMOTE", id: "23", args:  [ "event", "player", "emote" ], title: "Emote" },
            { name: "PLAYER_EVENT_ON_TEXT_EMOTE", id: "24", args:  [ "event", "player", "textEmote", "emoteNum", "guid" ], title: "Text Emote" },
            { name: "PLAYER_EVENT_ON_SAVE", id: "25", args:  [ "event", "player" ], title: "Save" },
            { name: "PLAYER_EVENT_ON_BIND_TO_INSTANCE", id: "26", args:  [ "event", "player", "difficulty", "mapId", "permanent" ], title: "Bind To Instance" },
            { name: "PLAYER_EVENT_ON_UPDATE_ZONE", id: "27", args:  [ "event", "player", "newZone", "newArea" ], title: "Update Zone" },
            { name: "PLAYER_EVENT_ON_MAP_CHANGE", id: "28", args:  [ "event", "player" ], title: "Map Change" },
            { name: "PLAYER_EVENT_ON_EQUIP", id: "29", args:  [ "event", "player", "item", "bag", "slot" ], title: "Equip" },
            { name: "PLAYER_EVENT_ON_FIRST_LOGIN", id: "30", args:  [ "event", "player" ], title: "First Login" },
            { name: "PLAYER_EVENT_ON_CAN_USE_ITEM", id: "31", args:  [ "event", "player", "itemId" ], title: "Can Use Item" },
            { name: "PLAYER_EVENT_ON_LOOT_ITEM", id: "32", args:  [ "event", "player", "item", "count" ], title: "Loot Item" },
            { name: "PLAYER_EVENT_ON_ENTER_COMBAT", id: "33", args:  [ "event", "player", "enemy" ], title: "Enter Combat" },
            { name: "PLAYER_EVENT_ON_LEAVE_COMBAT", id: "34", args:  [ "event", "player" ], title: "Leave Combat" },
            { name: "PLAYER_EVENT_ON_REPOP", id: "35", args:  [ "event", "player" ], title: "Repop" },
            { name: "PLAYER_EVENT_ON_RESURRECT", id: "36", args:  [ "event", "player" ], title: "Resurrect" },
            { name: "PLAYER_EVENT_ON_LOOT_MONEY", id: "37", args:  [ "event", "player", "amount" ], title: "Loot Money" },
            { name: "PLAYER_EVENT_ON_QUEST_ABANDON", id: "38", args:  [ "event", "player", "questId" ], title: "Quest Abandon" },
            { name: "PLAYER_EVENT_ON_LEARN_TALENTS", id: "39", args:  [ "event", "player", "talentId", "talentRank", "spellId" ], title: "Learn Talents" },
            { name: "PLAYER_EVENT_ON_ENVIRONMENTAL_DEATH", id: "40", args:  [ "event", "player", "environmentalDamageType" ], title: "Environmental Death" },
            { name: "PLAYER_EVENT_ON_TRADE_ACCEPT", id: "41", args:  [ "event", "player", "target" ], title: "Trade Accept" },
            { name: "PLAYER_EVENT_ON_COMMAND", id: "42", args:  [ "event", "player", "command" ], title: "Command" },
            { name: "PLAYER_EVENT_ON_SKILL_CHANGE", id: "43", args:  [ "event", "player", "skillId", "skillValue" ], title: "Skill Change" },
            { name: "PLAYER_EVENT_ON_LEARN_SPELL", id: "44", args:  [ "event", "player", "spellId" ], title: "Learn Spell" },
            { name: "PLAYER_EVENT_ON_ACHIEVEMENT_COMPLETE", id: "45", args:  [ "event", "player", "achievementId" ], title: "Achievement Complete" },
            { name: "PLAYER_EVENT_ON_DISCOVER_AREA", id: "46", args:  [ "event", "player", "area" ], title: "Discover Area" },
            { name: "PLAYER_EVENT_ON_UPDATE_AREA", id: "47", args:  [ "event", "player", "oldArea", "newArea" ], title: "Update Area" },
            { name: "PLAYER_EVENT_ON_TRADE_INIT", id: "48", args:  [ "event", "player", "target" ], title: "Trade Init" },
            { name: "PLAYER_EVENT_ON_SEND_MAIL", id: "49", args:  [ "event", "player", "recipientGuid" ], title: "Send Mail" },
            { name: "PLAYER_EVENT_ON_QUEST_STATUS_CHANGED", id: "54", args:  [ "event", "player", "questId", "status" ], title: "Quest Status Changed" },
        ],
        registerHookName: "RegisterPlayerEvent"
    },
    {
        category: "PlayerGossip",
        events: [
            { name: "GOSSIP_EVENT_ON_HELLO", id: "1", args:  [ "event", "player", "object" ], title: "Hello" },
            { name: "GOSSIP_EVENT_ON_SELECT", id: "2", args:  [ "event", "player", "object", "sender", "intId", "code", "menuId" ], title: "Select" },
        ],
        registerHookName: "RegisterPlayerGossipEvent"
    },
    {
        category: "Server",
        events: [
            { name: "SERVER_EVENT_ON_PACKET_RECEIVE", id: "5", args:  [ "event", "packet", "player" ], title: "Server Packet Receive" },
            { name: "SERVER_EVENT_ON_PACKET_SEND", id: "7", args:  [ "event", "packet", "player" ], title: "Server Packet Send" },
            { name: "WORLD_EVENT_ON_OPEN_STATE_CHANGE", id: "8", args:  [ "event", "open" ], title: "Open State Change" },
            { name: "WORLD_EVENT_ON_CONFIG_LOAD", id: "9", args:  [ "event", "reload" ], title: "Config Load" },
            { name: "WORLD_EVENT_ON_SHUTDOWN_INIT", id: "11", args:  [ "event", "code", "mask" ], title: "Shutdown Init" },
            { name: "WORLD_EVENT_ON_SHUTDOWN_CANCEL", id: "12", args:  [ "event" ], title: "Shutdown Cancel" },
            { name: "WORLD_EVENT_ON_UPDATE", id: "13", args:  [ "event", "diff" ], title: "Update" },
            { name: "WORLD_EVENT_ON_STARTUP", id: "14", args:  [ "event" ], title: "Startup" },
            { name: "WORLD_EVENT_ON_SHUTDOWN", id: "15", args:  [ "event" ], title: "Shutdown" },
            { name: "ELUNA_EVENT_ON_LUA_STATE_CLOSE", id: "16", args:  [ "event" ], title: "Lua State Close" },
            { name: "MAP_EVENT_ON_CREATE", id: "17", args:  [ "event", "map" ], title: "Map Create" },
            { name: "MAP_EVENT_ON_DESTROY", id: "18", args:  [ "event", "map" ], title: "Map Destroy" },
            { name: "MAP_EVENT_ON_PLAYER_ENTER", id: "21", args:  [ "event", "map", "player" ], title: "Map Player Enter" },
            { name: "MAP_EVENT_ON_PLAYER_LEAVE", id: "22", args:  [ "event", "map", "player" ], title: "Map Player Leave" },
            { name: "MAP_EVENT_ON_UPDATE", id: "23", args:  [ "event", "map", "diff" ], title: "Map Update" },
            { name: "TRIGGER_EVENT_ON_TRIGGER", id: "24", args:  [ "event", "player", "triggerId" ], title: "Trigger" },
            { name: "WEATHER_EVENT_ON_CHANGE", id: "25", args:  [ "event", "zoneId", "state", "grade" ], title: "Weather Change", inWorldState: true },
            { name: "AUCTION_EVENT_ON_ADD", id: "26", args:  [ "event", "auctionId", "owner", "item", "expireTime", "buyout", "startBid", "currentBid", "bidderGuidLow" ], title: "Auction Add", inWorldState: true },
            { name: "AUCTION_EVENT_ON_REMOVE", id: "27", args:  [ "event", "auctionId", "owner", "item", "expireTime", "buyout", "startBid", "currentBid", "bidderGuidLow" ], title: "Auction Remove", inWorldState: true },
            { name: "AUCTION_EVENT_ON_SUCCESSFUL", id: "28", args:  [ "event", "auctionId", "owner", "item", "expireTime", "buyout", "startBid", "currentBid", "bidderGuidLow" ], title: "Auction Successful", inWorldState: true },
            { name: "AUCTION_EVENT_ON_EXPIRE", id: "29", args:  [ "event", "auctionId", "owner", "item", "expireTime", "buyout", "startBid", "currentBid", "bidderGuidLow" ], title: "Auction Expire", inWorldState: true },
            { name: "ADDON_EVENT_ON_MESSAGE", id: "30", args:  [ "event", "sender", "type", "prefix", "msg", "target" ], title: "Addon Message" },
            { name: "WORLD_EVENT_ON_DELETE_CREATURE", id: "31", args:  [ "event", "creature" ], title: "Delete Creature" },
            { name: "WORLD_EVENT_ON_DELETE_GAMEOBJECT", id: "32", args:  [ "event", "gameObject" ], title: "Delete Gameobject" },
            { name: "ELUNA_EVENT_ON_LUA_STATE_OPEN", id: "33", args:  [ "event" ], title: "Lua State Open" },
            { name: "GAME_EVENT_START", id: "34", args:  [ "event", "gameEventId" ], title: "Game Event Start" },
            { name: "GAME_EVENT_STOP", id: "35", args:  [ "event", "gameEventId" ], title: "Game Event Stop" },
        ],
        registerHookName: "RegisterServerEvent"
    },
    {
        category: "Spell",
        events: [
            { name: "SPELL_EVENT_ON_CAST", id: "1", args:  [ "event", "spell", "skipCheck" ], title: "Cast" },
        ],
        registerHookName: "RegisterSpellEvent"
    },
    {
        category: "UniqueCreature",
        events: [
            { name: "CREATURE_EVENT_ON_ENTER_COMBAT", id: "1", args:  [ "event", "creature", "target" ], title: "Enter Combat" },
            { name: "CREATURE_EVENT_ON_LEAVE_COMBAT", id: "2", args:  [ "event", "creature" ], title: "Leave Combat" },
            { name: "CREATURE_EVENT_ON_TARGET_DIED", id: "3", args:  [ "event", "creature", "victim" ], title: "Target Died" },
            { name: "CREATURE_EVENT_ON_DIED", id: "4", args:  [ "event", "creature", "killer" ], title: "Died" },
            { name: "CREATURE_EVENT_ON_SPAWN", id: "5", args:  [ "event", "creature" ], title: "Spawn" },
            { name: "CREATURE_EVENT_ON_REACH_WP", id: "6", args:  [ "event", "creature", "type", "id" ], title: "Reach Waypoint" },
            { name: "CREATURE_EVENT_ON_AIUPDATE", id: "7", args:  [ "event", "creature", "diff" ], title: "AI Update" },
            { name: "CREATURE_EVENT_ON_RECEIVE_EMOTE", id: "8", args:  [ "event", "creature", "player", "emoteId" ], title: "Receive Emote" },
            { name: "CREATURE_EVENT_ON_DAMAGE_TAKEN", id: "9", args:  [ "event", "creature", "attacker", "damage" ], title: "Damage Taken" },
            { name: "CREATURE_EVENT_ON_PRE_COMBAT", id: "10", args:  [ "event", "creature", "target" ], title: "Pre Combat" },
            { name: "CREATURE_EVENT_ON_ATTACKED_AT", id: "11", args:  [ "event", "creature", "attacker" ], title: "Attacked At" },
            { name: "CREATURE_EVENT_ON_OWNER_ATTACKED", id: "12", args:  [ "event", "creature", "target" ], title: "Owner Attacked" },
            { name: "CREATURE_EVENT_ON_OWNER_ATTACKED_AT", id: "13", args:  [ "event", "creature", "attacker" ], title: "Owner Attacked At" },
            { name: "CREATURE_EVENT_ON_HIT_BY_SPELL", id: "14", args:  [ "event", "creature", "caster", "spellId" ], title: "Hit By Spell" },
            { name: "CREATURE_EVENT_ON_SPELL_HIT_TARGET", id: "15", args:  [ "event", "creature", "target", "spellId" ], title: "Spell Hit Target" },
            { name: "CREATURE_EVENT_ON_JUST_SUMMONED_CREATURE", id: "19", args:  [ "event", "creature", "summon" ], title: "Just Summoned Creature" },
            { name: "CREATURE_EVENT_ON_SUMMONED_CREATURE_DESPAWN", id: "20", args:  [ "event", "creature", "summon" ], title: "Summoned Creature Despawn" },
            { name: "CREATURE_EVENT_ON_SUMMONED_CREATURE_DIED", id: "21", args:  [ "event", "creature", "summon", "killer" ], title: "Summoned Creature Died" },
            { name: "CREATURE_EVENT_ON_SUMMONED", id: "22", args:  [ "event", "creature", "summoner" ], title: "Summoned" },
            { name: "CREATURE_EVENT_ON_RESET", id: "23", args:  [ "event", "creature" ], title: "Reset" },
            { name: "CREATURE_EVENT_ON_REACH_HOME", id: "24", args:  [ "event", "creature" ], title: "Reach Home" },
            { name: "CREATURE_EVENT_ON_CORPSE_REMOVED", id: "26", args:  [ "event", "creature", "respawnDelay" ], title: "Corpse Removed" },
            { name: "CREATURE_EVENT_ON_MOVE_IN_LOS", id: "27", args:  [ "event", "creature", "unit" ], title: "Move In LoS" },
            { name: "CREATURE_EVENT_ON_DUMMY_EFFECT", id: "30", args:  [ "event", "caster", "spellId", "effIndex", "creature" ], title: "Dummy Effect" },
            { name: "CREATURE_EVENT_ON_QUEST_ACCEPT", id: "31", args:  [ "event", "player", "creature", "quest" ], title: "Quest Accept" },
            { name: "CREATURE_EVENT_ON_QUEST_REWARD", id: "34", args:  [ "event", "player", "creature", "quest", "opt" ], title: "Quest Reward" },
            { name: "CREATURE_EVENT_ON_DIALOG_STATUS", id: "35", args:  [ "event", "player", "creature" ], title: "Dialog Status" },
            { name: "CREATURE_EVENT_ON_ADD", id: "36", args:  [ "event", "creature" ], title: "Add" },
            { name: "CREATURE_EVENT_ON_REMOVE", id: "37", args:  [ "event", "creature" ], title: "Remove" },
        ],
        registerHookName: "RegisterUniqueCreatureEvent"
    }
    ]);
    const singleThreadedTemplate = `
{{@each(it) => hook}}
{{@each(hook.functions) => func}}
local function {{func.name}}({{func.args}})

end

{{/each_}}
{{/each_}}

{{@each(it) => hook}}
{{@if(hook.registrations.length > 0)}}
-- {{hook.category}} Events
{{/if}}
{{@each(hook.identifiers) => identifier}}
local {{identifier.name}} = {{identifier.id}};
{{/each_}}
{{@each(hook.registrations) => registration}}
{{registration.registerHookName}}({{registration.name}}, {{registration.functionName}});
{{/each_}}
{{@if(hook.registrations.length > 0)}}

{{/if}}
{{/each_}}
`;
    const multistateTemplate = `
-- World State or Compatibility Mode
if (GetStateMapId() == -1 or IsCompatibilityMode()) then
{{@each(it.hooks) => hook}}
{{@each(hook.worldStateFunctions) => func}}
    local function {{func.name}}({{func.args}})

    end

{{/each_}}
{{/each_}}
{{@each(it.hooks) => hook}}
{{@if(hook.worldStateRegistrations.length > 0)}}

    -- {{hook.category}} Events
{{/if}}
{{@each(hook.worldStateIdentifiers) => identifier}}
    local {{identifier.name}} = {{identifier.id}};
{{/each_}}
{{@each(hook.worldStateRegistrations) => registration}}
    {{registration.registerHookName}}({{registration.name}}, {{registration.functionName}});
{{/each_}}
{{@if(hook.worldStateRegistrations.length > 0)}}
{{/if}}
{{/each_}}
end

-- Map State State or Compatibility Mode
if (GetStateMapId() == {{ it.mapId }} or IsCompatibilityMode()) then
{{@each(it.hooks) => hook}}
{{@each(hook.mapStateFunctions) => func}}
    local function {{func.name}}({{func.args}})

    end

{{/each_}}
{{/each_}}
{{@each(it.hooks) => hook}}
{{@if(hook.mapStateRegistrations.length > 0)}}

    -- {{hook.category}} Events
{{/if}}
{{@each(hook.mapStateIdentifiers) => identifier}}
    local {{identifier.name}} = {{identifier.id}};
{{/each_}}
{{@each(hook.mapStateRegistrations) => registration}}
    {{registration.registerHookName}}({{registration.name}}, {{registration.functionName}});
{{/each_}}
{{@if(hook.mapStateRegistrations.length > 0)}}
{{/if}}
{{/each_}}
end
`;

    const code = ref('');
    const elunaState = ref('multistate');
    const mapId = ref(1);
    const toast = ref(null);
    const userSnippets = ref([]);
    const singleThreadedSnippets = ref([]);
    const multistateSnippets = ref([]);

    // Set initial checked state
    eventCategories.value.forEach(eventCategory => {
        eventCategory.events.forEach(event => {
            event.checked = false;
        })
    });

    const fetchUserSnippets = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/Kaev/ElunaSnippetGenerator/gh-pages/snippets.json');
            const data = await response.json();
            userSnippets.value = data;
        } catch (error) {
            console.error('Error fetching user snippets:', error);
        }
    };

    onMounted(() => {
        // Enable Bootstrap tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))

        // Fetch user snippets
        fetchUserSnippets();
    });

    watchEffect(() => {
        multistateSnippets.value = userSnippets.value.filter(snippet => snippet.type === 'multistate');
        singleThreadedSnippets.value = userSnippets.value.filter(snippet => snippet.type === 'singlethreaded');
    });

    function transformEventName(eventName) {
        // Remove all occurrences of "_EVENT_ON"
        let resultString = eventName.replace(/_EVENT_ON/g, '');

        // Convert to lowercase and replace underscores with uppercase letters
        resultString = resultString.toLowerCase().replace(/_./g, match => match.charAt(1).toUpperCase());

        // Capitalize the first letter
        resultString = resultString.charAt(0).toUpperCase() + resultString.slice(1);

        return resultString;
    }

    function onHookCheckStateChanged(event)
    {
        event.checked = !event.checked;
        generateCode();
    }

    function onShowUserSnippet(snippet)
    {
        code.value = snippet.code.trim();
    }

    function generateCode()
    {
        if (elunaState.value === 'multistate') {
            generateCodeForMultistate();
        } else {
            generateCodeForSingleThreaded();
        }
    }

    function generateCodeForMultistate()
    {
        let hooks = [];

        eventCategories.value.forEach(eventCategory => {
            let hook = {
                category: eventCategory.category,
                mapStateFunctions: [],
                mapStateIdentifiers: [],
                mapStateRegistrations: [],
                worldStateFunctions: [],
                worldStateIdentifiers: [],
                worldStateRegistrations: []
            };

            eventCategory.events.forEach(event => {
                if (event.checked === true) {
                    const functionName = `On${transformEventName(event.name)}`;
                    var func = {
                        name: functionName,
                        args: event.args.join(", ")
                    };
                    var identifier = {
                        name: event.name,
                        id: event.id
                    };
                    var registration = {
                        registerHookName: eventCategory.registerHookName,
                        name: event.name,
                        functionName: functionName
                    };

                    if (event.inWorldState === true) {
                        hook.worldStateFunctions.push(func);
                        hook.worldStateIdentifiers.push(identifier);
                        hook.worldStateRegistrations.push(registration);
                    } else {
                        hook.mapStateFunctions.push(func);
                        hook.mapStateIdentifiers.push(identifier);
                        hook.mapStateRegistrations.push(registration);
                    }


                }
            });

            hooks.push(hook);
        });

        var result = Sqrl.render(multistateTemplate, {
            mapId: mapId.value,
            hooks: hooks
        });
        code.value = result.trim();
    }

    function generateCodeForSingleThreaded()
    {
        let hooks = [];

        eventCategories.value.forEach(eventCategory => {
            let hook = {
                category: eventCategory.category,
                functions: [],
                identifiers: [],
                registrations: []
            };

            eventCategory.events.forEach(event => {
                if (event.checked === true) {
                    const functionName = `On${transformEventName(event.name)}`;
                    hook.functions.push({
                        name: functionName,
                        args: event.args.join(", ")
                    });
                    hook.identifiers.push({
                        name: event.name,
                        id: event.id
                    });
                    hook.registrations.push({
                        registerHookName: eventCategory.registerHookName,
                        name: event.name,
                        functionName: functionName
                    });
                }
            });

            hooks.push(hook);
        });

        var result = Sqrl.render(singleThreadedTemplate, hooks);
        code.value = result.trim();
    }

    function copySnippet() {
        navigator.clipboard.writeText(code.value)
        .then(() => {
            // Yay
            var myToast = Toast.getOrCreateInstance(toast.value);
            myToast.show();
        })
        .catch(() => {
            console.log("Couldn't copy code to clipboard");
        });
    }
</script>

<style>
    .accordion-button:focus {
        box-shadow: none;
    }
    
    .scrollable-col {
        overflow-x: auto;
        overflow-y: auto;
        max-width: 100%;
        max-height: 100vh;
    }

    .relative-container {
        position: relative;
    }

    .button-container {
        position: absolute;
        top: 0;
        right: 16px;
        margin: 8px;
    }

    .hljs {
        height: 100vh;
    }

    .tooltip-inner {
        text-align: left;
        max-width: 400px !important;
    }

    .toast {
        position: absolute;
        bottom: 5px;
        right: 20px;
    }

</style>
