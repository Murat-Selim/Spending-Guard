"use client"
import { useState, useEffect } from "react"

interface Status {
  agentAddress: string
  maxPerTx: string
  dailyCap: string
  dailySpent: string
  remaining: string
  txHistory: Array<{ hash: string; to: string; value: string; time: string }>
}

interface Balance {
  balance: string
}

export default function Home() {
  const [status, setStatus] = useState<Status | null>(null)
  const [balance, setBalance] = useState<Balance | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [customRecipient, setCustomRecipient] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/status")
      const data = await res.json()
      setStatus(data)
      if (!customRecipient) {
        setCustomRecipient(data.agentAddress)
      }
    } catch (e) {}
  }

  const fetchBalance = async () => {
    try {
      const res = await fetch("/api/balance")
      const data = await res.json()
      setBalance(data)
    } catch (e) {}
  }

  useEffect(() => {
    fetchStatus()
    fetchBalance()
    const interval = setInterval(() => {
      fetchStatus()
      fetchBalance()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const sendTx = async (valueEth: string, recipient?: string) => {
    setLoading(true)
    try {
      const to = recipient || status?.agentAddress
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, valueEth }),
      })
      const data = await res.json()
      alert(data.success ? `Sent! Hash: ${data.hash}` : `Failed: ${data.reason || data.error}`)
      fetchStatus()
      fetchBalance()
    } catch (e: any) {
      alert(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`
  const copyAddress = () => {
    if (status?.agentAddress) {
      navigator.clipboard.writeText(status.agentAddress)
      alert("Address copied!")
    }
  }

  const dailySpent = status ? parseFloat(status.dailySpent) : 0
  const dailyCap = 0.01
  const progressPercent = Math.min(100, (dailySpent / dailyCap) * 100)

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Spending Guard</h1>
        <p className="text-zinc-400">Powered by OWS &middot; Base Sepolia</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 p-4 rounded-lg">
          <h3 className="text-zinc-400 text-sm mb-1">Agent Address</h3>
          {status && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{truncateAddress(status.agentAddress)}</span>
              <button onClick={copyAddress} className="text-xs text-blue-400 hover:text-blue-300">
                Copy
              </button>
            </div>
          )}
        </div>

        <div className="bg-zinc-900 p-4 rounded-lg">
          <h3 className="text-zinc-400 text-sm mb-1">ETH Balance</h3>
          <p className="text-2xl font-semibold">{balance ? parseFloat(balance.balance).toFixed(4) : "..."}</p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-lg">
          <h3 className="text-zinc-400 text-sm mb-2">Daily Spent</h3>
          <div className="w-full bg-zinc-800 rounded-full h-2 mb-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm">
            {dailySpent.toFixed(4)} / {dailyCap.toFixed(2)} ETH
          </p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-lg">
          <h3 className="text-zinc-400 text-sm mb-1">Remaining Today</h3>
          <p className="text-2xl font-semibold">
            {status ? parseFloat(status.remaining).toFixed(4) : "..."} ETH
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => sendTx("0.001")}
          disabled={loading}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold disabled:opacity-50"
        >
          Send 0.001 ETH
        </button>
        <button
          onClick={() => sendTx("0.005")}
          disabled={loading}
          className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold disabled:opacity-50"
        >
          Send 0.005 ETH
        </button>
        <button
          onClick={() => sendTx("0.008")}
          disabled={loading}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold disabled:opacity-50"
        >
          Send 0.008 ETH (Blocked)
        </button>
      </div>

      <div className="bg-zinc-900 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Custom Send</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Amount (ETH)"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="flex-1 px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Recipient (0x...)"
            value={customRecipient}
            onChange={(e) => setCustomRecipient(e.target.value)}
            className="flex-1 px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-blue-500 outline-none"
          />
          <button
            onClick={() => customAmount && sendTx(customAmount, customRecipient)}
            disabled={loading || !customAmount}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Transaction Log</h2>
        <div className="space-y-2">
          {status?.txHistory?.slice(-10).reverse().map((tx, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>{tx.value} ETH → {truncateAddress(tx.to)}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-zinc-400">
                <a
                  href={`https://sepolia.basescan.org/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400"
                >
                  {truncateAddress(tx.hash)}
                </a>
                <span>{new Date(tx.time).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
          {(!status?.txHistory || status.txHistory.length === 0) && (
            <p className="text-zinc-500 text-center py-4">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
