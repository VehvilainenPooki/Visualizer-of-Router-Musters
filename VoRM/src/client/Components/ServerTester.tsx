import { useState } from 'react'

import { testEcho } from '../services/networkGraphs'

import type { FC, SubmitEvent } from 'react'


const ServerTester: FC = () => {
  const [echo, setEcho] = useState('')
  const [response, setresponse] = useState('')
  const [error, setError] = useState('')

  const handleTest = async ( event: SubmitEvent ) => {
    event.preventDefault()
    if (echo) {
      const result = await testEcho(echo)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setresponse(result.data.message)
      setError('')
      setEcho('')
    }
  }

  return (
    <div>
      <h2>Test server connection</h2>
      <div>
        <form onSubmit={handleTest}>
          <input
            type="text"
            value={echo}
            onChange={(e) => setEcho(e.target.value)}
            placeholder="Message to echo"
          />
          <br/>
          <button type='submit'>Echo</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>latest response {response}</p>
      </div>
    </div>
  )
}

export default ServerTester
