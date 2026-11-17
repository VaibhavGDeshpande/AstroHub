import Link from 'next/link'
import { cardSections } from '@/components/cardData'
import HomeClient from './HomeClient'

// The visible homepage is client-only (ssr: false), so the first HTML a crawler
// receives was empty: no h1, no text, no links. This block is the server-rendered
// version of the same content: the headline and a link to every tool.
export default function HomePage() {
  return (
    <>
      <section className="sr-only" aria-label="About AstroHub">
        <h1>AstroHub: astronomy tools, sky charts and live space data</h1>
        <p>
          AstroHub is a free astronomy platform with a live sky chart, NASA APOD and EPIC imagery,
          near-Earth object tracking, satellite tracking, an astronomy weather dashboard, 3D
          planets and a telescope calculator.
        </p>
        <nav aria-label="AstroHub tools">
          <ul>
            {cardSections.flatMap((section) =>
              section.cards
                .filter((card) => !card.external)
                .map((card) => (
                  <li key={card.path}>
                    <Link href={card.path}>{card.title}</Link>: {card.description}
                  </li>
                )),
            )}
          </ul>
        </nav>
      </section>
      <HomeClient />
    </>
  )
}
