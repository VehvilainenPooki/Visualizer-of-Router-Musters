import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import { debounce } from "lodash-es"
import type { SaveStatus, SaveTarget } from "./Navbar/Components/SaveStatusButton"
import { Illustration } from "../../../common/types/illustration"
import * as ForceGraph from '../../ForceGraph'

const DEBOUNCE_MS = 3_000
const MAX_WAIT_MS = 30_000

interface Props {
  name: string
  description: string | null
  public: boolean
  saveTarget: SaveTarget
}

export function useSaveHandler({ name, description, public: isPublic, saveTarget }: Props) {
  const graphcode = useSyncExternalStore(ForceGraph.subscribeToData, ForceGraph.getData)
  const [statusOfSave, setStatusOfSave] = useState<SaveStatus>('saved')
  const [timeoutId, setTimeoutId] = useState<number>(-1)

  const runSave = useCallback(async (payload: Partial<Illustration>) => {
    if (timeoutId !== -1) {
      clearTimeout(timeoutId)
      setTimeoutId(-1)
    }
    if (saveTarget === 'none') {
      console.log(saveTarget, payload)
      return
    }
    try {
      console.log(saveTarget, payload)
      setStatusOfSave('success')
      setTimeoutId(setTimeout(() => {
        setStatusOfSave('saved')
      }, 300, ))
    } catch {
      setStatusOfSave('failed')
    }
  }, [saveTarget])

  const runSaveRef = useRef(runSave)
  runSaveRef.current = runSave

  const pendingPayload = useRef<Partial<Illustration>>({})

  const debouncedSave = useMemo(() => debounce(() => {
    const payload = pendingPayload.current
    pendingPayload.current = {}
    runSaveRef.current(payload)
  }, DEBOUNCE_MS, { maxWait: MAX_WAIT_MS }), [])

  useEffect(() => () => debouncedSave.cancel(), [debouncedSave])

  const queueSave = useCallback((payload: Partial<Illustration>) => {
    pendingPayload.current = { ...pendingPayload.current, ...payload }
    setStatusOfSave('saving')
    debouncedSave()
  }, [debouncedSave])

  const saveMetadata = useCallback(() => queueSave({ name, description }), [queueSave, name, description])
  const saveVisibility = useCallback(() => queueSave({ public: isPublic }), [queueSave, isPublic])
  const saveGraph = useCallback(() => queueSave({ graphcode }), [queueSave, graphcode])

  return { statusOfSave, saveMetadata, saveVisibility, saveGraph }
}
