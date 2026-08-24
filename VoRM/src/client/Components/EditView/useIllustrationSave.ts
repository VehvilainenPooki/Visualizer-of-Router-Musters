import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import { debounce } from "lodash-es"
import { notifications } from '@mantine/notifications'
import type { SaveStatus, SaveTarget } from "./EditNavbar/Components/SaveStatusButton"
import { Illustration } from "../../../common/types/illustration"
import { MAX_ILLUSTRATIONS_PER_USER } from "../../../common/constants/illustration"
import * as ForceGraph from '../../ForceGraph'
import { createIllustration, getIllustrations, updateIllustration } from "../../services/illustrations"

const ILLUSTRATION_LIMIT_ERROR = 'illustration limit reached'

const DEBOUNCE_MS = 3_000
const MAX_WAIT_MS = 30_000
const RETRY_BASE_MS = 1_000
const RETRY_MAX_MS = 180_000

type SaveField = 'name' | 'description' | 'public' | 'graphcode'
type SavePayload = Partial<Pick<Illustration, SaveField>>

function useLatest<T>(value: T) {
  const ref = useRef(value)
  ref.current = value
  return ref
}

function buildPayload(fields: Set<SaveField>, values: SavePayload): SavePayload {
  return Object.fromEntries([...fields].map(field => [field, values[field]]))
}

function useBackoffTimer(base: number, max: number) {
  const timeoutId = useRef<number>(-1)
  const attempt = useRef(0)

  const cancel = useCallback(() => {
    if (timeoutId.current !== -1) {
      clearTimeout(timeoutId.current)
      timeoutId.current = -1
    }
  }, [])

  const reset = useCallback(() => { attempt.current = 0 }, [])
  const isPending = useCallback(() => timeoutId.current !== -1, [])

  const schedule = useCallback((fn: () => void) => {
    const delay = Math.min(base * 2 ** attempt.current, max)
    attempt.current += 1
    timeoutId.current = setTimeout(fn, delay)
  }, [base, max])

  useEffect(() => cancel, [cancel])

  return useMemo(() => ({ cancel, reset, isPending, schedule }), [cancel, reset, isPending, schedule])
}

type SaveOutcome = 'ok' | 'fail' | 'skip'

function useDebouncedRetrySave(performSave: (fields: Set<SaveField>) => Promise<SaveOutcome>) {
  const [status, setStatus] = useState<SaveStatus>('saved')
  const statusRef = useLatest(status)
  const performSaveRef = useLatest(performSave)
  const pendingFields = useRef<Set<SaveField>>(new Set())
  const retry = useBackoffTimer(RETRY_BASE_MS, RETRY_MAX_MS)

  const attempt = useCallback(async (fields: Set<SaveField>) => {
    retry.cancel()
    const outcome = await performSaveRef.current(fields)
    if (outcome === 'skip') {
      setStatus('saved')
      return
    }
    if (outcome === 'ok') {
      retry.reset()
      setStatus('success')
      return
    }
    for (const field of fields) pendingFields.current.add(field)
    setStatus('failed')
    notifications.show({ color: 'red', title: 'Save failed', message: 'Your changes could not be saved. Retrying...' })
    retry.schedule(() => {
      const retryFields = pendingFields.current
      pendingFields.current = new Set()
      attemptRef.current(retryFields)
    })
  }, [retry])

  const attemptRef = useLatest(attempt)

  const debouncedSave = useMemo(() => debounce(() => {
    const fields = pendingFields.current
    pendingFields.current = new Set()
    attemptRef.current(fields)
  }, DEBOUNCE_MS, { maxWait: MAX_WAIT_MS }), [])

  useEffect(() => () => debouncedSave.cancel(), [debouncedSave])

  const queueSave = useCallback((fields: SaveField[]) => {
    for (const field of fields) pendingFields.current.add(field)
    if (statusRef.current === 'failed' && retry.isPending()) return
    setStatus('saving')
    debouncedSave()
  }, [debouncedSave, retry])

  return { status, queueSave }
}

interface Props {
  id: number | null
  token: string
  name: string
  description: string | null
  public: boolean
  saveTarget: SaveTarget
  onCreated?: (id: number) => void
}

export function useSaveHandler({ id, token, name, description, public: isPublic, saveTarget, onCreated }: Props) {
  const graphcode = useSyncExternalStore(ForceGraph.subscribeToData, ForceGraph.getData)
  const onCreatedRef = useLatest(onCreated)
  const valuesRef = useLatest<SavePayload>({ name, description, public: isPublic, graphcode })
  const idRef = useRef(id)
  const [isFull, setIsFull] = useState(false)
  const isFullRef = useLatest(isFull)

  useEffect(() => {
    if (id !== null || !token) return
    let cancelled = false
    getIllustrations(token).then(result => {
      if (!cancelled && result.ok) setIsFull(result.data.length >= MAX_ILLUSTRATIONS_PER_USER)
    })
    return () => { cancelled = true }
  }, [id, token])

  useEffect(() => {
    if (!isFull) return
    notifications.show({
      color: 'yellow',
      title: 'Illustration limit reached',
      message: `You have ${MAX_ILLUSTRATIONS_PER_USER} saved illustrations, the maximum allowed. Delete one to save new illustrations on the server, or save this one on your device instead.`
    })
  }, [isFull])

  const performSave = useCallback(async (fields: Set<SaveField>): Promise<SaveOutcome> => {
    if (saveTarget === 'none') {
      console.log('No save target:', saveTarget, buildPayload(fields, valuesRef.current))
      return 'skip'
    }
    if (saveTarget === 'local') {
      notifications.show({ color: 'yellow', title: 'Not implemented', message: 'Saving on this device is not implemented yet.' })
      return 'skip'
    }
    const creating = idRef.current === null
    if (saveTarget === 'server' && creating && isFullRef.current) return 'skip'
    const result = creating
      ? await createIllustration(token, valuesRef.current as Required<SavePayload>)
      : await updateIllustration(token, idRef.current!, buildPayload(fields, valuesRef.current))
    if (result.ok && creating) {
      idRef.current = result.data.id
      onCreatedRef.current?.(result.data.id)
    }
    if (!result.ok && creating && result.error === ILLUSTRATION_LIMIT_ERROR) {
      setIsFull(true)
      return 'skip'
    }
    return result.ok ? 'ok' : 'fail'
  }, [saveTarget, token])

  const { status: statusOfSave, queueSave } = useDebouncedRetrySave(performSave)

  const saveMetadata = useCallback(() => queueSave(['name', 'description']), [queueSave])
  const saveVisibility = useCallback(() => queueSave(['public']), [queueSave])
  const saveGraph = useCallback(() => queueSave(['graphcode']), [queueSave])

  return { statusOfSave, saveMetadata, saveVisibility, saveGraph, isFull }
}
