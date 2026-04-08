
// // hooks/useAudioDownload.ts


import { useState, useEffect, useCallback, useMemo } from 'react'
import * as FileSystem from 'expo-file-system/legacy'
import { RemoteTrack } from './useSupabaseAudioList'

function getAudioDir() {
  const baseDir = FileSystem.documentDirectory
  if (!baseDir) {
    throw new Error('documentDirectory is unavailable')
  }
  return `${baseDir}peppa_audio/`
}

export function useAudioDownload(track: RemoteTrack) {
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const audioDir = useMemo(() => getAudioDir(), [])
  const localPath = useMemo(() => `${audioDir}${track.fileName}`, [audioDir, track.fileName])
//   console.log('documentDirectory:', FileSystem.documentDirectory)
// console.log('audioDir:', audioDir)
// console.log('localPath:', localPath)


  const ensureDir = async () => {
    const dirInfo = await FileSystem.getInfoAsync(audioDir)
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true })
    }
  }

  const startDownload = useCallback(async () => {
    if (isDownloading || isDownloaded) return

    setIsDownloading(true)
    setProgress(0)
    setError(null)

    try {
      await ensureDir()

      const downloadResumable = FileSystem.createDownloadResumable(
        track.audioUrl,
        localPath,
        {},
        ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
          if (totalBytesExpectedToWrite > 0) {
            setProgress(totalBytesWritten / totalBytesExpectedToWrite)
          }
        }
      )

      const result = await downloadResumable.downloadAsync()

      if (result?.uri) {
        setIsDownloaded(true)
        setProgress(1)
      }
    } catch (e: any) {
      setError(e?.message ?? 'Download failed')
      console.error('Download error:', e)
    } finally {
      setIsDownloading(false)
    }
  }, [track.audioUrl, localPath, isDownloading, isDownloaded, audioDir])

  useEffect(() => {
    let isMounted = true

    async function initializeFile() {
      try {
        await ensureDir()
        const info = await FileSystem.getInfoAsync(localPath)

        if (info.exists) {
          if (isMounted) {
            setIsDownloaded(true)
            setProgress(1)
          }
        } else if (isMounted) {
          await startDownload()
        }
      } catch (err) {
        console.error('initializeFile error:', err)
        if (isMounted) await startDownload()
      }
    }

    initializeFile()
    return () => {
      isMounted = false
    }
  }, [localPath, startDownload, audioDir])

  return {
    isDownloaded,
    isDownloading,
    progress,
    error,
    download: startDownload,
    localPath,
    audioUri: isDownloaded ? localPath : track.audioUrl,
  }
}