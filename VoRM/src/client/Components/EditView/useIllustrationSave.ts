import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import { debounce } from "lodash-es"
import { notifications } from '@mantine/notifications'
import type { SaveStatus, SaveTarget } from "./Navbar/Components/SaveStatusButton"
import { Illustration } from "../../../common/types/illustration"
import * as ForceGraph from '../../ForceGraph'

const DEBOUNCE_MS = 3_000
const MAX_WAIT_MS = 30_000
const RETRY_BASE_MS = 1_000
const RETRY_MAX_MS = 180_000

interface Props {
  name: string
  description: string | null
  public: boolean
  saveTarget: SaveTarget
}

export function useSaveHandler({ name, description, public: isPublic, saveTarget }: Props) {
  const graphcode = useSyncExternalStore(ForceGraph.subscribeToData, ForceGraph.getData)
  const [statusOfSave, setStatusOfSave] = useState<SaveStatus>('saved')
  const statusRef = useRef(statusOfSave)
  statusRef.current = statusOfSave

  const pendingPayload = useRef<Partial<Illustration>>({})
  const retryTimeoutId = useRef<number>(-1)
  const retryAttempt = useRef(0)

  const cancelRetry = useCallback(() => {
    if (retryTimeoutId.current !== -1) {
      clearTimeout(retryTimeoutId.current)
      retryTimeoutId.current = -1
    }
  }, [])

  const attemptSave = useCallback(async (payload: Partial<Illustration>) => {
    cancelRetry()
    if (saveTarget === 'none') {
      console.log(saveTarget, payload)
      return
    }
    try {
      console.log(saveTarget, payload)
      retryAttempt.current = 0
      setStatusOfSave('success')
    } catch {
      pendingPayload.current = { ...payload, ...pendingPayload.current }
      setStatusOfSave('failed')
      notifications.show({ color: 'red', title: 'Save failed', message: 'Your changes could not be saved. Retrying...' })
      const delay = Math.min(RETRY_BASE_MS * 2 ** retryAttempt.current, RETRY_MAX_MS)
      retryAttempt.current += 1
      retryTimeoutId.current = setTimeout(() => {
        const retryPayload = pendingPayload.current
        pendingPayload.current = {}
        attemptSaveRef.current(retryPayload)
      }, delay)
    }
  }, [saveTarget, cancelRetry])

  const attemptSaveRef = useRef(attemptSave)
  attemptSaveRef.current = attemptSave

  const debouncedSave = useMemo(() => debounce(() => {
    const payload = pendingPayload.current
    pendingPayload.current = {}
    attemptSaveRef.current(payload)
  }, DEBOUNCE_MS, { maxWait: MAX_WAIT_MS }), [])

  useEffect(() => () => {
    debouncedSave.cancel()
    cancelRetry()
  }, [debouncedSave, cancelRetry])

  const queueSave = useCallback((payload: Partial<Illustration>) => {
    pendingPayload.current = { ...pendingPayload.current, ...payload }
    if (statusRef.current === 'failed' && retryTimeoutId.current !== -1) return
    setStatusOfSave('saving')
    debouncedSave()
  }, [debouncedSave])

  const saveMetadata = useCallback(() => queueSave({ name, description }), [queueSave, name, description])
  const saveVisibility = useCallback(() => queueSave({ public: isPublic }), [queueSave, isPublic])
  const saveGraph = useCallback(() => queueSave({ graphcode }), [queueSave, graphcode])

  return { statusOfSave, saveMetadata, saveVisibility, saveGraph }
}
