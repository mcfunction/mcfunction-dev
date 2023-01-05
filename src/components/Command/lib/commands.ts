import { biomes } from './biomes'
import { MCArray, MCBool, MCFloat, MCInt, MCJson, MCKeyword, MCRaw, MCString } from './Command'
import { ICommandEmojis, ICommandJa, IMCCandidates } from './Command'
import { effectEmojis, effects } from './effects'
import { enchants } from './enchants'
import { entities, entityEmojis } from './entities'
import { itemEmojis, items } from './items'
import { operators } from './operators'
import { sounds } from './sounds'
import { soundsources } from './soundsources'
import { structures } from './structures'

export let commandJa: ICommandJa = {}
export let commandEmojis: ICommandEmojis = {
  '…': '⚠️',
}

const MCBiome: IMCCandidates = {
  ...biomes,
  '…': [new MCRaw('')],
  _i: [new MCKeyword('biome')],
}

const MCEffect: IMCCandidates = {
  ...effects,
  '…': [new MCRaw('')],
  _i: [new MCKeyword('effect')],
}

const MCEnchant: IMCCandidates = {
  ...enchants,
  '…': [new MCRaw('')],
  _i: [new MCKeyword('enchant')],
}

const MCEntity: IMCCandidates = {
  ...entities,
  '…': [new MCRaw('')],
  _i: [new MCKeyword('entity')],
}

const MCItem: IMCCandidates = {
  '': [],
  ...items,
  '…': [new MCRaw('')],
  _i: [new MCKeyword('item')],
}

const MCOperator: IMCCandidates = {
  ...operators,
  '…': [new MCRaw('')],
  _i: [new MCKeyword('operator')],
}

const MCParticle: IMCCandidates = {
  '…': [new MCRaw('')],
  _i: [new MCKeyword('particle')],
}

const MCBlock: IMCCandidates = {
  ...items, // TODO Block Only
  '…': [new MCRaw('')],
  _i: [new MCKeyword('block')],
}

const MCSound: IMCCandidates = {
  ...sounds,
  '…': [new MCRaw('')],
  _i: [new MCKeyword('sound')],
}

const MCSoundSource: IMCCandidates = {
  '*': [],
  ...soundsources,
  '…': [new MCRaw('')],
  _i: [new MCKeyword('soundsource')],
}

const MCStructure: IMCCandidates = {
  ...structures,
  '…': [new MCRaw('')],
  _i: [new MCKeyword('structure')],
}

const MCGameMode: IMCCandidates = {
  adventure: [],
  creative: [],
  spectator: [],
  survival: [],
}
commandJa = {
  ...commandJa,
  adventure: 'アドベンチャー',
  creative: 'クリエイティブ',
  spectator: 'スペクテーター',
  survival: 'サバイバル',
}
commandEmojis = {
  ...commandEmojis,
}

const MCGameRule: IMCCandidates = {
  commandBlockOutput: [new MCBool('flag')],
  doDaylightCycle: [new MCBool('flag')],
  doEntityDrops: [new MCBool('flag')],
  doFireTick: [new MCBool('flag')],
  doInsomnia: [new MCBool('flag')],
  doImmediateRespawn: [new MCBool('flag')],
  doMobLoot: [new MCBool('flag')],
  doMobSpawning: [new MCBool('flag')],
  doTileDrops: [new MCBool('flag')],
  doWeatherCycle: [new MCBool('flag')],
  drowningDamage: [new MCBool('flag')],
  fallDamage: [new MCBool('flag')],
  fireDamage: [new MCBool('flag')],
  freezeDamage: [new MCBool('flag')],
  keepInventory: [new MCBool('flag')],
  maxCommandChainLength: [new MCInt('value')],
  mobGriefing: [new MCBool('flag')],
  naturalRegeneration: [new MCBool('flag')],
  randomTickSpeed: [new MCInt('value')],
  sendCommandFeedback: [new MCBool('flag')],
  showDeathMessages: [new MCBool('flag')],
  spawnRadius: [new MCInt('value')],
}
commandJa = {
  ...commandJa,
  commandBlockOutput: 'コマンドブロック出力',
  doDaylightCycle: '陽の光サイクル',
  doEntityDrops: 'エンティティドロップ',
  doWeatherCycle: '天気サイクル',
  fallDamage: '落下ダメージ',
  fireDamage: '炎症ダメージ',
  freezeDamage: '冷却ダメージ',
  keepInventory: 'インベントリ保存',
  maxCommandChainLength: 'コマンドチェイン最大長',
  showDeathMessages: 'デスメッセージ表示',
}
commandEmojis = {
  ...commandEmojis,
  doDaylightCycle: '☀️',
  doWeatherCycle: '🌥',
  fallDamage: '👇',
  fireDamage: '🔥',
  freezeDamage: '❄️',
  keepInventory: '🎁',
  showDeathMessages: '🧟',
}

export const MCTarget: IMCCandidates = {
  '@p': [new MCArray('arguments', true)],
  '@a': [new MCArray('arguments', true)],
  '@s': [new MCArray('arguments', true)],
  '@e': [new MCArray('arguments', true)],
  '@r': [new MCArray('arguments', true)],
  '…': [new MCRaw('')],
  _i: [new MCKeyword('target')],
}
commandJa = {
  ...commandJa,
  '@p': '近い人',
  '@a': '全員',
  '@s': 'その人',
  '@e': 'もの',
  '@r': 'ランダム',
}
commandEmojis = {
  ...commandEmojis,
  '@p': '🙎',
  '@a': '👨‍👩‍👧‍👦',
  '@s': '🙋',
  '@e': '👽',
  '@r': '❓',
}

const MCWeather: IMCCandidates = {
  clear: [],
  rain: [],
  thunder: [],
}
commandJa = {
  ...commandJa,
  thunder: '雷',
  rain: '雨',
}
commandEmojis = {
  ...commandEmojis,
  thunder: '⚡️',
  rain: '☔️',
}

const MCTimeQuery: IMCCandidates = {
  daytime: [],
  gametime: [],
  day: [],
}
commandJa = {
  ...commandJa,
}
commandEmojis = {
  ...commandEmojis,
}

const MCTimeName: IMCCandidates = {
  day: [],
  night: [],
  noon: [],
  midnight: [],
}
commandJa = {
  ...commandJa,
  day: '昼',
  night: '夜',
  noon: '正午',
  midnight: '深夜',
}
commandEmojis = {
  ...commandEmojis,
  day: '⛅️',
  night: '🌙',
  noon: '🌞',
  midnight: '🌚',
}

const MCTimeOptions: IMCCandidates = {
  set: [MCTimeName],
  add: [new MCInt('time')],
  query: [MCTimeQuery],
}
commandJa = {
  ...commandJa,
  set: '設定',
  add: '追加',
  query: 'クエリ',
}
commandEmojis = {
  ...commandEmojis,
  set: '🟰',
  add: '➕',
  query: '🟡',
}

const MCEffectOptions: IMCCandidates = {
  give: [MCTarget, MCEffect, new MCInt('seconds', true), new MCInt('amplifier', true), new MCBool('hideParticles', true)],
  clear: [MCTarget, MCEffect],
}

const MCPositionMarker: IMCCandidates = {
  '': [],
  '~': [],
  '^': [],
}

const MCFrom = [MCPositionMarker, new MCInt('x', false, true), MCPositionMarker, new MCInt('y', false, true), MCPositionMarker, new MCInt('z', false, true)]

const MCTo = [MCPositionMarker, new MCInt('x', false, true), MCPositionMarker, new MCInt('y', false, true), MCPositionMarker, new MCInt('z', false, true)]

const MCPosition = [MCPositionMarker, new MCInt('x', false, true), MCPositionMarker, new MCInt('y', false, true), MCPositionMarker, new MCInt('z', false, true)]

const MCCenter = [MCPositionMarker, new MCInt('x', false, true), MCPositionMarker, new MCInt('z', false, true)]

const MCFillOptions: IMCCandidates = {
  '': [],
  destroy: [],
  hollow: [],
  keep: [],
  outline: [],
  replace: [MCBlock],
}
commandJa = {
  ...commandJa,
  destroy: '破壊',
  hollow: '中身無し',
  keep: '上書き無し',
  outline: 'フチ',
  replace: '上書き',
}
commandEmojis = {
  ...commandEmojis,
  destroy: '💥',
  hollow: '🔲',
  keep: '✅',
  outline: '🔲',
  replace: '🔄',
}

const MCScheduleFunctionOptions: IMCCandidates = {
  '': [],
  append: [],
  replace: [],
}
commandJa = {
  ...commandJa,
  append: '追加',
}
commandEmojis = {
  ...commandEmojis,
  append: '➕',
}

const MCScheduleOptions: IMCCandidates = {
  function: [new MCRaw('function'), new MCInt('time'), MCScheduleFunctionOptions],
  clear: [new MCRaw('function')],
}

const MCSetBlockOptions: IMCCandidates = {
  '': [],
  destroy: [],
  keep: [],
  replace: [],
}

const MCTagOptions: IMCCandidates = {
  add: [new MCRaw('name')],
  remove: [new MCRaw('name')],
  list: [],
}
commandJa = {
  ...commandJa,
  add: '追加',
  remove: '削除',
}
commandEmojis = {
  ...commandEmojis,
  add: '➕',
  remove: '🗑',
}

// Original
export const MCTeleportOptions: IMCCandidates = {
  position: [...MCTo],
  target: [MCTarget],
}
commandJa = {
  ...commandJa,
  position: '位置',
  target: '対象',
}
commandEmojis = {
  ...commandEmojis,
  position: '🔢',
  target: '🚻',
}

const MCTitleOptions: IMCCandidates = {
  title: [new MCString('title')],
  subtitle: [new MCString('title')],
  actionbar: [new MCString('title')],
  times: [new MCInt('fadeIn'), new MCInt('stay'), new MCInt('fadeOut')],
  clear: [],
  reset: [],
}
commandJa = {
  ...commandJa,
  title: 'タイトル',
  subtitle: 'サブタイトル',
  actionbar: 'アクションバー',
  times: '時間',
  reset: 'リセット',
}
commandEmojis = {
  ...commandEmojis,
  title: '🅰️',
  subtitle: '🔤',
  actionbar: '📏',
  times: '⏳',
  reset: '💨',
}

const MCExecuteOptions: IMCCandidates = {
  '': [],
  as: [MCTarget],
  at: [MCTarget],
  // if: [],
  // unless: [],
  // store: [],
}
commandJa = {
  ...commandJa,
  as: '誰',
  at: 'どこ',
  if: 'もし',
  unless: '違ければ',
  store: '格納',
}
commandEmojis = {
  ...commandEmojis,
  as: '👤',
  at: '👇',
  if: '❓',
  unless: '❔',
  store: '⛳️',
}

const MCDifficulty: IMCCandidates = {
  easy: [],
  hard: [],
  normal: [],
  peaceful: [],
}
commandJa = {
  ...commandJa,
  easy: '弱い',
  normal: '普通',
  hard: '強い',
  peaceful: '平和',
}
commandEmojis = {
  ...commandEmojis,
  easy: '😙',
  normal: '🙂',
  hard: '😵‍💫',
  peaceful: '👶',
}

const MCHelp: IMCCandidates = {
  '': [],
}

const MCXpUnit: IMCCandidates = {
  levels: [],
  points: [],
}
commandJa = {
  ...commandJa,
  levels: 'レベル',
  points: 'ポイント',
}
commandEmojis = {
  ...commandEmojis,
  levels: '🌊',
  points: '💧',
}

const MCXpOptions: IMCCandidates = {
  add: [MCTarget, new MCInt('amount'), MCXpUnit],
  set: [MCTarget, new MCInt('amount'), MCXpUnit],
  query: [MCTarget, MCXpUnit],
}

const MCCloneMode: IMCCandidates = {
  force: [],
  move: [],
  normal: [],
}
commandJa = {
  ...commandJa,
  force: '強制',
  move: '移動',
  normal: '正常',
}
commandEmojis = {
  ...commandEmojis,
  force: '⏩',
  move: '➡️',
  normal: '✅',
}

const MCMaskMode: IMCCandidates = {
  replace: [],
  masked: [],
  filtered: [MCBlock],
}
commandJa = {
  ...commandJa,
  masked: 'マスク',
  filtered: 'フィルター',
}
commandEmojis = {
  ...commandEmojis,
  masked: '📦',
  filtered: '🛂',
}

const MCLocaleOptions: IMCCandidates = {
  structure: [MCStructure],
  biome: [MCBiome],
}
commandJa = {
  ...commandJa,
  structure: '構造物',
  biome: '生態系',
}
commandEmojis = {
  ...commandEmojis,
  structure: '🕌',
  biome: '🏔',
}

const MCObjective = new MCRaw('objective', false, true)

const MCObjectiveOptions: IMCCandidates = {
  list: [],
  add: [MCObjective, new MCKeyword('dummy'), new MCRaw('displayName', true)],
  remove: [MCObjective],
  setdisplay: [new MCKeyword('sidebar'), MCObjective],
}
commandJa = {
  ...commandJa,
  list: '一覧',
  setdisplay: '画面表示',
}
commandEmojis = {
  ...commandEmojis,
  list: '🧾',
  setdisplay: '🖥',
}

const MCPlayersOptions: IMCCandidates = {
  list: [MCTarget],
  set: [MCTarget, MCObjective, new MCInt('score')],
  add: [MCTarget, MCObjective, new MCInt('score')],
  remove: [MCTarget, MCObjective, new MCInt('score')],
  reset: [MCTarget, MCObjective],
  operation: [MCTarget, MCObjective, MCOperator, MCTarget, MCObjective],
}
commandJa = {
  ...commandJa,
  operation: '演算',
}
commandEmojis = {
  ...commandEmojis,
  operation: '🔣',
}

const MCScoreBoard: IMCCandidates = {
  objectives: [MCObjectiveOptions],
  players: [MCPlayersOptions],
}
commandJa = {
  ...commandJa,
  objectives: 'オブジェクティブ',
  players: 'プレイヤー',
}
commandEmojis = {
  ...commandEmojis,
  objectives: '📦',
  players: '👤',
}

const MCWorldBorderDamageOptions: IMCCandidates = {
  amount: [new MCFloat('damagePerBlock')],
  buffer: [new MCFloat('distance')],
}
commandJa = {
  ...commandJa,
  amount: '量',
  buffer: '和らげる',
}
commandEmojis = {
  ...commandEmojis,
  amount: '📊',
  buffer: '👌',
}

const MCWorldBorderWarningOptions: IMCCandidates = {
  distance: [new MCFloat('distance')],
  time: [new MCInt('time')],
}
commandJa = {
  ...commandJa,
  distance: '距離',
}
commandEmojis = {
  ...commandEmojis,
  distance: '🔛',
}

const MCWorldBorderOptions: IMCCandidates = {
  add: [new MCFloat('distance'), new MCInt('time', true)],
  center: [...MCPosition],
  damage: [MCWorldBorderDamageOptions],
  get: [],
  set: [new MCFloat('distance'), new MCInt('time', true)],
  warning: [MCWorldBorderWarningOptions],
}
commandJa = {
  ...commandJa,
  get: '取得',
  remove: '削除',
  center: '中心',
  damage: 'ダメージ',
  warning: '警告',
}
commandEmojis = {
  ...commandEmojis,
  get: '🫴',
  remove: '🗑',
  center: '🚩',
  damage: '💥',
  warning: '⚠️',
}

const MCCommandHeadNoExecute: IMCCandidates = {
  clear: [MCTarget, MCItem, new MCInt('maxCount', true)],
  clone: [...MCFrom, ...MCTo, ...MCPosition, MCMaskMode, MCCloneMode],
  difficulty: [MCDifficulty],
  effect: [MCEffectOptions],
  enchant: [MCTarget, MCEnchant, new MCInt('level', true)],
  fill: [...MCFrom, ...MCTo, MCBlock, MCFillOptions],
  function: [new MCRaw('name')],
  gamemode: [MCGameMode, MCTarget],
  gamerule: [MCGameRule],
  give: [MCTarget, MCItem, new MCInt('count', true)],
  kill: [MCTarget],
  kick: [MCTarget, new MCRaw('reason')],
  list: [],
  locale: [MCLocaleOptions],
  me: [new MCString('message')],
  msg: [MCTarget, new MCString('message')], // tell msg w
  op: [MCTarget],
  particle: [MCParticle, ...MCPosition],
  playsound: [MCSound, MCSoundSource, MCTarget, ...MCTo, new MCFloat('volume', true), new MCFloat('pitch', true), new MCFloat('minVolume', true)],
  reload: [],
  say: [new MCString('message')],
  schedule: [MCScheduleOptions],
  scoreboard: [MCScoreBoard],
  setblock: [...MCTo, MCBlock, MCSetBlockOptions],
  setworldspawn: [...MCTo],
  spawnpoint: [MCTarget, ...MCTo],
  spreadplayers: [...MCCenter, new MCFloat('distance'), new MCFloat('maxRange'), MCTarget],
  stop: [],
  stopsound: [MCTarget, MCSoundSource, MCSound],
  summon: [MCEntity, ...MCTo],
  tag: [MCTarget, MCTagOptions],
  teleport: [MCTarget, MCTeleportOptions],
  tellraw: [MCTarget, new MCJson('JSON')],
  time: [MCTimeOptions],
  title: [MCTarget, MCTitleOptions],
  weather: [MCWeather, new MCInt('duration', true)],
  worldborder: [MCWorldBorderOptions],
  xp: [MCXpOptions],
  _i: [new MCKeyword('command')],
}
export const BE_INVALID_COMMANDS = ['worldborder']
MCCommandHeadNoExecute.help = [MCHelp]
Object.keys(MCCommandHeadNoExecute).forEach((k: string) => {
  if (k.startsWith('_')) {
    return
  }
  const commandName = k.replace(/[^a-z]/g, '')
  const help = MCCommandHeadNoExecute.help[0] as IMCCandidates
  help[commandName] = []
})

export const MCCommandHead: IMCCandidates = {
  '…': [new MCRaw('command')],
  execute: [MCExecuteOptions, MCExecuteOptions, new MCKeyword('run', true), MCCommandHeadNoExecute],
  ...MCCommandHeadNoExecute,
}
commandJa = {
  ...commandJa,
  clear: '消す',
  clone: '複製',
  difficulty: '難易度',
  effect: '効果',
  enchant: 'エンチャント',
  fill: '埋める',
  function: 'ファンクション',
  gamemode: 'ゲームモード',
  gamerule: 'ルール',
  give: '与える',
  kill: 'キル',
  kick: 'キック',
  list: 'リスト',
  locale: '場所',
  me: '私へ',
  msg: 'メッセージ',
  op: '権限',
  particle: 'パーティクル',
  playsound: '音再生',
  reload: '更新',
  say: '言う',
  schedule: '予定',
  scoreboard: 'スコアボード',
  setblock: 'ブロック設置',
  setworldspawn: '世界スポーン設定',
  spawnpoint: 'スポーン',
  spreadplayers: 'プレイヤー分散',
  stop: '停止',
  stopsound: '音停止',
  summon: '召喚',
  tag: 'タグ',
  teleport: 'テレポート',
  tellraw: 'そのまま表示',
  time: '時間',
  title: 'タイトル',
  weather: '天気',
  worldborder: '世界の端',
  xp: '経験値',
  help: 'ヘルプ',
  execute: '実行',
  comment: 'コメント',
}

commandEmojis = {
  ...commandEmojis,
  ...effectEmojis,
  ...entityEmojis,
  ...itemEmojis,
  //
  clear: '🗑',
  clone: '📲',
  difficulty: '🌀',
  effect: '✨',
  enchant: '🪄',
  fill: '📦',
  function: '▶️',
  gamemode: '💁',
  gamerule: '🔧',
  give: '🫳',
  kill: '😇',
  kick: '❌',
  list: '📋',
  locale: '🏜',
  me: '💬',
  msg: '💬',
  op: '👑',
  particle: '✨',
  playsound: '🔊',
  reload: '♻️',
  say: '💬',
  schedule: '⏰',
  scoreboard: '🪧',
  setblock: '📦',
  setworldspawn: '👶',
  spawnpoint: '👶',
  spreadplayers: '🔛',
  stop: '❌',
  stopsound: '🔇',
  summon: '🧟',
  tag: '🏷',
  teleport: '🕊',
  tellraw: '💬',
  time: '⏳',
  title: '💬',
  weather: '⛅️',
  worldborder: '♒️',
  xp: '🔮',
  help: '❔',
  execute: '▶️',
  comment: '💭',
}

//
commandJa = {
  ...commandJa,
  run: '実行する',
  second: '秒',
  seconds: '秒',
  minute: '分',
  minutes: '分',
  hour: '時',
  hours: '時',
  amplifier: '増幅',
  message: 'メッセージ',
  flag: 'フラグ',
  arguments: '引数',
  time: '時間',
  hideParticles: 'パーティクルを隠す',
  name: '名前',
  fadeIn: 'フェードイン',
  stay: '待機',
  fadeOut: 'フェードアウト',
  count: 'カウント',
  maxCount: '最大カウント',
  level: 'レベル',
  reason: '理由',
  volume: '音量',
  pitch: '高さ',
  minVolume: '最小音量',
  maxRange: '最大幅',
  duration: '長さ',
  command: 'コマンド',
}
