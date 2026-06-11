#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

function usage() {
  console.error('Usage: node normalize_weflow_chat.mjs <input-dir> [--me <name>] [--you <name>] [--out <output-dir>]')
}

function parseArgs(argv) {
  const args = { inputDir: '', me: '', you: '', outDir: '' }
  const rest = [...argv]
  while (rest.length > 0) {
    const token = rest.shift()
    if (!token) continue
    if (token === '--me') {
      args.me = rest.shift() || ''
    } else if (token === '--you') {
      args.you = rest.shift() || ''
    } else if (token === '--out') {
      args.outDir = rest.shift() || ''
    } else if (token.startsWith('--')) {
      throw new Error(`Unknown option: ${token}`)
    } else if (!args.inputDir) {
      args.inputDir = token
    } else {
      throw new Error(`Unexpected argument: ${token}`)
    }
  }
  return args
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8')
  try {
    return JSON.parse(raw)
  } catch (error) {
    throw new Error(`Failed to parse JSON ${filePath}: ${error.message}`)
  }
}

function listJsonFiles(inputDir) {
  const textsDir = path.join(inputDir, 'texts')
  const sourceDir = fs.existsSync(textsDir) ? textsDir : inputDir
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Input directory not found: ${sourceDir}`)
  }
  const files = fs.readdirSync(sourceDir)
    .filter((name) => name.toLowerCase().endsWith('.json'))
    .sort((a, b) => a.localeCompare(b, 'zh-CN'))
    .map((name) => path.join(sourceDir, name))
  if (files.length === 0) {
    throw new Error(`No JSON files found in ${sourceDir}`)
  }
  return files
}

function normalizeText(value) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim()
}

function timestampToTime(message) {
  const formatted = String(message.formattedTime || '').trim()
  if (formatted) return formatted.slice(0, 16)

  const raw = Number(message.createTime || 0)
  if (!Number.isFinite(raw) || raw <= 0) return '0000-00-00 00:00'
  const millis = raw > 10_000_000_000 ? raw : raw * 1000
  const date = new Date(millis)
  const pad = (value) => String(value).padStart(2, '0')
  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    ' ',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes())
  ].join('')
}

function isTextMessage(message) {
  const localType = Number(message.localType)
  const type = String(message.type || '')
  return localType === 1 || /文本|text/i.test(type)
}

function displayType(message) {
  const type = normalizeText(message.type)
  return type || `localType=${message.localType ?? 'unknown'}`
}

function isXmlPayload(content) {
  return /^<\?xml\b|^<msg\b/i.test(content)
}

function mediaPlaceholder(message, content) {
  const type = displayType(message)
  if (/动画表情|表情|emoji/i.test(type) || /<emoticonmd5>|<emojiinfo>/i.test(content)) return '[表情包]'
  if (/图片|image/i.test(type)) return '[图片]'
  if (/视频|video/i.test(type)) return '[视频]'
  if (/语音消息|voice/i.test(type)) return '[语音消息]'
  if (/通话|call/i.test(type)) return '[通话消息]'
  if (/链接|link/i.test(type)) return '[链接]'
  if (/聊天记录/i.test(type)) return '[转发的聊天记录]'
  return `[${type}]`
}

function xmlUnescape(value) {
  return String(value || '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
}

function cleanEmbeddedXml(content) {
  let result = content
  let start = result.indexOf('<msg><appmsg')
  while (start !== -1) {
    const end = result.indexOf(']', start)
    if (end === -1) break

    const xml = result.slice(start, end)
    const titleStart = xml.indexOf('<title>')
    const titleEnd = xml.indexOf('</title>', titleStart)
    const title = titleStart !== -1 && titleEnd !== -1
      ? xml.slice(titleStart + '<title>'.length, titleEnd)
      : ''
    const replacement = normalizeText(xmlUnescape(title)) || '[非文本消息]'

    result = `${result.slice(0, start)}${replacement}${result.slice(end)}`
    start = result.indexOf('<msg><appmsg', start + replacement.length)
  }
  return result
}

function renderMessageContent(message) {
  const content = normalizeText(message.content)
  if (content && !isXmlPayload(content)) return cleanEmbeddedXml(content)
  if (content && isXmlPayload(content)) return mediaPlaceholder(message, content)
  if (isTextMessage(message)) return ''
  return mediaPlaceholder(message, content)
}

function messageSortKey(message) {
  const createTime = Number(message.createTime || 0)
  const localId = Number(message.localId || 0)
  return { createTime, localId }
}

function compareMessages(a, b) {
  const ak = messageSortKey(a)
  const bk = messageSortKey(b)
  if (ak.createTime !== bk.createTime) return ak.createTime - bk.createTime
  if (ak.localId !== bk.localId) return ak.localId - bk.localId
  return String(a.platformMessageId || '').localeCompare(String(b.platformMessageId || ''))
}

function firstName(messages, isMine) {
  const found = messages.find((message) => (Number(message.isSend) === 1) === isMine && normalizeText(message.senderDisplayName))
  return found ? normalizeText(found.senderDisplayName) : ''
}

function resolveNames(args, sessions, messages) {
  const session = sessions.find(Boolean) || {}
  const me = normalizeText(args.me) || firstName(messages, true) || 'ME'
  const you = normalizeText(args.you) ||
    firstName(messages, false) ||
    normalizeText(session.remark) ||
    normalizeText(session.displayName) ||
    normalizeText(session.nickname) ||
    'YOU'
  return { me, you }
}

function collect(inputDir) {
  const files = listJsonFiles(inputDir)
  const sessions = []
  const messages = []

  for (const file of files) {
    const json = readJson(file)
    if (json.session) sessions.push(json.session)
    if (!Array.isArray(json.messages)) {
      throw new Error(`Missing messages array in ${file}`)
    }
    for (const message of json.messages) {
      messages.push({ ...message, __sourceFile: path.basename(file) })
    }
  }

  messages.sort(compareMessages)
  return { files, sessions, messages }
}

function renderTranscript(names, messages) {
  const lines = [
    '# speaker_map',
    '',
    `ME = ${names.me}`,
    `YOU = ${names.you}`,
    ''
  ]

  messages.forEach((message, index) => {
    const id = `M${String(index + 1).padStart(6, '0')}`
    const speaker = Number(message.isSend) === 1 ? 'ME' : 'YOU'
    const otherTag = isTextMessage(message) ? '' : '[OTHER]'
    lines.push(`[${speaker}][${timestampToTime(message)}]${otherTag}[${id}]`)
    lines.push('')

    lines.push(renderMessageContent(message))
    lines.push('')
  })

  return `${lines.join('\n').replace(/[ \t]+\n/g, '\n').trimEnd()}\n`
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  if (!args.inputDir) {
    usage()
    process.exitCode = 1
    return
  }

  const inputDir = path.resolve(args.inputDir)
  const outDir = path.resolve(args.outDir || path.join(inputDir, 'agent_pack'))
  const { files, sessions, messages } = collect(inputDir)
  const names = resolveNames(args, sessions, messages)
  const transcript = renderTranscript(names, messages)

  fs.mkdirSync(outDir, { recursive: true })
  const outFile = path.join(outDir, '01_raw_chat_normalized.txt')
  fs.writeFileSync(outFile, transcript, 'utf8')

  console.log(`Input files: ${files.length}`)
  console.log(`Messages: ${messages.length}`)
  console.log(`ME: ${names.me}`)
  console.log(`YOU: ${names.you}`)
  console.log(`Wrote: ${outFile}`)
}

try {
  main()
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
