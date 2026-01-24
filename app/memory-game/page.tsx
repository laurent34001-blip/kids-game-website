'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼']

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const duplicatedEmojis = [...emojis, ...emojis]
    const shuffled = duplicatedEmojis
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5)
    
    setCards(shuffled)
    setFlippedCards([])
    setMoves(0)
    setGameWon(false)
  }

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(id)) return
    if (cards[id].isMatched) return

    const newFlippedCards = [...flippedCards, id]
    setFlippedCards(newFlippedCards)

    const newCards = [...cards]
    newCards[id].isFlipped = true
    setCards(newCards)

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)
      const [firstId, secondId] = newFlippedCards
      
      if (cards[firstId].emoji === cards[secondId].emoji) {
        // Match found
        newCards[firstId].isMatched = true
        newCards[secondId].isMatched = true
        setCards(newCards)
        setFlippedCards([])
        
        // Check if game is won
        if (newCards.every(card => card.isMatched)) {
          setTimeout(() => setGameWon(true), 500)
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          const resetCards = [...newCards]
          resetCards[firstId].isFlipped = false
          resetCards[secondId].isFlipped = false
          setCards(resetCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/" className={styles.backButton}>
          ← Back to Home
        </Link>
        
        <h1 className={styles.title}>🧠 Memory Game 🧠</h1>
        <p className={styles.subtitle}>Find all the matching pairs!</p>
        
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Moves:</span>
            <span className={styles.statValue}>{moves}</span>
          </div>
          <button onClick={initializeGame} className={styles.resetButton}>
            🔄 New Game
          </button>
        </div>

        {gameWon && (
          <div className={styles.winMessage}>
            <h2>🎉 Congratulations! 🎉</h2>
            <p>You won in {moves} moves!</p>
            <button onClick={initializeGame} className={styles.playAgainButton}>
              Play Again
            </button>
          </div>
        )}

        <div className={styles.gameBoard}>
          {cards.map((card) => (
            <div
              key={card.id}
              className={`${styles.card} ${
                card.isFlipped || card.isMatched ? styles.flipped : ''
              } ${card.isMatched ? styles.matched : ''}`}
              onClick={() => handleCardClick(card.id)}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>?</div>
                <div className={styles.cardBack}>{card.emoji}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
