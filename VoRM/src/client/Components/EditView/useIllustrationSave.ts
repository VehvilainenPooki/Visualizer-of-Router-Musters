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
  const [statusOfSave, setStatusOfSave] = useState<SaveStatus>('saved')
  const statusRef = useRef(statusOfSave)
  statusRef.current = statusOfSave
  const idRef = useRef(id)
  const onCreatedRef = useRef(onCreated)
  onCreatedRef.current = onCreated
  const nameRef = useRef(name)
  nameRef.current = name
  const descriptionRef = useRef(description)
  descriptionRef.current = description
  const isPublicRef = useRef(isPublic)
  isPublicRef.current = isPublic
  const graphcodeRef = useRef(graphcode)
  graphcodeRef.current = graphcode

  const fieldRefs: { [K in SaveField]: { current: unknown } } = {
    name: nameRef,
    description: descriptionRef,
    public: isPublicRef,
    graphcode: graphcodeRef,
  }

  const buildPayload = (fields: Set<SaveField>): SavePayload => {
    const payload: SavePayload = {}
    for (const field of fields) (payload as Record<SaveField, unknown>)[field] = fieldRefs[field].current
    return payload
  }

  const pendingFields = useRef<Set<SaveField>>(new Set())
  const retryTimeoutId = useRef<number>(-1)
  const retryAttempt = useRef(0)

  const cancelRetry = useCallback(() => {
    if (retryTimeoutId.current !== -1) {
      clearTimeout(retryTimeoutId.current)
      retryTimeoutId.current = -1
    }
  }, [])

  const attemptSave = useCallback(async (fields: Set<SaveField>) => {
    cancelRetry()
    if (saveTarget === 'none') {
      console.log(saveTarget, buildPayload(fields))
      return
    }
    const result = idRef.current === null
      ? await createIllustration(token, { name: nameRef.current, description: descriptionRef.current, public: isPublicRef.current, graphcode: graphcodeRef.current })
      : await updateIllustration(token, idRef.current, buildPayload(fields))
    if (result.ok) {
      retryAttempt.current = 0
      setStatusOfSave('success')
      if (idRef.current === null) {
        idRef.current = result.data.id
        onCreatedRef.current?.(result.data.id)
      }
      return
    }
    for (const field of fields) pendingFields.current.add(field)
    setStatusOfSave('failed')
    notifications.show({ color: 'red', title: 'Save failed', message: 'Your changes could not be saved. Retrying...' })
    const delay = Math.min(RETRY_BASE_MS * 2 ** retryAttempt.current, RETRY_MAX_MS)
    retryAttempt.current += 1
    retryTimeoutId.current = setTimeout(() => {
      const retryFields = pendingFields.current
      pendingFields.current = new Set()
      attemptSaveRef.current(retryFields)
    }, delay)
  }, [saveTarget, token, cancelRetry])

  const attemptSaveRef = useRef(attemptSave)
  attemptSaveRef.current = attemptSave

  const debouncedSave = useMemo(() => debounce(() => {
    const fields = pendingFields.current
    pendingFields.current = new Set()
    attemptSaveRef.current(fields)
  }, DEBOUNCE_MS, { maxWait: MAX_WAIT_MS }), [])

  useEffect(() => () => {
    debouncedSave.cancel()
    cancelRetry()
  }, [debouncedSave, cancelRetry])

  const queueSave = useCallback((fields: SaveField[]) => {
    for (const field of fields) pendingFields.current.add(field)
    if (statusRef.current === 'failed' && retryTimeoutId.current !== -1) return
    setStatusOfSave('saving')
    debouncedSave()
  }, [debouncedSave])

  const saveMetadata = useCallback(() => queueSave(['name', 'description']), [queueSave])
  const saveVisibility = useCallback(() => queueSave(['public']), [queueSave])
  const saveGraph = useCallback(() => queueSave(['graphcode']), [queueSave])

  return { statusOfSave, saveMetadata, saveVisibility, saveGraph }
}
