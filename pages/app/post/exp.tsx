import { useState } from 'react'
import { css } from '@emotion/css'
import ExpEditor from '@/components/editor/ExpEditor'
import { Descendant, Element } from 'slate'
import Head from 'next/head'
import { CustomElement } from '@/types/editor'

export default function Exp() {

  const [data, setData] = useState<CustomElement[]>(initialValue)

  const onChange = (content: any) => setData(content);

  console.log(data)
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>

      <div className={css`
      padding: 2rem;
    `}>
        <div className={css`
        margin-bottom: 3rem;
      `}>
          <ExpEditor content={data} onChange={onChange} />
        </div>
        <div>
          {data.map((n) => {
            return (
              <pre className={css`
                text-wrap: wrap;
                margin-bottom: 1rem;
              `}>{Object.entries(n)
                .map(([key,value]) => <div style={{display:"block"}}>
                  &#123;<span style={{ color: "green" }}>"{key}"</span>: {JSON.stringify(value)}&#125;,
                </div>)}
              </pre>
            )
          })}
        </div>
      </div>
    </>
  )
}

const initialValue: CustomElement[] = [
  {
    type: 'paragraph',
    children: [
      { text: 'Почніть ' },
      { text: 'створювати', bold: true },
      { text: ' свій, ' },
      { text: 'найкращий', italic: true },
      { text: ' пост!' },
    ],
  },
]
