import { useCallback, useState, useSyncExternalStore } from "react"
import type { SaveStatus, SaveTarget } from "./Navbar/Components/SaveStatusButton"
import { Illustration } from "../../../common/types/illustration"
import * as ForceGraph from '../../ForceGraph'

interface Props {
  name: string
  description: string | null
  public: boolean
  saveTarget: SaveTarget
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    setStatusOfSave('failed')
    try {
      setStatusOfSave('saving')
      await wait(50)
      console.log(saveTarget, payload)
      setStatusOfSave('success')
      setTimeoutId(setTimeout(() => {
        setStatusOfSave('saved')
      }, 300, ))
    } catch {
      setStatusOfSave('failed')
    }
  }, [saveTarget])

  const saveMetadata = useCallback(() => runSave({ name, description }), [runSave, name, description])
  const saveVisibility = useCallback(() => runSave({ public: isPublic }), [runSave, isPublic])
  const saveGraph = useCallback(() => runSave({ graphcode }), [runSave, graphcode])
  const saveAll = useCallback(() => runSave({ name, description, public: isPublic, graphcode }), [runSave, name, description, isPublic, graphcode])

  return { statusOfSave, saveMetadata, saveVisibility, saveGraph, saveAll }
}
