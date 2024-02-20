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
                        <div class="form-check form-switch">
                            <input v-model="generateLspDefinitions" class="form-check-input" type="checkbox" role="switch" id="generateLspDefinitions" @change="onGenerateLspDefinitionsChanged()">
                            <label class="form-check-label" for="generateLspDefinitions">Generate Eluna LSP Definitions</label>
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
    
    // Point this to another location if you want to host your own, private user snippets
    const userSnippetsUrl = 'https://raw.githubusercontent.com/Kaev/ElunaSnippetGenerator/gh-pages/snippets.json';

    const eventCategories = ref([
    {
        category: "Battleground",
        events: [
            { name: "BG_EVENT_ON_START", id: "1", args: [{ name: "event", type: "number" }, { name: "bg", type: "BattleGround" }, { name: "bgId", type: "number" }, { name: "instanceId", type: "number" }], title: "Start" },
            { name: "BG_EVENT_ON_END", id: "2", args: [{ name: "event", type: "number" }, { name: "bg", type: "BattleGround" }, { name: "bgId", type: "number" }, { name: "instanceId", type: "number" }, { name: "winner", type: "number" }], title: "End" },
            { name: "BG_EVENT_ON_CREATE", id: "3", args: [{ name: "event", type: "number" }, { name: "bg", type: "BattleGround" }, { name: "bgId", type: "number" }, { name: "instanceId", type: "number" }], title: "Create" },
            { name: "BG_EVENT_ON_PRE_DESTROY", id: "4", args: [{ name: "event", type: "number" }, { name: "bg", type: "BattleGround" }, { name: "bgId", type: "number" }, { name: "instanceId", type: "number" }], title: "Pre Destroy" },
        ],
        registerHookName: "RegisterBGEvent",
        hookExtraArgs: []
    },
    {
        category: "Creature",
        events: [
            { name: "CREATURE_EVENT_ON_ENTER_COMBAT", id: "1", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "target", type: "Unit" }], title: "Enter Combat" },
            { name: "CREATURE_EVENT_ON_LEAVE_COMBAT", id: "2", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }], title: "Leave Combat" },
            { name: "CREATURE_EVENT_ON_TARGET_DIED", id: "3", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "victim", type: "Unit" }], title: "Target Died" },
            { name: "CREATURE_EVENT_ON_DIED", id: "4", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "killer", type: "Unit" }], title: "Died" },
            { name: "CREATURE_EVENT_ON_SPAWN", id: "5", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }], title: "Spawn" },
            { name: "CREATURE_EVENT_ON_REACH_WP", id: "6", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "type", type: "number" }, { name: "id", type: "number" }], title: "Reach Waypoint" },
            { name: "CREATURE_EVENT_ON_AIUPDATE", id: "7", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "diff", type: "number" }], title: "AI Update" },
            { name: "CREATURE_EVENT_ON_RECEIVE_EMOTE", id: "8", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "player", type: "Player" }, { name: "emoteId", type: "number" }], title: "Receive Emote" },
            { name: "CREATURE_EVENT_ON_DAMAGE_TAKEN", id: "9", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "attacker", type: "Unit" }, { name: "damage", type: "number" }], title: "Damage Taken" },
            { name: "CREATURE_EVENT_ON_PRE_COMBAT", id: "10", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "target", type: "Unit" }], title: "Pre Combat" },
            { name: "CREATURE_EVENT_ON_OWNER_ATTACKED", id: "12", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "target", type: "Unit" }], title: "Owner Attacked" },
            { name: "CREATURE_EVENT_ON_OWNER_ATTACKED_AT", id: "13", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "attacker", type: "Unit" }], title: "Owner Attacked At" },
            { name: "CREATURE_EVENT_ON_HIT_BY_SPELL", id: "14", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "caster", type: "WorldObject" }, { name: "spellId", type: "number" }], title: "Hit By Spell" },
            { name: "CREATURE_EVENT_ON_SPELL_HIT_TARGET", id: "15", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "target", type: "WorldObject" }, { name: "spellId", type: "number" }], title: "Spell Hit Target" },
            { name: "CREATURE_EVENT_ON_JUST_SUMMONED_CREATURE", id: "19", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "summon", type: "Creature" }], title: "Just Summoned Creature" },
            { name: "CREATURE_EVENT_ON_SUMMONED_CREATURE_DESPAWN", id: "20", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "summon", type: "Creature" }], title: "Summoned Creature Despawn" },
            { name: "CREATURE_EVENT_ON_SUMMONED_CREATURE_DIED", id: "21", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "summon", type: "Creature" }, { name: "killer", type: "Unit" }], title: "Summoned Creature Died" },
            { name: "CREATURE_EVENT_ON_SUMMONED", id: "22", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "summoner", type: "Unit" }], title: "Summoned" },
            { name: "CREATURE_EVENT_ON_RESET", id: "23", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }], title: "Reset" },
            { name: "CREATURE_EVENT_ON_REACH_HOME", id: "24", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }], title: "Reach Home" },
            { name: "CREATURE_EVENT_ON_CORPSE_REMOVED", id: "26", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "respawnDelay", type: "number" }], title: "Corpse Removed" },
            { name: "CREATURE_EVENT_ON_MOVE_IN_LOS", id: "27", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "unit", type: "Unit" }], title: "Move in LoS" },
            { name: "CREATURE_EVENT_ON_DUMMY_EFFECT", id: "30", args: [{ name: "event", type: "number" }, { name: "caster", type: "WorldObject" }, { name: "spellId", type: "number" }, { name: "effIndex", type: "number" }, { name: "creature", type: "Creature" }], title: "Dummy Effect" },
            { name: "CREATURE_EVENT_ON_QUEST_ACCEPT", id: "31", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "creature", type: "Creature" }, { name: "quest", type: "Quest" }], title: "Quest Accept" },
            { name: "CREATURE_EVENT_ON_QUEST_REWARD", id: "34", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "creature", type: "Creature" }, { name: "quest", type: "Quest" }, { name: "opt", type: "number" }], title: "Quest Reward" },
            { name: "CREATURE_EVENT_ON_DIALOG_STATUS", id: "35", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "creature", type: "Creature" }], title: "Dialog Status" },
            { name: "CREATURE_EVENT_ON_ADD", id: "36", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }], title: "Add" },
            { name: "CREATURE_EVENT_ON_REMOVE", id: "37", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }], title: "Remove" },
        ],
        registerHookName: "RegisterCreatureEvent",
        hookExtraArgs: [ "entry" ]
    },
    {
        category: "CreatureGossip",
        events: [
            { name: "GOSSIP_EVENT_ON_HELLO", id: "1", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "creature", type: "Creature" }], title: "Hello" },
            { name: "GOSSIP_EVENT_ON_SELECT", id: "2", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "creature", type: "Creature" }, { name: "sender", type: "number" }, { name: "intId", type: "number" }, { name: "code", type: "string" }, { name: "menuId", type: "number" }], title: "Select" },
        ],
        registerHookName: "RegisterCreatureGossipEvent",
        hookExtraArgs: [ "entry" ]
    },
    {
        category: "GameObject",
        events: [
            { name: "GAMEOBJECT_EVENT_ON_AIUPDATE", id: "1", args: [{ name: "event", type: "number" }, { name: "gameObject", type: "GameObject" }, { name: "diff", type: "number" }], title: "AI Update" },
            { name: "GAMEOBJECT_EVENT_ON_SPAWN", id: "2", args: [{ name: "event", type: "number" }, { name: "gameObject", type: "GameObject" }], title: "Spawn" },
            { name: "GAMEOBJECT_EVENT_ON_DUMMY_EFFECT", id: "3", args: [{ name: "event", type: "number" }, { name: "caster", type: "WorldObject" }, { name: "spellId", type: "number" }, { name: "effIndex", type: "number" }, { name: "gameObject", type: "GameObject" }], title: "Dummy Effect" },
            { name: "GAMEOBJECT_EVENT_ON_QUEST_ACCEPT", id: "4", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "gameObject", type: "GameObject" }, { name: "quest", type: "Quest" }], title: "Quest Accept" },
            { name: "GAMEOBJECT_EVENT_ON_QUEST_REWARD", id: "5", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "gameObject", type: "GameObject" }, { name: "quest", type: "Quest" }, { name: "opt", type: "number" }], title: "Quest Reward" },
            { name: "GAMEOBJECT_EVENT_ON_DIALOG_STATUS", id: "6", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "gameObject", type: "GameObject" }], title: "Dialog Status" },
            { name: "GAMEOBJECT_EVENT_ON_DESTROYED", id: "7", args: [{ name: "event", type: "number" }, { name: "gameObject", type: "GameObject" }, { name: "player", type: "Player" }], title: "Destroyed" },
            { name: "GAMEOBJECT_EVENT_ON_DAMAGED", id: "8", args: [{ name: "event", type: "number" }, { name: "gameObject", type: "GameObject" }, { name: "player", type: "Player" }], title: "Damaged" },
            { name: "GAMEOBJECT_EVENT_ON_LOOT_STATE_CHANGE", id: "9", args: [{ name: "event", type: "number" }, { name: "gameObject", type: "GameObject" }, { name: "state", type: "number" }], title: "Loot State Changed" },
            { name: "GAMEOBJECT_EVENT_ON_GO_STATE_CHANGED", id: "10", args: [{ name: "event", type: "number" }, { name: "gameObject", type: "GameObject" }, { name: "state", type: "number" }], title: "Go State Changed" },
            { name: "GAMEOBJECT_EVENT_ON_ADD", id: "12", args: [{ name: "event", type: "number" }, { name: "gameObject", type: "GameObject" }], title: "Add" },
            { name: "GAMEOBJECT_EVENT_ON_REMOVE", id: "13", args: [{ name: "event", type: "number" }, { name: "gameObject", type: "GameObject" }], title: "Remove" },
            { name: "GAMEOBJECT_EVENT_ON_USE", id: "14", args: [{ name: "event", type: "number" }, { name: "gameObject", type: "GameObject" }, { name: "player", type: "Player" }], title: "Use" },
        ],
        registerHookName: "RegisterGameObjectEvent",
        hookExtraArgs: [ "entry" ]
    },
    {
        category: "GameObjectGossip",
        events: [
            { name: "GOSSIP_EVENT_ON_HELLO", id: "1", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "gameObject", type: "GameObject" }], title: "Hello" },
            { name: "GOSSIP_EVENT_ON_SELECT", id: "2", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "gameObject", type: "GameObject" }, { name: "sender", type: "number" }, { name: "intId", type: "number" }, { name: "code", type: "string" }, { name: "menuId", type: "number" }], title: "Select" },
        ],
        registerHookName: "RegisterGameObjectGossipEvent",
        hookExtraArgs: [ "entry" ]
    },
    {
        category: "Group",
        events: [
            { name: "GROUP_EVENT_ON_MEMBER_ADD", id: "1", args: [{ name: "event", type: "number" }, { name: "group", type: "Group" }, { name: "guid", type: "number" }], title: "Member Add", inWorldState: true },
            { name: "GROUP_EVENT_ON_MEMBER_INVITE", id: "2", args: [{ name: "event", type: "number" }, { name: "group", type: "Group" }, { name: "guid", type: "number" }], title: "Member Invite", inWorldState: true },
            { name: "GROUP_EVENT_ON_MEMBER_REMOVE", id: "3", args: [{ name: "event", type: "number" }, { name: "group", type: "Group" }, { name: "guid", type: "number" }, { name: "method", type: "number" }], title: "Member Remove", inWorldState: true },
            { name: "GROUP_EVENT_ON_LEADER_CHANGE", id: "4", args: [{ name: "event", type: "number" }, { name: "group", type: "Group" }, { name: "newLeaderGuid", type: "number" }, { name: "oldLeaderGuid", type: "number" }], title: "Leader Change", inWorldState: true },
            { name: "GROUP_EVENT_ON_DISBAND", id: "5", args: [{ name: "event", type: "number" }, { name: "group", type: "Group" }], title: "Disband", inWorldState: true },
            { name: "GROUP_EVENT_ON_CREATE", id: "6", args: [{ name: "event", type: "number" }, { name: "group", type: "Group" }, { name: "leaderGuid", type: "number" }, { name: "groupType", type: "number" }], title: "Create", inWorldState: true },
            { name: "GROUP_EVENT_ON_MEMBER_ACCEPT", id: "7", args: [{ name: "event", type: "number" }, { name: "group", type: "Group" }, { name: "player", type: "Player" }], title: "Member Accept", inWorldState: true },
        ],
        registerHookName: "RegisterGroupEvent",
        hookExtraArgs: []
    },
    {
        category: "Guild",
        events: [
            { name: "GUILD_EVENT_ON_ADD_MEMBER", id: "1", args: [{ name: "event", type: "number" }, { name: "guild", type: "Guild" }, { name: "player", type: "Player" }, { name: "rank", type: "number" }], title: "Add Member", inWorldState: true },
            { name: "GUILD_EVENT_ON_REMOVE_MEMBER", id: "2", args: [{ name: "event", type: "number" }, { name: "guild", type: "Guild" }, { name: "player", type: "Player" }, { name: "isDisbanding", type: "boolean" }], title: "Remove Member", inWorldState: true },
            { name: "GUILD_EVENT_ON_MOTD_CHANGE", id: "3", args: [{ name: "event", type: "number" }, { name: "guild", type: "Guild" }, { name: "newMOTD", type: "string" }], title: "MOTD Change", inWorldState: true },
            { name: "GUILD_EVENT_ON_INFO_CHANGE", id: "4", args: [{ name: "event", type: "number" }, { name: "guild", type: "Guild" }, { name: "newInfo", type: "string" }], title: "Info Change", inWorldState: true },
            { name: "GUILD_EVENT_ON_CREATE", id: "5", args: [{ name: "event", type: "number" }, { name: "guild", type: "Guild" }, { name: "leader", type: "Player" }, { name: "name", type: "string" }], title: "Create", inWorldState: true },
            { name: "GUILD_EVENT_ON_DISBAND", id: "6", args: [{ name: "event", type: "number" }, { name: "guild", type: "Guild" }], title: "Disband", inWorldState: true },
            { name: "GUILD_EVENT_ON_MONEY_WITHDRAW", id: "7", args: [{ name: "event", type: "number" }, { name: "guild", type: "Guild" }, { name: "player", type: "Player" }, { name: "amount", type: "number" }, { name: "isRepair", type: "boolean" }], title: "Money Withdraw", inWorldState: true },
            { name: "GUILD_EVENT_ON_MONEY_DEPOSIT", id: "8", args: [{ name: "event", type: "number" }, { name: "guild", type: "Guild" }, { name: "player", type: "Player" }, { name: "amount", type: "number" }], title: "Money Deposit", inWorldState: true },
            { name: "GUILD_EVENT_ON_ITEM_MOVE", id: "9", args: [{ name: "event", type: "number" }, { name: "guild", type: "Guild" }, { name: "player", type: "Player" }, { name: "item", type: "Item" }, { name: "isSrcBank", type: "boolean" }, { name: "srcContainer", type: "number" }, { name: "srcSlotId", type: "number" }, { name: "isDestBank", type: "boolean" }, { name: "destContainer", type: "number" }, { name: "destSlotId", type: "number" }], title: "Item Move", inWorldState: true },
            { name: "GUILD_EVENT_ON_EVENT", id: "10", args: [{ name: "event", type: "number" }, { name: "guild", type: "Guild" }, { name: "eventType", type: "number" }, { name: "playerGuidLow1", type: "number" }, { name: "playerGuidLow2", type: "number" }, { name: "newRank", type: "number" }], title: "Event", inWorldState: true },
            { name: "GUILD_EVENT_ON_BANK_EVENT", id: "11", args: [{ name: "event", type: "number" }, { name: "guild", type: "Guild" }, { name: "eventType", type: "number" }, { name: "tabId", type: "number" }, { name: "playerGuidLow", type: "number" }, { name: "itemOrMoney", type: "number" }, { name: "itemStackCount", type: "number" }, { name: "destTabId", type: "number" }], title: "Bank Event", inWorldState: true },
        ],
        registerHookName: "RegisterGuildEvent",
        hookExtraArgs: []
    },
    {
        category: "Instance",
        events: [
            { name: "INSTANCE_EVENT_ON_INITIALIZE", id: "1", args: [{ name: "event", type: "number" }, { name: "instanceData", type: "table" }, { name: "map", type: "Map" }], title: "Initialize" },
            { name: "INSTANCE_EVENT_ON_LOAD", id: "2", args: [{ name: "event", type: "number" }, { name: "instanceData", type: "table" }, { name: "map", type: "Map" }], title: "Load" },
            { name: "INSTANCE_EVENT_ON_UPDATE", id: "3", args: [{ name: "event", type: "number" }, { name: "instanceData", type: "table" }, { name: "map", type: "Map" }, { name: "diff", type: "number" }], title: "Update" },
            { name: "INSTANCE_EVENT_ON_PLAYER_ENTER", id: "4", args: [{ name: "event", type: "number" }, { name: "instanceData", type: "table" }, { name: "map", type: "Map" }, { name: "player", type: "Player" }], title: "Player Enter" },
            { name: "INSTANCE_EVENT_ON_CREATURE_CREATE", id: "5", args: [{ name: "event", type: "number" }, { name: "instanceData", type: "table" }, { name: "map", type: "Map" }, { name: "creature", type: "Creature" }], title: "Creature Create" },
            { name: "INSTANCE_EVENT_ON_GAMEOBJECT_CREATE", id: "6", args: [{ name: "event", type: "number" }, { name: "instanceData", type: "table" }, { name: "map", type: "Map" }, { name: "gameObject", type: "GameObject" }], title: "Gameobject Create" },
            { name: "INSTANCE_EVENT_ON_CHECK_ENCOUNTER_IN_PROGRESS", id: "7", args: [{ name: "event", type: "number" }, { name: "instanceData", type: "table" }, { name: "map", type: "Map" }], title: "Check Encounter In Progress" },
        ],
        registerHookName: "RegisterInstanceEvent",
        hookExtraArgs: [ "instanceId" ]
    },
    {
        category: "Item",
        events: [
            { name: "ITEM_EVENT_ON_DUMMY_EFFECT", id: "1", args: [{ name: "event", type: "number" }, { name: "caster", type: "WorldObject" }, { name: "spellId", type: "number" }, { name: "effIndex", type: "number" }, { name: "item", type: "Item" }], title: "Dummy Effect" },
            { name: "ITEM_EVENT_ON_USE", id: "2", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "item", type: "Item" }, { name: "target", type: "Unit" }], title: "Use" },
            { name: "ITEM_EVENT_ON_QUEST_ACCEPT", id: "3", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "item", type: "Item" }, { name: "quest", type: "Quest" }], title: "Quest Accept" },
            { name: "ITEM_EVENT_ON_EXPIRE", id: "4", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "itemId", type: "number" }], title: "Expire" },
            { name: "ITEM_EVENT_ON_REMOVE", id: "5", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "item", type: "Item" }], title: "Remove" },
            { name: "ITEM_EVENT_ON_ADD", id: "6", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "item", type: "Item" }], title: "Add" },
        ],
        registerHookName: "RegisterItemEvent",
        hookExtraArgs: [ "entry" ]
    },
    {
        category: "ItemGossip",
        events: [
            { name: "GOSSIP_EVENT_ON_HELLO", id: "1", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "item", type: "Item" }], title: "Hello" },
            { name: "GOSSIP_EVENT_ON_SELECT", id: "2", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "item", type: "Item" }, { name: "sender", type: "number" }, { name: "intId", type: "number" }, { name: "code", type: "string" }, { name: "menuId", type: "number" }], title: "Select" },
        ],
        registerHookName: "RegisterItemGossipEvent",
        hookExtraArgs: [ "entry" ]
    },
    {
        category: "Map",
        events: [
            { name: "INSTANCE_EVENT_ON_INITIALIZE", id: "1", args: [{ name: "event", type: "number" }, { name: "instanceData", type: "table" }, { name: "map", type: "Map" }], title: "Initialize" },
            { name: "INSTANCE_EVENT_ON_LOAD", id: "2", args: [{ name: "event", type: "number" }, { name: "instanceData", type: "table" }, { name: "map", type: "Map" }], title: "Load" },
            { name: "INSTANCE_EVENT_ON_UPDATE", id: "3", args: [{ name: "event", type: "number" }, { name: "instanceData", type: "table" }, { name: "map", type: "Map" }, { name: "diff", type: "number" }], title: "Update" },
            { name: "INSTANCE_EVENT_ON_PLAYER_ENTER", id: "4", args: [{ name: "event", type: "number" }, { name: "instanceData", type: "table" }, { name: "map", type: "Map" }, { name: "player", type: "Player" }], title: "Player Enter" },
            { name: "INSTANCE_EVENT_ON_CREATURE_CREATE", id: "5", args: [{ name: "event", type: "number" }, { name: "instanceData", type: "table" }, { name: "map", type: "Map" }, { name: "creature", type: "Creature" }], title: "Creature Create" },
            { name: "INSTANCE_EVENT_ON_GAMEOBJECT_CREATE", id: "6", args: [{ name: "event", type: "number" }, { name: "instanceData", type: "table" }, { name: "map", type: "Map" }, { name: "gameObject", type: "GameObject" }], title: "Gameobject Create" },
            { name: "INSTANCE_EVENT_ON_CHECK_ENCOUNTER_IN_PROGRESS", id: "7", args: [{ name: "event", type: "number" }, { name: "instanceData", type: "table" }, { name: "map", type: "Map" }], title: "Check Encounter In Progress" },
        ],
        registerHookName: "RegisterMapEvent",
        hookExtraArgs: [ "mapId" ]
    },
    {
        category: "Packet",
        events: [
            { name: "PACKET_EVENT_ON_PACKET_RECEIVE", id: "5", args: [{ name: "event", type: "number" }, { name: "packet", type: "WorldPacket" }, { name: "player", type: "Player" }], title: "Packet Receive", inWorldState: true },
            { name: "PACKET_EVENT_ON_PACKET_SEND", id: "7", args: [{ name: "event", type: "number" }, { name: "packet", type: "WorldPacket" }, { name: "player", type: "Player" }], title: "Packet Send", inWorldState: true },
        ],
        registerHookName: "RegisterPacketEvent",
        hookExtraArgs: [ "entry" ]
    },
    {
        category: "Player",
        events: [
            { name: "PLAYER_EVENT_ON_CHARACTER_CREATE", id: "1", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }], title: "Character Create", inWorldState: true },
            { name: "PLAYER_EVENT_ON_CHARACTER_DELETE", id: "2", args:[{ name: "event", type: "number" }, { name: "guid", type: "number" }], title: "Character Delete", inWorldState: true },
            { name: "PLAYER_EVENT_ON_LOGIN", id: "3", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }], title: "Login", inWorldState: true },
            { name: "PLAYER_EVENT_ON_LOGOUT", id: "4", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }], title: "Logout", inWorldState: true },
            { name: "PLAYER_EVENT_ON_SPELL_CAST", id: "5", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "spell", type: "Spell" }, { name: "skipCheck", type: "boolean" }], title: "Spell Cast" },
            { name: "PLAYER_EVENT_ON_KILL_PLAYER", id: "6", args: [{ name: "event", type: "number" }, { name: "killer", type: "Player" }, { name: "killed", type: "Player" }], title: "Kill Player" },
            { name: "PLAYER_EVENT_ON_KILL_CREATURE", id: "7", args: [{ name: "event", type: "number" }, { name: "killer", type: "Player" }, { name: "killed", type: "Creature" }], title: "Kill Creature" },
            { name: "PLAYER_EVENT_ON_KILLED_BY_CREATURE", id: "8", args: [{ name: "event", type: "number" }, { name: "killer", type: "Creature" }, { name: "killed", type: "Player" }], title: "Killed By Creature" },
            { name: "PLAYER_EVENT_ON_DUEL_REQUEST", id: "9", args: [{ name: "event", type: "number" }, { name: "target", type: "Player" }, { name: "challenger", type: "Player" }], title: "Duel Request" },
            { name: "PLAYER_EVENT_ON_DUEL_START", id: "10", args: [{ name: "event", type: "number" }, { name: "player1", type: "Player" }, { name: "player2", type: "Player" }], title: "Duel Start" },
            { name: "PLAYER_EVENT_ON_DUEL_END", id: "11", args: [{ name: "event", type: "number" }, { name: "winner", type: "number" }, { name: "loser", type: "Player" }, { name: "type", type: "number" }], title: "Duel End" },
            { name: "PLAYER_EVENT_ON_GIVE_XP", id: "12", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "amount", type: "number" }, { name: "victim", type: "Unit" }], title: "Give XP" },
            { name: "PLAYER_EVENT_ON_LEVEL_CHANGE", id: "13", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "oldLevel", type: "number" }], title: "Level Change" },
            { name: "PLAYER_EVENT_ON_MONEY_CHANGE", id: "14", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "amount", type: "number" }], title: "Money Change" },
            { name: "PLAYER_EVENT_ON_REPUTATION_CHANGE", id: "15", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "factionId", type: "number" }, { name: "standing", type: "number" }, { name: "incremental", type: "boolean" }], title: "Reputation Change" },
            { name: "PLAYER_EVENT_ON_TALENTS_CHANGE", id: "16", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "points", type: "number" }], title: "Talents Change" },
            { name: "PLAYER_EVENT_ON_TALENTS_RESET", id: "17", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "noCost", type: "boolean" }], title: "Talents Reset" },
            { name: "PLAYER_EVENT_ON_CHAT", id: "18", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "msg", type: "string" }, { name: "type", type: "number" }, { name: "lang", type: "number" }], title: "Chat", inWorldState: true },
            { name: "PLAYER_EVENT_ON_WHISPER", id: "19", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "msg", type: "string" }, { name: "type", type: "number" }, { name: "lang", type: "number" }, { name: "receiver", type: "Player" }], title: "Whisper", inWorldState: true },
            { name: "PLAYER_EVENT_ON_GROUP_CHAT", id: "20", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "msg", type: "string" }, { name: "type", type: "number" }, { name: "lang", type: "number" }, { name: "group", type: "Group" }], title: "Group Chat", inWorldState: true },
            { name: "PLAYER_EVENT_ON_GUILD_CHAT", id: "21", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "msg", type: "string" }, { name: "type", type: "number" }, { name: "lang", type: "number" }, { name: "guild", type: "Guild" }], title: "Guild Chat", inWorldState: true },
            { name: "PLAYER_EVENT_ON_CHANNEL_CHAT", id: "22", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "msg", type: "string" }, { name: "type", type: "number" }, { name: "lang", type: "number" }, { name: "channelId", type: "number" }], title: "Channel Chat", inWorldState: true },
            { name: "PLAYER_EVENT_ON_EMOTE", id: "23", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "emote", type: "number" }], title: "Emote" },
            { name: "PLAYER_EVENT_ON_TEXT_EMOTE", id: "24", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "textEmote", type: "number" }, { name: "emoteNum", type: "number" }, { name: "guid", type: "number" }], title: "Text Emote" },
            { name: "PLAYER_EVENT_ON_SAVE", id: "25", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }], title: "Save" },
            { name: "PLAYER_EVENT_ON_BIND_TO_INSTANCE", id: "26", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "difficulty", type: "number" }, { name: "mapId", type: "number" }, { name: "permanent", type: "boolean" }], title: "Bind To Instance" },
            { name: "PLAYER_EVENT_ON_UPDATE_ZONE", id: "27", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "newZone", type: "number" }, { name: "newArea", type: "number" }], title: "Update Zone" },
            { name: "PLAYER_EVENT_ON_MAP_CHANGE", id: "28", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }], title: "Map Change" },
            { name: "PLAYER_EVENT_ON_EQUIP", id: "29", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "item", type: "Item" }, { name: "bag", type: "number" }, { name: "slot", type: "number" }], title: "Equip" },
            { name: "PLAYER_EVENT_ON_FIRST_LOGIN", id: "30", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }], title: "First Login", inWorldState: true },
            { name: "PLAYER_EVENT_ON_CAN_USE_ITEM", id: "31", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "itemId", type: "number" }], title: "Can Use Item" },
            { name: "PLAYER_EVENT_ON_LOOT_ITEM", id: "32", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "item", type: "Item" }, { name: "count", type: "number" }], title: "Loot Item" },
            { name: "PLAYER_EVENT_ON_ENTER_COMBAT", id: "33", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "enemy", type: "Unit" }], title: "Enter Combat" },
            { name: "PLAYER_EVENT_ON_LEAVE_COMBAT", id: "34", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }], title: "Leave Combat" },
            { name: "PLAYER_EVENT_ON_REPOP", id: "35", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }], title: "Repop" },
            { name: "PLAYER_EVENT_ON_RESURRECT", id: "36", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }], title: "Resurrect" },
            { name: "PLAYER_EVENT_ON_LOOT_MONEY", id: "37", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "amount", type: "number" }], title: "Loot Money" },
            { name: "PLAYER_EVENT_ON_QUEST_ABANDON", id: "38", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "questId", type: "number" }], title: "Quest Abandon" },
            { name: "PLAYER_EVENT_ON_LEARN_TALENTS", id: "39", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "talentId", type: "number" }, { name: "talentRank", type: "number" }, { name: "spellId", type: "number" }], title: "Learn Talents" },
            { name: "PLAYER_EVENT_ON_ENVIRONMENTAL_DEATH", id: "40", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "environmentalDamageType", type: "number" }], title: "Environmental Death" },
            { name: "PLAYER_EVENT_ON_TRADE_ACCEPT", id: "41", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "target", type: "Player" }], title: "Trade Accept" },
            { name: "PLAYER_EVENT_ON_COMMAND", id: "42", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "command", type: "string" }], title: "Command" },
            { name: "PLAYER_EVENT_ON_SKILL_CHANGE", id: "43", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "skillId", type: "number" }, { name: "skillValue", type: "number" }], title: "Skill Change" },
            { name: "PLAYER_EVENT_ON_LEARN_SPELL", id: "44", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "spellId", type: "number" }], title: "Learn Spell" },
            { name: "PLAYER_EVENT_ON_ACHIEVEMENT_COMPLETE", id: "45", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "achievementId", type: "number" }], title: "Achievement Complete" },
            { name: "PLAYER_EVENT_ON_DISCOVER_AREA", id: "46", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "area", type: "number" }], title: "Discover Area" },
            { name: "PLAYER_EVENT_ON_UPDATE_AREA", id: "47", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "oldArea", type: "number" }, { name: "newArea", type: "number" }], title: "Update Area" },
            { name: "PLAYER_EVENT_ON_TRADE_INIT", id: "48", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "target", type: "Player" }], title: "Trade Init" },
            { name: "PLAYER_EVENT_ON_SEND_MAIL", id: "49", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "recipientGuid", type: "number" }], title: "Send Mail" },
            { name: "PLAYER_EVENT_ON_QUEST_STATUS_CHANGED", id: "54", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "questId", type: "number" }, { name: "status", type: "number" }], title: "Quest Status Changed" },
        ],
        registerHookName: "RegisterPlayerEvent",
        hookExtraArgs: []
    },
    {
        category: "PlayerGossip",
        events: [
            { name: "GOSSIP_EVENT_ON_HELLO", id: "1", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "object", type: "GameObject" }], title: "Hello" },
            { name: "GOSSIP_EVENT_ON_SELECT", id: "2", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "object", type: "GameObject" }, { name: "sender", type: "number" }, { name: "intId", type: "number" }, { name: "code", type: "string" }, { name: "menuId", type: "number" }], title: "Select" },
        ],
        registerHookName: "RegisterPlayerGossipEvent",
        hookExtraArgs: [ "menuId" ]
    },
    {
        category: "Server",
        events: [
            { name: "SERVER_EVENT_ON_PACKET_RECEIVE", id: "5", args: [{ name: "event", type: "number" }, { name: "packet", type: "WorldPacket" }, { name: "player", type: "Player" }], title: "Server Packet Receive", inWorldState: true },
            { name: "SERVER_EVENT_ON_PACKET_SEND", id: "7", args: [{ name: "event", type: "number" }, { name: "packet", type: "WorldPacket" }, { name: "player", type: "Player" }], title: "Server Packet Send", inWorldState: true },
            { name: "WORLD_EVENT_ON_OPEN_STATE_CHANGE", id: "8", args: [{ name: "event", type: "number" }, { name: "open", type: "boolean" }], title: "Open State Change", inWorldState: true },
            { name: "WORLD_EVENT_ON_CONFIG_LOAD", id: "9", args: [{ name: "event", type: "number" }, { name: "reload", type: "boolean" }], title: "Config Load", inWorldState: true },
            { name: "WORLD_EVENT_ON_SHUTDOWN_INIT", id: "11", args: [{ name: "event", type: "number" }, { name: "code", type: "string" }, { name: "mask", type: "number" }], title: "Shutdown Init", inWorldState: true },
            { name: "WORLD_EVENT_ON_SHUTDOWN_CANCEL", id: "12", args: [{ name: "event", type: "number" }], title: "Shutdown Cancel", inWorldState: true },
            { name: "WORLD_EVENT_ON_UPDATE", id: "13", args: [{ name: "event", type: "number" }, { name: "diff", type: "number" }], title: "Update", inWorldState: true },
            { name: "WORLD_EVENT_ON_STARTUP", id: "14", args: [{ name: "event", type: "number" }], title: "Startup", inWorldState: true },
            { name: "WORLD_EVENT_ON_SHUTDOWN", id: "15", args: [{ name: "event", type: "number" }], title: "Shutdown", inWorldState: true },
            { name: "ELUNA_EVENT_ON_LUA_STATE_CLOSE", id: "16", args: [{ name: "event", type: "number" }], title: "Lua State Close", inWorldState: true },
            { name: "MAP_EVENT_ON_CREATE", id: "17", args: [{ name: "event", type: "number" }, { name: "map", type: "Map" }], title: "Map Create" },
            { name: "MAP_EVENT_ON_DESTROY", id: "18", args: [{ name: "event", type: "number" }, { name: "map", type: "Map" }], title: "Map Destroy" },
            { name: "MAP_EVENT_ON_PLAYER_ENTER", id: "21", args: [{ name: "event", type: "number" }, { name: "map", type: "Map" }, { name: "player", type: "Player" }], title: "Map Player Enter" },
            { name: "MAP_EVENT_ON_PLAYER_LEAVE", id: "22", args: [{ name: "event", type: "number" }, { name: "map", type: "Map" }, { name: "player", type: "Player" }], title: "Map Player Leave" },
            { name: "MAP_EVENT_ON_UPDATE", id: "23", args: [{ name: "event", type: "number" }, { name: "map", type: "Map" }, { name: "diff", type: "number" }], title: "Map Update" },
            { name: "TRIGGER_EVENT_ON_TRIGGER", id: "24", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "triggerId", type: "number" }], title: "Trigger" },
            { name: "WEATHER_EVENT_ON_CHANGE", id: "25", args: [{ name: "event", type: "number" }, { name: "zoneId", type: "number" }, { name: "state", type: "number" }, { name: "grade", type: "number" }], title: "Weather Change", inWorldState: true },
            { name: "AUCTION_EVENT_ON_ADD", id: "26", args: [{ name: "event", type: "number" }, { name: "auctionId", type: "number" }, { name: "owner", type: "Player" }, { name: "item", type: "Item" }, { name: "expireTime", type: "number" }, { name: "buyout", type: "number" }, { name: "startBid", type: "number" }, { name: "currentBid", type: "number" }, { name: "bidderGuidLow", type: "number" }], title: "Auction Add", inWorldState: true },
            { name: "AUCTION_EVENT_ON_REMOVE", id: "27", args: [{ name: "event", type: "number" }, { name: "auctionId", type: "number" }, { name: "owner", type: "Player" }, { name: "item", type: "Item" }, { name: "expireTime", type: "number" }, { name: "buyout", type: "number" }, { name: "startBid", type: "number" }, { name: "currentBid", type: "number" }, { name: "bidderGuidLow", type: "number" }], title: "Auction Remove", inWorldState: true },
            { name: "AUCTION_EVENT_ON_SUCCESSFUL", id: "28", args: [{ name: "event", type: "number" }, { name: "auctionId", type: "number" }, { name: "owner", type: "Player" }, { name: "item", type: "Item" }, { name: "expireTime", type: "number" }, { name: "buyout", type: "number" }, { name: "startBid", type: "number" }, { name: "currentBid", type: "number" }, { name: "bidderGuidLow", type: "number" }], title: "Auction Successful", inWorldState: true },
            { name: "AUCTION_EVENT_ON_EXPIRE", id: "29", args: [{ name: "event", type: "number" }, { name: "auctionId", type: "number" }, { name: "owner", type: "Player" }, { name: "item", type: "Item" }, { name: "expireTime", type: "number" }, { name: "buyout", type: "number" }, { name: "startBid", type: "number" }, { name: "currentBid", type: "number" }, { name: "bidderGuidLow", type: "number" }], title: "Auction Expire", inWorldState: true },
            { name: "ADDON_EVENT_ON_MESSAGE", id: "30", args:  [{ name: "event", type: "number" }, { name: "sender", type: "number" }, { name: "type", type: "number" }, { name: "prefix", type: "string" }, { name: "msg", type: "string" }, { name: "target", type: "nil" }], title: "Addon Message", inWorldState: true },
            { name: "WORLD_EVENT_ON_DELETE_CREATURE", id: "31", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }], title: "Delete Creature", inWorldState: true },
            { name: "WORLD_EVENT_ON_DELETE_GAMEOBJECT", id: "32", args: [{ name: "event", type: "number" }, { name: "gameObject", type: "GameObject" }], title: "Delete Gameobject", inWorldState: true },
            { name: "ELUNA_EVENT_ON_LUA_STATE_OPEN", id: "33", args: [{ name: "event", type: "number" }], title: "Lua State Open", inWorldState: true },
            { name: "GAME_EVENT_START", id: "34", args: [{ name: "event", type: "number" }, { name: "gameEventId", type: "number" }], title: "Game Event Start", inWorldState: true },
            { name: "GAME_EVENT_STOP", id: "35", args: [{ name: "event", type: "number" }, { name: "gameEventId", type: "number" }], title: "Game Event Stop", inWorldState: true },
        ],
        registerHookName: "RegisterServerEvent",
        hookExtraArgs: []
    },
    {
        category: "Spell",
        events: [
            { name: "SPELL_EVENT_ON_CAST", id: "1", args: [{ name: "event", type: "number" }, { name: "spell", type: "Spell" }, { name: "skipCheck", type: "boolean" }], title: "Cast" },
        ],
        registerHookName: "RegisterSpellEvent",
        hookExtraArgs: [ "entry" ]
    },
    {
        category: "UniqueCreature",
        events: [
            { name: "CREATURE_EVENT_ON_ENTER_COMBAT", id: "1", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "target", type: "Unit" }], title: "Enter Combat" },
            { name: "CREATURE_EVENT_ON_LEAVE_COMBAT", id: "2", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }], title: "Leave Combat" },
            { name: "CREATURE_EVENT_ON_TARGET_DIED", id: "3", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "victim", type: "Unit" }], title: "Target Died" },
            { name: "CREATURE_EVENT_ON_DIED", id: "4", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "killer", type: "Unit" }], title: "Died" },
            { name: "CREATURE_EVENT_ON_SPAWN", id: "5", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }], title: "Spawn" },
            { name: "CREATURE_EVENT_ON_REACH_WP", id: "6", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "type", type: "number" }, { name: "id", type: "number" }], title: "Reach Waypoint" },
            { name: "CREATURE_EVENT_ON_AIUPDATE", id: "7", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "diff", type: "number" }], title: "AI Update" },
            { name: "CREATURE_EVENT_ON_RECEIVE_EMOTE", id: "8", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "player", type: "Player" }, { name: "emoteId", type: "number" }], title: "Receive Emote" },
            { name: "CREATURE_EVENT_ON_DAMAGE_TAKEN", id: "9", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "attacker", type: "Unit" }, { name: "damage", type: "number" }], title: "Damage Taken" },
            { name: "CREATURE_EVENT_ON_PRE_COMBAT", id: "10", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "target", type: "Unit" }], title: "Pre Combat" },
            { name: "CREATURE_EVENT_ON_ATTACKED_AT", id: "11", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "attacker", type: "Unit" }], title: "Attacked At" },
            { name: "CREATURE_EVENT_ON_OWNER_ATTACKED", id: "12", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "target", type: "Unit" }], title: "Owner Attacked" },
            { name: "CREATURE_EVENT_ON_OWNER_ATTACKED_AT", id: "13", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "attacker", type: "Unit" }], title: "Owner Attacked At" },
            { name: "CREATURE_EVENT_ON_HIT_BY_SPELL", id: "14", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "caster", type: "WorldObject" }, { name: "spellId", type: "number" }], title: "Hit By Spell" },
            { name: "CREATURE_EVENT_ON_SPELL_HIT_TARGET", id: "15", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "target", type: "WorldObject" }, { name: "spellId", type: "number" }], title: "Spell Hit Target" },
            { name: "CREATURE_EVENT_ON_JUST_SUMMONED_CREATURE", id: "19", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "summon", type: "Creature" }], title: "Just Summoned Creature" },
            { name: "CREATURE_EVENT_ON_SUMMONED_CREATURE_DESPAWN", id: "20", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "summon", type: "Creature" }], title: "Summoned Creature Despawn" },
            { name: "CREATURE_EVENT_ON_SUMMONED_CREATURE_DIED", id: "21", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "summon", type: "Creature" }, { name: "killer", type: "Unit" }], title: "Summoned Creature Died" },
            { name: "CREATURE_EVENT_ON_SUMMONED", id: "22", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "summoner", type: "Unit" }], title: "Summoned" },
            { name: "CREATURE_EVENT_ON_RESET", id: "23", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }], title: "Reset" },
            { name: "CREATURE_EVENT_ON_REACH_HOME", id: "24", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }], title: "Reach Home" },
            { name: "CREATURE_EVENT_ON_CORPSE_REMOVED", id: "26", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "respawnDelay", type: "number" }], title: "Corpse Removed" },
            { name: "CREATURE_EVENT_ON_MOVE_IN_LOS", id: "27", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }, { name: "unit", type: "Unit" }], title: "Move In LoS" },
            { name: "CREATURE_EVENT_ON_DUMMY_EFFECT", id: "30", args: [{ name: "event", type: "number" }, { name: "caster", type: "WorldObject" }, { name: "spellId", type: "number" }, { name: "effIndex", type: "number" }, { name: "creature", type: "Creature" }], title: "Dummy Effect" },
            { name: "CREATURE_EVENT_ON_QUEST_ACCEPT", id: "31", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "creature", type: "Creature" }, { name: "quest", type: "Quest" }], title: "Quest Accept" },
            { name: "CREATURE_EVENT_ON_QUEST_REWARD", id: "34", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "creature", type: "Creature" }, { name: "quest", type: "Quest" }, { name: "opt", type: "number" }], title: "Quest Reward" },
            { name: "CREATURE_EVENT_ON_DIALOG_STATUS", id: "35", args: [{ name: "event", type: "number" }, { name: "player", type: "Player" }, { name: "creature", type: "Creature" }], title: "Dialog Status" },
            { name: "CREATURE_EVENT_ON_ADD", id: "36", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }], title: "Add" },
            { name: "CREATURE_EVENT_ON_REMOVE", id: "37", args: [{ name: "event", type: "number" }, { name: "creature", type: "Creature" }], title: "Remove" },
        ],
        registerHookName: "RegisterUniqueCreatureEvent",
        hookExtraArgs: [ "guid", "instanceId" ]
    }
    ]);
    const singleThreadedTemplate = `
{{@each(it.hooks) => hook}}
{{@each(hook.functions) => func}}
{{@if(it.generateLspDefinitions)}}
{{@each(func.event.args) => arg}}
---@param {{arg.name}} {{arg.type}}
    
{{/each}}
{{/if}}
local function {{func.name}}({{func.args}})

end

{{/each_}}
{{/each_}}

{{@each(it.hooks) => hook}}
{{@if(hook.registrations.length > 0)}}
-- {{hook.category}} Events
{{/if}}
{{@each(hook.identifiers) => identifier}}
local {{identifier.name}} = {{identifier.id}};
{{/each_}}
{{@each(hook.registrations) => registration}}
{{@if(registration.hookExtraArgs.length > 0)}}
{{registration.registerHookName}}({{registration.hookExtraArgs}}, {{registration.name}}, {{registration.functionName}});
{{#else}}
{{registration.registerHookName}}({{registration.name}}, {{registration.functionName}});
{{/if}}
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
{{@if(it.generateLspDefinitions)}}
{{@each(func.event.args) => arg}}
    ---@param {{arg.name}} {{arg.type}}

{{/each}}
{{/if}}
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
{{@if(it.generateLspDefinitions)}}
{{@each(func.event.args) => arg}}
    ---@param {{arg.name}} {{arg.type}}
    
{{/each}}
{{/if}}
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
{{@if(registration.hookExtraArgs.length > 0)}}
    {{registration.registerHookName}}({{registration.hookExtraArgs}}, {{registration.name}}, {{registration.functionName}});
{{#else}}
    {{registration.registerHookName}}({{registration.name}}, {{registration.functionName}});
{{/if}}
{{/each_}}
{{@if(hook.mapStateRegistrations.length > 0)}}
{{/if}}
{{/each_}}
end
`;

    const code = ref('');
    const elunaState = ref('multistate');
    const mapId = ref(1);
    const generateLspDefinitions = ref(true);
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
            const response = await fetch(userSnippetsUrl);
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

    function onGenerateLspDefinitionsChanged()
    {
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
                        args: event.args.map(a => a.name).join(", "),
                        event: event
                    };
                    var identifier = {
                        name: event.name,
                        id: event.id
                    };
                    var registration = {
                        registerHookName: eventCategory.registerHookName,
                        name: event.name,
                        functionName: functionName,
                        hookExtraArgs: eventCategory.hookExtraArgs.join(", ")
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
            hooks: hooks,
            generateLspDefinitions: generateLspDefinitions.value
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
                        args: event.args.map(a => a.name).join(", "),
                        event: event
                    });
                    hook.identifiers.push({
                        name: event.name,
                        id: event.id
                    });
                    hook.registrations.push({
                        registerHookName: eventCategory.registerHookName,
                        name: event.name,
                        functionName: functionName,
                        hookExtraArgs: eventCategory.hookExtraArgs.join(", ")
                    });
                }
            });

            hooks.push(hook);
        });

        var result = Sqrl.render(singleThreadedTemplate, {
            hooks: hooks,
            generateLspDefinitions: generateLspDefinitions.value
        });
        code.value = result.trim();
    }

    function copySnippet() {
        navigator.clipboard.writeText(code.value)
        .then(() => {
            var myToast = Toast.getOrCreateInstance(toast.value);
            myToast.show();
        })
        .catch(() => {
            console.error("Couldn't copy code to clipboard");
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
