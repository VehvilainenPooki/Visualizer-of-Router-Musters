import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import { debounce } from "lodash-es"
import { notifications } from '@mantine/notifications'
import type { SaveStatus, SaveTarget } from "./EditNavbar/Components/SaveStatusButton"
import { Illustration } from "../../../common/types/illustration"
import * as ForceGraph from '../../ForceGraph'
import { createIllustration, updateIllustration } from "../../services/illustrations"

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

function useDebouncedRetrySave(performSave: (fields: Set<SaveField>) => Promise<boolean | undefined>) {
  const [status, setStatus] = useState<SaveStatus>('saved')
  const statusRef = useLatest(status)
  const performSaveRef = useLatest(performSave)
  const pendingFields = useRef<Set<SaveField>>(new Set())
  const retry = useBackoffTimer(RETRY_BASE_MS, RETRY_MAX_MS)

  const attempt = useCallback(async (fields: Set<SaveField>) => {
    retry.cancel()
    const ok = await performSaveRef.current(fields)
    if (ok === undefined) return
    if (ok) {
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

  const performSave = useCallback(async (fields: Set<SaveField>) => {
    if (saveTarget === 'none') {
      console.log('No save target:', saveTarget, buildPayload(fields, valuesRef.current))
      return undefined
    }
    const result = idRef.current === null
      ? await createIllustration(token, valuesRef.current as Required<SavePayload>)
      : await updateIllustration(token, idRef.current, buildPayload(fields, valuesRef.current))
    if (result.ok && idRef.current === null) {
      idRef.current = result.data.id
      onCreatedRef.current?.(result.data.id)
    }
    return result.ok
  }, [saveTarget, token])

  const { status: statusOfSave, queueSave } = useDebouncedRetrySave(performSave)

  const saveMetadata = useCallback(() => queueSave(['name', 'description']), [queueSave])
  const saveVisibility = useCallback(() => queueSave(['public']), [queueSave])
  const saveGraph = useCallback(() => queueSave(['graphcode']), [queueSave])

  return { statusOfSave, saveMetadata, saveVisibility, saveGraph }
}
