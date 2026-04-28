
// // // hooks/useAudioDownload.ts


// import { useState, useEffect, useCallback, useMemo } from 'react'
// import * as FileSystem from 'expo-file-system/legacy'
// import { RemoteTrack } from './useSupabaseAudioList'

// function getAudioDir() {
//   const baseDir = FileSystem.documentDirectory
//   if (!baseDir) {
//     throw new Error('documentDirectory is unavailable')
//   }
//   return `${baseDir}peppa_audio/`
// }

// export function useAudioDownload(track: RemoteTrack) {
//   const [isDownloaded, setIsDownloaded] = useState(false)
//   const [isDownloading, setIsDownloading] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const [error, setError] = useState<string | null>(null)

//   const audioDir = useMemo(() => getAudioDir(), [])
//   const localPath = useMemo(() => `${audioDir}${track.fileName}`, [audioDir, track.fileName])
// //   console.log('documentDirectory:', FileSystem.documentDirectory)
// // console.log('audioDir:', audioDir)
// // console.log('localPath:', localPath)


//   const ensureDir = async () => {
//     const dirInfo = await FileSystem.getInfoAsync(audioDir)
//     if (!dirInfo.exists) {
//       await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true })
//     }
//   }

//   const startDownload = useCallback(async () => {
//     if (isDownloading || isDownloaded) return

//     setIsDownloading(true)
//     setProgress(0)
//     setError(null)

//     try {
//       await ensureDir()

//       const downloadResumable = FileSystem.createDownloadResumable(
//         track.audioUrl,
//         localPath,
//         {},
//         ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
//           if (totalBytesExpectedToWrite > 0) {
//             setProgress(totalBytesWritten / totalBytesExpectedToWrite)
//           }
//         }
//       )

//       const result = await downloadResumable.downloadAsync()

//       if (result?.uri) {
//         setIsDownloaded(true)
//         setProgress(1)
//       }
//     } catch (e: any) {
//       setError(e?.message ?? 'Download failed')
//       console.error('Download error:', e)
//     } finally {
//       setIsDownloading(false)
//     }
//   }, [track.audioUrl, localPath, isDownloading, isDownloaded, audioDir])

//   useEffect(() => {
//     let isMounted = true

//     async function initializeFile() {
//       try {
//         await ensureDir()
//         const info = await FileSystem.getInfoAsync(localPath)

//         if (info.exists) {
//           if (isMounted) {
//             setIsDownloaded(true)
//             setProgress(1)
//           }
//         } else if (isMounted) {
//           await startDownload()
//         }
//       } catch (err) {
//         console.error('initializeFile error:', err)
//         if (isMounted) await startDownload()
//       }
//     }

//     initializeFile()
//     return () => {
//       isMounted = false
//     }
//   }, [localPath, startDownload, audioDir])

//   return {
//     isDownloaded,
//     isDownloading,
//     progress,
//     error,
//     download: startDownload,
//     localPath,
//     audioUri: isDownloaded ? localPath : track.audioUrl,
//   }
// }



// hooks/useAudioDownload.ts
//
// BEHAVIOUR:
//   • On mount → checks if file already exists locally → marks ready immediately
//   • If NOT downloaded → joins a global serial queue → downloads one at a time
//     (prevents flooding the app with 20 simultaneous downloads = "Loading..." hang)
//   • Download is automatic — no user tap needed
//   • On press (from talesperform) → if ready, navigate; if still downloading, wait

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import * as FileSystem from 'expo-file-system/legacy'
import { RemoteTrack } from './useSupabaseAudioList'

// ─── Global serial download queue ─────────────────────────────────────────────
// All BlobCards share this queue. Downloads happen one after another,
// preventing the app from freezing when a category has 10–20 tracks.
type QueueItem = () => Promise<void>
const downloadQueue: QueueItem[] = []
let isQueueRunning = false

async function runQueue() {
  if (isQueueRunning) return
  isQueueRunning = true
  while (downloadQueue.length > 0) {
    const task = downloadQueue.shift()
    if (task) {
      try { await task() } catch (e) { console.warn('Queue task error:', e) }
    }
  }
  isQueueRunning = false
}

function enqueue(task: QueueItem) {
  downloadQueue.push(task)
  runQueue()
}
// ──────────────────────────────────────────────────────────────────────────────

function getAudioDir() {
  const baseDir = FileSystem.documentDirectory
  if (!baseDir) throw new Error('documentDirectory is unavailable')
  return `${baseDir}peppa_audio/`
}

export function useAudioDownload(track: RemoteTrack) {
  const [isDownloaded, setIsDownloaded]   = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress]           = useState(0)
  const [error, setError]                 = useState<string | null>(null)

  const audioDir  = useMemo(() => getAudioDir(), [])
  const localPath = useMemo(() => `${audioDir}${track.fileName}`, [audioDir, track.fileName])

  // Prevent duplicate enqueues if component re-renders
  const enqueuedRef = useRef(false)

  const ensureDir = useCallback(async () => {
    const dirInfo = await FileSystem.getInfoAsync(audioDir)
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true })
    }
  }, [audioDir])

  // ── The actual download task (runs inside the queue) ──────────────────────
  const downloadTask = useCallback(async () => {
    // Double-check file doesn't exist before downloading
    const info = await FileSystem.getInfoAsync(localPath)
    if (info.exists) {
      setIsDownloaded(true)
      setProgress(1)
      return
    }

    setIsDownloading(true)
    setProgress(0)
    setError(null)

    try {
      await ensureDir()

      const dl = FileSystem.createDownloadResumable(
        track.audioUrl,
        localPath,
        {},
        ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
          if (totalBytesExpectedToWrite > 0) {
            setProgress(totalBytesWritten / totalBytesExpectedToWrite)
          }
        }
      )

      const result = await dl.downloadAsync()
      if (result?.uri) {
        setIsDownloaded(true)
        setProgress(1)
      }
    } catch (e: any) {
      setError(e?.message ?? 'Download failed')
      console.error('Download error:', track.fileName, e)
    } finally {
      setIsDownloading(false)
    }
  }, [track.audioUrl, track.fileName, localPath, ensureDir])

  // ── On mount: check local → if missing, enqueue auto-download ─────────────
  useEffect(() => {
    let active = true

    async function init() {
      try {
        await ensureDir()
        const info = await FileSystem.getInfoAsync(localPath)

        if (info.exists) {
          // Already on device — mark ready instantly, no download needed
          if (active) {
            setIsDownloaded(true)
            setProgress(1)
          }
        } else if (!enqueuedRef.current) {
          // Not downloaded yet — add to serial queue (not immediate fire)
          enqueuedRef.current = true
          enqueue(downloadTask)
        }
      } catch (err) {
        console.warn('init error:', err)
        if (active && !enqueuedRef.current) {
          enqueuedRef.current = true
          enqueue(downloadTask)
        }
      }
    }

    init()
    return () => { active = false }
  }, [localPath, ensureDir, downloadTask])

  // ── Manual trigger (called from handlePress if somehow not yet downloaded) ─
  const download = useCallback(async () => {
    if (isDownloading || isDownloaded) return
    if (!enqueuedRef.current) {
      enqueuedRef.current = true
      enqueue(downloadTask)
    }
  }, [isDownloading, isDownloaded, downloadTask])

  return {
    isDownloaded,
    isDownloading,
    progress,
    error,
    download,
    localPath,
    audioUri: isDownloaded ? localPath : track.audioUrl,
  }
}